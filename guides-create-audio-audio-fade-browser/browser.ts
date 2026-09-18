import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ImageColorsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
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

/**
 * CE.SDK Plugin: Fade Audio In and Out Guide
 *
 * Demonstrates audio fades in CE.SDK:
 * - Fading audio in with setAudioFadeIn
 * - Fading audio out with setAudioFadeOut
 * - Shaping a fade with an easing curve
 * - Fading the embedded audio of a video fill
 * - Reading fade settings back through block properties
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
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
    await cesdk.addPlugin(
      new PagePresetsAssetSource({
        include: [
          'ly.img.page.presets.instagram.*',
          'ly.img.page.presets.facebook.*',
          'ly.img.page.presets.x.*',
          'ly.img.page.presets.linkedin.*',
          'ly.img.page.presets.pinterest.*',
          'ly.img.page.presets.tiktok.*',
          'ly.img.page.presets.youtube.*',
          'ly.img.page.presets.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      layout: 'DepthStack',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story',
        color: { r: 0, g: 0, b: 0, a: 1 }
      }
    });

    const engine = cesdk.engine;
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;
    engine.block.setDuration(page, 18);

    const audioUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create an audio block and load the audio file.
    const audioBlock = engine.block.create('audio');
    engine.block.appendChild(page, audioBlock);
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Wait for the resource so the block reports its real metadata.
    await engine.block.forceLoadAVResource(audioBlock);

    engine.block.setTimeOffset(audioBlock, 0);
    engine.block.setDuration(audioBlock, 8);

    // Ramp the audio up from silence over the first 2 seconds of the block.
    engine.block.setAudioFadeIn(audioBlock, 2);

    // Ramp the audio back down to silence over the last 3 seconds of the block.
    engine.block.setAudioFadeOut(audioBlock, 3);

    // Pass an easing curve to shape the ramp. The default is 'Linear'.
    const easedAudio = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, easedAudio);
    engine.block.setTimeOffset(easedAudio, 9);
    engine.block.setDuration(easedAudio, 8);
    engine.block.setAudioFadeIn(easedAudio, 2, 'EaseInOut');
    engine.block.setAudioFadeOut(easedAudio, 2, 'EaseInOut');

    // Add a video clip on its own track so the page shows moving footage.
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);
    const videoClip = await engine.block.addVideo(videoUri, 1280, 720, {
      timeline: { duration: 8, timeOffset: 0 }
    });
    engine.block.appendChild(track, videoClip);
    engine.block.fillParent(track);

    // Video audio lives on the video fill, so the fade is set on the fill.
    const videoFill = engine.block.getFill(videoClip);
    await engine.block.forceLoadAVResource(videoFill);

    engine.block.setAudioFadeIn(videoFill, 1.5);
    engine.block.setAudioFadeOut(videoFill, 1.5);

    // Fades are block properties, so they read back through getDouble and getEnum.
    const fadeInDuration = engine.block.getDouble(
      easedAudio,
      'playback/fadeIn/duration'
    );
    const fadeInEasing = engine.block.getEnum(
      easedAudio,
      'playback/fadeIn/easing'
    );
    const fadeOutDuration = engine.block.getDouble(
      easedAudio,
      'playback/fadeOut/duration'
    );

    // eslint-disable-next-line no-console
    console.log(`Fade in: ${fadeInDuration}s (${fadeInEasing})`);
    // eslint-disable-next-line no-console
    console.log(`Fade out: ${fadeOutDuration}s`);

    // A duration of 0 removes a fade again.
    engine.block.setAudioFadeOut(easedAudio, 0);

    // Zoom to fit the composition.
    engine.scene.zoomToBlock(page, 40, 40, 40, 40);
  }
}

export default Example;
