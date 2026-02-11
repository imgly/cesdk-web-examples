import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });

    // Create a video scene
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Get the page and set to 16:9 landscape for video
    const page = engine.block.findByType('page')[0]!;

    // Create a track for video blocks
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    // Create a video block and add it to the track
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';
    const videoBlock = engine.block.create('graphic');
    engine.block.setShape(videoBlock, engine.block.createShape('rect'));
    engine.block.setWidth(videoBlock, 1920);
    engine.block.setHeight(videoBlock, 1080);

    // Create and configure video fill
    const videoFill = engine.block.createFill('video');
    engine.block.setString(videoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(videoBlock, videoFill);

    // Add to track and set duration
    engine.block.appendChild(track, videoBlock);
    engine.block.setDuration(videoBlock, 10);

    await engine.block.forceLoadAVResource(videoFill);

    const videoWidth = engine.block.getVideoWidth(videoFill);
    const videoHeight = engine.block.getVideoHeight(videoFill);
    const totalDuration = engine.block.getAVResourceTotalDuration(videoFill);
    console.log(`Video dimensions: ${videoWidth}x${videoHeight}`);
    console.log(`Total duration: ${totalDuration}s`);

    if (engine.block.supportsPlaybackControl(page)) {
      console.log(`Is playing: ${engine.block.isPlaying(page)}`);
      engine.block.setPlaying(page, true);
    }

    if (engine.block.supportsPlaybackTime(page)) {
      engine.block.setPlaybackTime(page, 1.0);
      console.log(`Playback time: ${engine.block.getPlaybackTime(page)}s`);
    }

    console.log(
      `Visible at current time: ${engine.block.isVisibleAtCurrentPlaybackTime(
        videoBlock
      )}`
    );

    engine.block.setSoloPlaybackEnabled(videoFill, true);
    console.log(
      `Solo enabled: ${engine.block.isSoloPlaybackEnabled(videoFill)}`
    );
    engine.block.setSoloPlaybackEnabled(videoFill, false);

    // Select the video block for inspection
    engine.block.select(videoBlock);
  }
}

export default Example;
