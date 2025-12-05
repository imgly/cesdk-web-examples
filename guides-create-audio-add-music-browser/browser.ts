import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Add Music Guide
 *
 * Demonstrates adding background music to video projects:
 * - Creating audio blocks programmatically
 * - Setting audio source URIs
 * - Configuring timeline position and duration
 * - Adjusting audio volume
 * - Querying audio assets from the library
 * - Managing audio blocks
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Video mode for audio support
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;
    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found in scene');
    }

    // Set page dimensions for video (16:9)
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);

    // Set page duration for timeline
    engine.block.setDuration(page, 30);

    // Enable audio and timeline features for the UI
    cesdk.feature.enable('ly.img.video.timeline');
    cesdk.feature.enable('ly.img.video.audio');
    cesdk.feature.enable('ly.img.video.controls.playback');

    // Create an audio block for background music
    const audioBlock = engine.block.create('audio');

    // Set the audio source file
    const audioUri =
      'https://cdn.img.ly/assets/demo/v2/ly.img.audio/audios/far_from_home.m4a';
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Append audio to the page (makes it part of the timeline)
    engine.block.appendChild(page, audioBlock);

    // Wait for audio to load to get duration
    await engine.block.forceLoadAVResource(audioBlock);

    // Get the total duration of the audio file
    const totalDuration = engine.block.getAVResourceTotalDuration(audioBlock);
    console.log('Audio total duration:', totalDuration, 'seconds');

    // Set when the audio starts on the timeline (0 = beginning)
    engine.block.setTimeOffset(audioBlock, 0);

    // Set how long the audio plays (use full duration or page duration)
    const playbackDuration = Math.min(totalDuration, 30);
    engine.block.setDuration(audioBlock, playbackDuration);

    // Set the audio volume (0.0 = mute, 1.0 = full volume)
    engine.block.setVolume(audioBlock, 0.8);

    // Get current volume
    const currentVolume = engine.block.getVolume(audioBlock);
    console.log('Audio volume:', currentVolume);

    // Query available audio tracks from the asset library
    const audioAssets = await engine.asset.findAssets('ly.img.audio', {
      page: 0,
      perPage: 10
    });

    console.log('Available audio assets:', audioAssets.assets.length);

    // Log metadata for each audio asset
    audioAssets.assets.forEach((asset) => {
      console.log('Audio asset:', {
        id: asset.id,
        label: asset.label,
        duration: asset.meta?.duration,
        uri: asset.meta?.uri
      });
    });

    // Find all audio blocks in the scene
    const allAudioBlocks = engine.block.findByType('audio');
    console.log('Total audio blocks:', allAudioBlocks.length);

    // Get information about each audio block
    allAudioBlocks.forEach((block, index) => {
      const uri = engine.block.getString(block, 'audio/fileURI');
      const timeOffset = engine.block.getTimeOffset(block);
      const duration = engine.block.getDuration(block);
      const volume = engine.block.getVolume(block);

      console.log(`Audio block ${index + 1}:`, {
        uri: uri.split('/').pop(), // Just filename
        timeOffset: `${timeOffset}s`,
        duration: `${duration}s`,
        volume: `${(volume * 100).toFixed(0)}%`
      });
    });

    // Example: Remove the second audio block if it exists
    if (allAudioBlocks.length > 1) {
      const blockToRemove = allAudioBlocks[1];

      // Destroy the block to remove it and free resources
      engine.block.destroy(blockToRemove);

      console.log('Removed second audio block');
    }

    console.log(
      'Add Music guide initialized. Open the timeline to see audio tracks.'
    );
  }
}

export default Example;
