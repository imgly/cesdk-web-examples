import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Adjust Audio Speed Guide
 *
 * Demonstrates audio playback speed adjustment in CE.SDK:
 * - Loading audio files
 * - Adjusting playback speed with setPlaybackSpeed
 * - Three speed presets: slow-motion (0.5x), normal (1.0x), and maximum (3.0x)
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

    // Load assets and create a video scene (required for audio support)
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
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

    // Slow Motion Audio (0.5x - half speed)
    const slowAudioBlock = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, slowAudioBlock);
    engine.block.setPositionX(slowAudioBlock, 100);
    engine.block.setPositionY(slowAudioBlock, 200);
    engine.block.setPlaybackSpeed(slowAudioBlock, 0.5);

    // Normal Speed Audio (1.0x)
    const normalAudioBlock = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, normalAudioBlock);
    engine.block.setPositionX(normalAudioBlock, 100);
    engine.block.setPositionY(normalAudioBlock, 400);
    engine.block.setPlaybackSpeed(normalAudioBlock, 1.0);

    // Maximum Speed Audio (3.0x - triple speed)
    const maxSpeedAudioBlock = engine.block.duplicate(audioBlock);
    engine.block.appendChild(page, maxSpeedAudioBlock);
    engine.block.setPositionX(maxSpeedAudioBlock, 100);
    engine.block.setPositionY(maxSpeedAudioBlock, 600);
    engine.block.setPlaybackSpeed(maxSpeedAudioBlock, 3.0);

    // Log duration changes for demonstration
    const slowDuration = engine.block.getDuration(slowAudioBlock);
    const normalDuration = engine.block.getDuration(normalAudioBlock);
    const maxDuration = engine.block.getDuration(maxSpeedAudioBlock);

    // eslint-disable-next-line no-console
    console.log(`Slow motion (0.5x) duration: ${slowDuration.toFixed(2)}s`);
    // eslint-disable-next-line no-console
    console.log(`Normal speed (1.0x) duration: ${normalDuration.toFixed(2)}s`);
    // eslint-disable-next-line no-console
    console.log(`Maximum speed (3.0x) duration: ${maxDuration.toFixed(2)}s`);

    // Remove the original audio block (we only need the duplicates)
    engine.block.destroy(audioBlock);

    // Zoom to fit all audio blocks and labels
    engine.scene.zoomToBlock(page, 40, 40, 40, 40);
  }
}

export default Example;
