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

/**
 * CE.SDK Plugin: Audio Loop Guide
 *
 * Demonstrates audio looping capabilities in CE.SDK:
 * - Creating audio blocks with looping enabled
 * - Controlling looping behavior with duration
 * - Querying looping state
 * - Disabling looping for one-time playback
 * - Understanding loop and duration interaction
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
      page: { width: 1280, height: 720, unit: 'Pixel' }
    });

    // Enable video and audio features
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    const engine = cesdk.engine;
    const scene = engine.scene.get()!;
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    engine.block.setDuration(page, 30); // 30 second timeline

    // Use sample audio from demo assets
    const audioUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';

    // Create a basic audio block
    const audioBlock = engine.block.create('audio')!;
    engine.block.appendChild(page, audioBlock);

    // Set the audio source URI
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Load the audio resource to access metadata like duration
    await engine.block.forceLoadAVResource(audioBlock);

    // Get the total audio duration
    const audioDuration = engine.block.getDouble(
      audioBlock,
      'audio/totalDuration'
    );
    // eslint-disable-next-line no-console
    console.log('Audio duration:', audioDuration, 'seconds');

    // Enable looping for this audio block
    engine.block.setLooping(audioBlock, true);

    // Set the block duration longer than the audio length
    // The audio will loop to fill the entire duration
    engine.block.setDuration(audioBlock, 15);

    // eslint-disable-next-line no-console
    console.log('Looping enabled - audio will repeat to fill 15 seconds');

    // Check if an audio block is set to loop
    const isLooping = engine.block.isLooping(audioBlock);
    // eslint-disable-next-line no-console
    console.log('Is looping:', isLooping); // true

    // Create a second audio block to demonstrate non-looping behavior
    const nonLoopingAudio = engine.block.create('audio')!;
    engine.block.appendChild(page, nonLoopingAudio);
    engine.block.setString(nonLoopingAudio, 'audio/fileURI', audioUri);
    await engine.block.forceLoadAVResource(nonLoopingAudio);

    // Set time offset so it doesn't overlap with first audio
    engine.block.setTimeOffset(nonLoopingAudio, 16);

    // Disable looping (or leave it at default false)
    engine.block.setLooping(nonLoopingAudio, false);

    // Set duration longer than audio length
    // Audio will play once and stop (no looping)
    engine.block.setDuration(nonLoopingAudio, 12);

    // eslint-disable-next-line no-console
    console.log('Looping disabled - audio plays once and stops');

    // Create a third audio block demonstrating looping with trim
    const trimmedLoopAudio = engine.block.create('audio')!;
    engine.block.appendChild(page, trimmedLoopAudio);
    engine.block.setString(trimmedLoopAudio, 'audio/fileURI', audioUri);
    await engine.block.forceLoadAVResource(trimmedLoopAudio);

    // Trim to a 2-second segment
    engine.block.setTrimOffset(trimmedLoopAudio, 1.0);
    engine.block.setTrimLength(trimmedLoopAudio, 2.0);

    // Enable looping and set duration longer than trim length
    engine.block.setLooping(trimmedLoopAudio, true);
    engine.block.setDuration(trimmedLoopAudio, 8.0);

    // Position in timeline
    engine.block.setTimeOffset(trimmedLoopAudio, 29);

    // eslint-disable-next-line no-console
    console.log('Trimmed loop - 2s segment will loop 4 times to fill 8s');

    // Select the first audio block to show it in timeline
    engine.block.setSelected(audioBlock, true);

    // eslint-disable-next-line no-console
    console.log('Audio looping guide initialized successfully');
  }
}

export default Example;
