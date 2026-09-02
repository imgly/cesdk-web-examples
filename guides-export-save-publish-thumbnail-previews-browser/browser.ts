import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import type CreativeEngine from '@cesdk/engine';
import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  ImageColorsAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { VideoEditorConfig } from './video-editor/plugin';
import packageJson from './package.json';

const VIDEO_URI = 'https://img.ly/static/ubq_video_samples/bbb.mp4';
const AUDIO_URI =
  'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';

const PAGE_WIDTH = 1920;
const PAGE_HEIGHT = 1080;
const PAGE_DURATION = 12;

type PanelSlot =
  | 'storyboard'
  | 'previewFrame'
  | 'pagePreview'
  | 'filmstrip'
  | 'waveform';

/** Where each generated preview is placed on the page, in design units. */
const PANEL_SLOTS: Record<PanelSlot, { x: number; y: number; width: number }> =
  {
    storyboard: { x: 60, y: 60, width: 1800 },
    previewFrame: { x: 60, y: 240, width: 500 },
    pagePreview: { x: 620, y: 240, width: 500 },
    filmstrip: { x: 60, y: 700, width: 1800 },
    waveform: { x: 60, y: 850, width: 1800 }
  };

/** Renders a normalized `[0, 1]` envelope as mirrored bars around a centerline. */
function drawWaveform(envelope: Float32Array): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = envelope.length * 2;
  canvas.height = 128;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create a 2D canvas context');

  context.fillStyle = '#12121a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const centerLine = canvas.height / 2;
  context.fillStyle = '#7a8cff';

  for (let i = 0; i < envelope.length; i++) {
    // The values are already normalized, so each one maps straight onto a bar
    // height. No peak finding and no rescaling.
    const amplitude = Math.max(envelope[i] * centerLine, 0.5);
    context.fillRect(i * 2, centerLine - amplitude, 1, amplitude * 2);
  }

  return canvas;
}

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  private engine!: CreativeEngine;

  private page!: number;

  private videoFill!: number;

  private audioBlock!: number;

  private videoDuration = 0;

  private audioDuration = 0;

  private panels = new Map<PanelSlot, { block: number; url: string }>();

  /** The cancel closure of the request currently running for a given block. */
  private inFlight = new Map<number, () => void>();

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      layout: 'DepthStack',
      page: { width: PAGE_WIDTH, height: PAGE_HEIGHT, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    this.engine = engine;

    const page = engine.scene.getCurrentPage();
    if (page == null) throw new Error('No page found in the scene');
    this.page = page;
    engine.block.setDuration(page, PAGE_DURATION);

    // A video clip on the background track. The fill is the block that owns
    // the media file, and the fill is what decodes real frames.
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    const videoBlock = engine.block.create('graphic');
    engine.block.setShape(videoBlock, engine.block.createShape('rect'));
    engine.block.setWidth(videoBlock, PAGE_WIDTH);
    engine.block.setHeight(videoBlock, PAGE_HEIGHT);

    const videoFill = engine.block.createFill('video');
    engine.block.setString(videoFill, 'fill/video/fileURI', VIDEO_URI);
    engine.block.setFill(videoBlock, videoFill);
    engine.block.appendChild(track, videoBlock);
    engine.block.setDuration(videoBlock, PAGE_DURATION);
    this.videoFill = videoFill;

    // A separate audio clip for the waveform.
    const audioBlock = engine.block.create('audio');
    engine.block.setString(audioBlock, 'audio/fileURI', AUDIO_URI);
    engine.block.appendChild(page, audioBlock);
    engine.block.setTimeOffset(audioBlock, 0);
    engine.block.setDuration(audioBlock, PAGE_DURATION);
    this.audioBlock = audioBlock;

    // Not strictly required — both APIs wait for the resource — but loading
    // up front means the first request does not race the download.
    await engine.block.forceLoadAVResource(videoFill);
    await engine.block.forceLoadAVResource(audioBlock);

    this.videoDuration = engine.block.getAVResourceTotalDuration(videoFill);
    this.audioDuration = engine.block.getAVResourceTotalDuration(audioBlock);

    await engine.scene.zoomToBlock(page, { padding: 40 });

    this.addActions(cesdk);

    // Kick off one video and one audio sequence. They run side by side: the
    // engine advances the front video request and the front audio request on
    // every tick.
    this.generateFilmstrip();
    this.generateWaveform();
  }

  /** A filmstrip of decoded frames sampled across the source media file. */
  private generateFilmstrip(): void {
    const engine = this.engine;
    const numberOfFrames = 12;
    const thumbnailHeight = 96;

    const strip = document.createElement('canvas');
    const context = strip.getContext('2d');
    if (!context) throw new Error('Could not create a 2D canvas context');

    let sized = false;
    let received = 0;

    // A block can only have one request in flight, and a second one waits for
    // the first instead of failing. Cancel before asking again.
    this.cancelPending(this.videoFill);

    const cancel = engine.block.generateVideoThumbnailSequence(
      // A video fill decodes real frames. The times are media time in the
      // source file, so trim, time offset, speed and looping are ignored.
      this.videoFill,
      thumbnailHeight,
      0,
      this.videoDuration,
      numberOfFrames,
      (frameIndex, result) => {
        if (result instanceof Error) {
          // An error ends the sequence. No further frames arrive.
          console.error('Filmstrip failed:', result.message);
          return;
        }

        // The engine derives the width from the frame's aspect ratio, so the
        // canvas can only be sized once the first frame is in.
        if (!sized) {
          strip.width = result.width * numberOfFrames;
          strip.height = result.height;
          sized = true;
        }

        // Frames are not guaranteed to arrive in index order — always place
        // each frame at its reported index.
        context.putImageData(result, frameIndex * result.width, 0);

        // There is no completion callback, and the reported index is always 0
        // on error, so counting arrivals is the only reliable finish test.
        received += 1;
        if (received === numberOfFrames) {
          void this.publishCanvas('filmstrip', strip);
        }
      }
    );

    this.inFlight.set(this.videoFill, cancel);
  }

  /** A storyboard of the composed page rendered at several points in time. */
  private generateStoryboard(): void {
    const engine = this.engine;
    const numberOfFrames = 8;
    const thumbnailHeight = 96;

    const board = document.createElement('canvas');
    const context = board.getContext('2d');
    if (!context) throw new Error('Could not create a 2D canvas context');

    let sized = false;
    let received = 0;

    this.cancelPending(this.page);

    const cancel = engine.block.generateVideoThumbnailSequence(
      // Passing a page — or any design block below a page — re-renders the
      // composed scene instead of decoding a file. Times are relative to the
      // block's own time offset on the page timeline.
      this.page,
      thumbnailHeight,
      0,
      engine.block.getDuration(this.page),
      numberOfFrames,
      (frameIndex, result) => {
        if (result instanceof Error) {
          console.error('Storyboard failed:', result.message);
          return;
        }

        if (!sized) {
          board.width = result.width * numberOfFrames;
          board.height = result.height;
          sized = true;
        }

        context.putImageData(result, frameIndex * result.width, 0);

        received += 1;
        if (received === numberOfFrames) {
          void this.publishCanvas('storyboard', board);
        }
      }
    );

    this.inFlight.set(this.page, cancel);
  }

  /** A waveform envelope for the audio clip. */
  private generateWaveform(): void {
    const engine = this.engine;
    const samplesPerChunk = 64;
    const numberOfSamples = 768;
    const numberOfChannels = 1;
    const numberOfChunks = Math.ceil(numberOfSamples / samplesPerChunk);

    const envelope = new Float32Array(numberOfSamples);
    let received = 0;

    // Compressed audio is throttled per tick, so only ask for the window that
    // actually sits on the timeline instead of the whole file.
    const timeEnd = Math.min(this.audioDuration, PAGE_DURATION);

    this.cancelPending(this.audioBlock);

    const cancel = engine.block.generateAudioThumbnailSequence(
      // Only an audio block or a video fill is accepted here. A page or a
      // graphic is rejected.
      this.audioBlock,
      samplesPerChunk,
      0,
      timeEnd,
      numberOfSamples,
      numberOfChannels,
      (chunkIndex, result) => {
        if (result instanceof Error) {
          console.error('Waveform failed:', result.message);
          return;
        }

        // On Web this Float32Array is a zero-copy view into the WASM heap.
        // Copy it here, synchronously, before doing anything else with it.
        const chunk = result.slice();

        // numberOfSamples counts samples per channel, and stereo chunks
        // interleave left and right, so step by numberOfChannels. The final
        // chunk is shorter whenever the total does not divide evenly.
        const sampleCount = chunk.length / numberOfChannels;
        const offset = chunkIndex * samplesPerChunk;
        for (let i = 0; i < sampleCount; i++) {
          envelope[offset + i] = chunk[i * numberOfChannels];
        }

        received += 1;
        if (received === numberOfChunks) {
          void this.publishCanvas('waveform', drawWaveform(envelope));
        }
      }
    );

    this.inFlight.set(this.audioBlock, cancel);
  }

  /** A single preview frame of the video at one point in time. */
  private generatePreviewFrame(): void {
    const engine = this.engine;
    const time = Math.min(2, this.videoDuration);

    this.cancelPending(this.videoFill);

    const cancel = engine.block.generateVideoThumbnailSequence(
      this.videoFill,
      180,
      time,
      time,
      // With a single frame, a video fill returns exactly timeBegin.
      1,
      (frameIndex, result) => {
        if (result instanceof Error) {
          console.error('Preview frame failed:', result.message);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = result.width;
        canvas.height = result.height;
        canvas.getContext('2d')?.putImageData(result, 0, 0);

        void this.publishCanvas('previewFrame', canvas);
      }
    );

    this.inFlight.set(this.videoFill, cancel);
  }

  /** The browser-only shortcut: one PNG of the current page at a given time. */
  private async generatePagePreview(): Promise<void> {
    // It also runs on the current page, so it queues behind a storyboard.
    this.cancelPending(this.page);

    const height = 256;
    const blob = await this.engine.block.generateThumbnailAtTimeOffset(
      height,
      4
    );

    const width = Math.round((height * PAGE_WIDTH) / PAGE_HEIGHT);
    await this.publishPanel('pagePreview', blob, width, height);
  }

  /** Start a long sequence and stop it with the returned cancel closure. */
  private demonstrateCancellation(): void {
    const engine = this.engine;
    const numberOfFrames = 240;
    let received = 0;

    this.cancelPending(this.videoFill);

    const cancel = engine.block.generateVideoThumbnailSequence(
      this.videoFill,
      64,
      0,
      this.videoDuration,
      numberOfFrames,
      (frameIndex, result) => {
        if (result instanceof Error) return;
        received += 1;
      }
    );
    this.inFlight.set(this.videoFill, cancel);

    // The flag is honored on the next engine tick, so frames already produced
    // this tick still arrive. Nothing is delivered because of the cancel
    // itself — no final error and no completion signal.
    window.setTimeout(() => {
      this.cancelPending(this.videoFill);
      console.log(
        `Cancelled after ${received} of ${numberOfFrames} frames arrived`
      );
    }, 400);
  }

  /** Stops whatever sequence is still running for a block. */
  private cancelPending(block: number): void {
    // Cancelling twice, after completion, or after a failure is a safe no-op.
    this.inFlight.get(block)?.();
    this.inFlight.delete(block);
  }

  /**
   * Encodes a canvas and places it on the page.
   *
   * `toBlob` is asynchronous, which keeps the scene mutation out of the
   * thumbnail callback — that callback runs inside the engine's update loop,
   * and writing to the scene from there re-enters the engine.
   */
  private async publishCanvas(
    slot: PanelSlot,
    canvas: HTMLCanvasElement
  ): Promise<void> {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
    if (!blob) throw new Error(`Could not encode the ${slot} panel`);

    await this.publishPanel(slot, blob, canvas.width, canvas.height);
  }

  /** Places an encoded preview on the page, replacing whatever was there. */
  private async publishPanel(
    slot: PanelSlot,
    blob: Blob,
    pixelWidth: number,
    pixelHeight: number
  ): Promise<void> {
    const engine = this.engine;
    const { x, y, width } = PANEL_SLOTS[slot];
    const height = (width * pixelHeight) / pixelWidth;

    const previous = this.panels.get(slot);
    if (previous) {
      engine.block.destroy(previous.block);
      URL.revokeObjectURL(previous.url);
      this.panels.delete(slot);
    }

    const url = URL.createObjectURL(blob);

    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));

    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', url);
    engine.block.setFill(block, fill);

    engine.block.setWidth(block, width);
    engine.block.setHeight(block, height);
    engine.block.setPositionX(block, x);
    engine.block.setPositionY(block, y);
    engine.block.appendChild(this.page, block);
    engine.block.setTimeOffset(block, 0);
    engine.block.setDuration(block, engine.block.getDuration(this.page));

    this.panels.set(slot, { block, url });

    await engine.block.forceLoadResources([fill]);
  }

  private addActions(cesdk: EditorPluginContext['cesdk']): void {
    if (!cesdk) return;

    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-filmstrip',
            label: 'Filmstrip',
            icon: '@imgly/Video',
            onClick: () => this.generateFilmstrip()
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-storyboard',
            label: 'Storyboard',
            icon: '@imgly/Timeline',
            onClick: () => this.generateStoryboard()
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-waveform',
            label: 'Waveform',
            icon: '@imgly/Adjustments',
            onClick: () => this.generateWaveform()
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-frame',
            label: 'Single Frame',
            icon: '@imgly/Image',
            onClick: () => this.generatePreviewFrame()
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-page',
            label: 'Page PNG',
            icon: '@imgly/Save',
            onClick: () => {
              this.generatePagePreview().catch((error) => {
                console.error('Page preview failed:', error);
              });
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-cancel',
            label: 'Cancel Demo',
            icon: '@imgly/Reload',
            onClick: () => this.demonstrateCancellation()
          }
        ]
      }
    );
  }
}

export default Example;
