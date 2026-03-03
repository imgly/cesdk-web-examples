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
 * CE.SDK Plugin: Adjust Audio Volume Guide
 *
 * Demonstrates audio volume control in CE.SDK:
 * - Setting volume levels with setVolume
 * - Muting and unmuting with setMuted
 * - Querying volume and mute states
 * - Volume levels for multiple audio sources
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable audio and video features in CE.SDK
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.audio');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');
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
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    // Use a sample audio file
    const audioUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';

    // Create an audio block and load the audio file
    const audioBlock = engine.block.create('audio');
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Wait for audio resource to load
    await engine.block.forceLoadAVResource(audioBlock);

    // Set volume to 80% (0.8 on a 0.0-1.0 scale)
    const fullVolumeAudio = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, fullVolumeAudio);
    engine.block.setTimeOffset(fullVolumeAudio, 0);
    engine.block.setVolume(fullVolumeAudio, 0.8);

    // Set volume to 30% for background music
    const lowVolumeAudio = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, lowVolumeAudio);
    engine.block.setTimeOffset(lowVolumeAudio, 5);
    engine.block.setVolume(lowVolumeAudio, 0.3);

    // Mute an audio block (preserves volume setting)
    const mutedAudio = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, mutedAudio);
    engine.block.setTimeOffset(mutedAudio, 10);
    engine.block.setVolume(mutedAudio, 1.0);
    engine.block.setMuted(mutedAudio, true);

    // Query current volume and mute states
    const currentVolume = engine.block.getVolume(fullVolumeAudio);
    const isMuted = engine.block.isMuted(mutedAudio);
    const isForceMuted = engine.block.isForceMuted(mutedAudio);

    // eslint-disable-next-line no-console
    console.log(`Full volume audio: ${(currentVolume * 100).toFixed(0)}%`);
    // eslint-disable-next-line no-console
    console.log(
      `Low volume audio: ${(
        engine.block.getVolume(lowVolumeAudio) * 100
      ).toFixed(0)}%`
    );
    // eslint-disable-next-line no-console
    console.log(
      `Muted audio - isMuted: ${isMuted}, isForceMuted: ${isForceMuted}`
    );

    // Remove the original audio block (we only need the duplicates)
    engine.block.destroy(audioBlock);

    // Zoom to fit all audio blocks
    engine.scene.zoomToBlock(page, 40, 40, 40, 40);
  }
}

export default Example;
