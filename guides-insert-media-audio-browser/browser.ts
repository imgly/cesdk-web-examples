import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Insert Audio Guide
 *
 * Demonstrates adding audio to video projects:
 * - Creating audio blocks programmatically
 * - Setting audio source URIs
 * - Configuring timeline position and duration
 * - Adjusting audio volume, mute, and loop settings
 * - Querying and managing audio blocks
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
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.scene.getCurrentPage();
    if (page == null) {
      throw new Error('No page found in scene');
    }

    // Set page duration for timeline
    engine.block.setDuration(page, 30);

    // Create an audio block and set source
    const audioUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';
    const audioBlock = engine.block.create('audio');
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);
    engine.block.appendChild(page, audioBlock);

    // Load audio resource to access duration
    await engine.block.forceLoadAVResource(audioBlock);
    const totalDuration = engine.block.getAVResourceTotalDuration(audioBlock);
    console.log('Audio total duration:', totalDuration, 'seconds');

    engine.block.setTimeOffset(audioBlock, 0);
    engine.block.setDuration(audioBlock, Math.min(totalDuration, 30));

    engine.block.setVolume(audioBlock, 0.8);
    const currentVolume = engine.block.getVolume(audioBlock);
    console.log('Audio volume:', currentVolume);

    engine.block.setMuted(audioBlock, false);
    const isMuted = engine.block.isMuted(audioBlock);
    console.log('Audio muted:', isMuted);

    engine.block.setLooping(audioBlock, false);
    const isLooping = engine.block.isLooping(audioBlock);
    console.log('Audio looping:', isLooping);

    const allAudioBlocks = engine.block.findByType('audio');
    console.log('Total audio blocks:', allAudioBlocks.length);

    // Log information about each audio block
    allAudioBlocks.forEach((block, index) => {
      const uri = engine.block.getString(block, 'audio/fileURI');
      const timeOffset = engine.block.getTimeOffset(block);
      const duration = engine.block.getDuration(block);
      const volume = engine.block.getVolume(block);

      console.log(`Audio block ${index + 1}:`, {
        uri: uri.split('/').pop(),
        timeOffset: `${timeOffset}s`,
        duration: `${duration}s`,
        volume: `${(volume * 100).toFixed(0)}%`
      });
    });

    // Create a second audio block to demonstrate removal
    const tempAudioBlock = engine.block.create('audio');
    engine.block.appendChild(page, tempAudioBlock);

    engine.block.destroy(tempAudioBlock);

    console.log(
      'Insert Audio guide initialized. Open the timeline to see audio tracks.'
    );
  }
}

export default Example;
