import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
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

// Helper function to create a WAV file from audio samples
function createWavFile(
  samples: Float32Array,
  sampleRate: number,
  numChannels: number
): Uint8Array {
  const bytesPerSample = 2; // 16-bit audio
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const fileSize = 44 + dataSize; // WAV header is 44 bytes

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize - 8, true); // File size minus RIFF header
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bytesPerSample * 8, true); // BitsPerSample

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // Write audio samples as 16-bit PCM
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    // Convert float (-1 to 1) to 16-bit integer
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

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
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
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
      mode: 'Video',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }
    });

    const engine = cesdk.engine;

    // Get the page (first container in video scenes)
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Add a centered text block to explain the example
    const textBlock = engine.block.create('text');
    engine.block.setString(
      textBlock,
      'text/text',
      'The audio track in this scene lives in a buffer.'
    );
    engine.block.setFloat(textBlock, 'text/fontSize', 108);
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setHeightMode(textBlock, 'Auto');

    // Set text color to white
    engine.block.setColor(textBlock, 'fill/solid/color', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });

    // Get page dimensions and position with 10% horizontal margin
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const horizontalMargin = pageWidth * 0.1;
    const textWidth = pageWidth - horizontalMargin * 2;
    engine.block.setWidth(textBlock, textWidth);
    engine.block.setPositionX(textBlock, horizontalMargin);

    // Append to page first so layout can be computed
    engine.block.appendChild(page, textBlock);

    // Force layout computation and get the actual frame height
    const textHeight = engine.block.getFrameHeight(textBlock);
    engine.block.setPositionY(textBlock, (pageHeight - textHeight) / 2);

    // Set duration to match the scene
    engine.block.setDuration(textBlock, 2);

    // Create a buffer and get its URI
    const bufferUri = engine.editor.createBuffer();
    console.log('Buffer URI:', bufferUri);

    // Generate sine wave audio samples
    const sampleRate = 44100;
    const duration = 2; // 2 seconds
    const frequency = 440; // A4 note
    const numChannels = 2; // Stereo

    // Create Float32Array for audio samples (interleaved stereo)
    const numSamples = sampleRate * duration * numChannels;
    const samples = new Float32Array(numSamples);

    // Generate a 440 Hz sine wave
    for (let i = 0; i < numSamples; i += numChannels) {
      const sampleIndex = i / numChannels;
      const time = sampleIndex / sampleRate;
      const value = Math.sin(2 * Math.PI * frequency * time) * 0.5; // 50% amplitude

      // Write to both left and right channels
      samples[i] = value; // Left channel
      samples[i + 1] = value; // Right channel
    }

    // Convert samples to WAV format and write to buffer
    const wavData = createWavFile(samples, sampleRate, numChannels);
    engine.editor.setBufferData(bufferUri, 0, wavData);

    // Verify the buffer length
    const bufferLength = engine.editor.getBufferLength(bufferUri);
    console.log('Buffer length:', bufferLength, 'bytes');

    // Create an audio block
    const audioBlock = engine.block.create('audio');

    // Assign the buffer URI to the audio block
    engine.block.setString(audioBlock, 'audio/fileURI', bufferUri);

    // Set audio duration to match the generated samples
    engine.block.setDuration(audioBlock, duration);

    // Append the audio block to the page
    engine.block.appendChild(page, audioBlock);

    // Demonstrate reading buffer data back
    const readData = engine.editor.getBufferData(bufferUri, 0, 100);
    console.log('First 100 bytes of buffer data:', readData);

    // Demonstrate resizing a buffer with a separate demo buffer
    const demoBuffer = engine.editor.createBuffer();
    engine.editor.setBufferData(
      demoBuffer,
      0,
      new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
    );

    const demoLength = engine.editor.getBufferLength(demoBuffer);
    console.log('Demo buffer length before resize:', demoLength);

    engine.editor.setBufferLength(demoBuffer, demoLength / 2);
    console.log(
      'Demo buffer length after resize:',
      engine.editor.getBufferLength(demoBuffer)
    );

    engine.editor.destroyBuffer(demoBuffer);

    // Find all transient resources (including our buffer)
    const transientResources = engine.editor.findAllTransientResources();
    console.log('Transient resources in scene:');
    for (const resource of transientResources) {
      console.log(`  URL: ${resource.URL}, Size: ${resource.size} bytes`);
    }

    // Demonstrate persisting buffer data using a Blob URL
    // In production, you would upload to CDN/cloud storage instead
    const bufferData = engine.editor.getBufferData(bufferUri, 0, bufferLength);
    const blob = new Blob([new Uint8Array(bufferData)], { type: 'audio/wav' });
    const persistentUrl = URL.createObjectURL(blob);

    // Update all references from buffer:// to the new URL
    engine.editor.relocateResource(bufferUri, persistentUrl);
    console.log('Buffer relocated to:', persistentUrl);

    console.log('Buffers example loaded successfully');
    console.log(
      'Note: Audio playback requires user interaction in most browsers'
    );
  }
}

export default Example;
