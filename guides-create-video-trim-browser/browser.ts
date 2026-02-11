import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Trim Video Guide
 *
 * Demonstrates trimming video clips in CE.SDK:
 * - Loading video resources with forceLoadAVResource
 * - Basic video trimming with setTrimOffset/setTrimLength
 * - Getting current trim values
 * - Coordinating trim with block duration
 * - Trimming with looping enabled
 * - Checking trim support
 * - Frame-accurate trimming
 * - Batch trimming multiple videos
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features in CE.SDK
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    // Load assets and create a video scene (required for trimming)
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

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 8);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Use a sample video URL from demo assets
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create a sample video block to demonstrate trim support checking
    const sampleVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    // Get the video fill - trim operations are applied to the fill, not the block
    const videoFill = engine.block.getFill(sampleVideo);

    // Check if the fill supports trim operations
    const supportsTrim = engine.block.supportsTrim(videoFill);
    // eslint-disable-next-line no-console
    console.log('Video fill supports trim:', supportsTrim); // true for video fills

    // Select this block so timeline controls are visible
    engine.block.setSelected(sampleVideo, true);

    // Pattern: Always load video resource before accessing trim properties
    // This ensures metadata (duration, frame rate, etc.) is available
    await engine.block.forceLoadAVResource(videoFill);

    // Now we can safely access video metadata
    const totalDuration = engine.block.getDouble(
      videoFill,
      'fill/video/totalDuration'
    );
    // eslint-disable-next-line no-console
    console.log('Total video duration:', totalDuration, 'seconds');

    // Pattern #1: Demonstrate Individual Before Combined
    // Create a separate video block for basic trim demonstration
    const basicTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    // Get the fill to apply trim operations
    const basicTrimFill = engine.block.getFill(basicTrimVideo);

    // Load resource before trimming
    await engine.block.forceLoadAVResource(basicTrimFill);

    // Trim video to start at 2 seconds and play for 5 seconds
    engine.block.setTrimOffset(basicTrimFill, 2.0);
    engine.block.setTrimLength(basicTrimFill, 5.0);

    // Get current trim values to verify or modify
    const currentOffset = engine.block.getTrimOffset(basicTrimFill);
    const currentLength = engine.block.getTrimLength(basicTrimFill);
    // eslint-disable-next-line no-console
    console.log(
      `Basic trim - Offset: ${currentOffset}s, Length: ${currentLength}s`
    );

    // Pattern #5: Progressive Complexity - coordinating trim with block duration
    // Create a video block demonstrating trim + duration coordination
    const durationTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const durationTrimFill = engine.block.getFill(durationTrimVideo);
    await engine.block.forceLoadAVResource(durationTrimFill);

    // Set trim: play portion from 3s to 8s (5 seconds of content)
    engine.block.setTrimOffset(durationTrimFill, 3.0);
    engine.block.setTrimLength(durationTrimFill, 5.0);

    // Set block duration: how long this block appears in the timeline
    // When duration equals trim length, the entire trimmed portion plays once
    engine.block.setDuration(durationTrimVideo, 5.0);

    // eslint-disable-next-line no-console
    console.log(
      'Trim+Duration - Block will play trimmed 5s exactly once in timeline'
    );

    // Create a video block with trim + looping
    const loopingTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const loopingTrimFill = engine.block.getFill(loopingTrimVideo);
    await engine.block.forceLoadAVResource(loopingTrimFill);

    // Trim to a short 3-second segment
    engine.block.setTrimOffset(loopingTrimFill, 1.0);
    engine.block.setTrimLength(loopingTrimFill, 3.0);

    // Enable looping so the 3-second segment repeats
    engine.block.setLooping(loopingTrimFill, true);

    // Verify looping is enabled
    const isLooping = engine.block.isLooping(loopingTrimFill);
    // eslint-disable-next-line no-console
    console.log('Looping enabled:', isLooping);

    // Set duration longer than trim length - the trim will loop to fill it
    engine.block.setDuration(loopingTrimVideo, 9.0);

    // eslint-disable-next-line no-console
    console.log(
      'Looping trim - 3s segment will loop 3 times to fill 9s duration'
    );

    // Pattern #6: Descriptive naming - frame-accurate trim demonstration
    // Create a video block for frame-accurate trimming
    const frameAccurateTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const frameFill = engine.block.getFill(frameAccurateTrimVideo);
    await engine.block.forceLoadAVResource(frameFill);

    // Note: Frame rate is not directly accessible via the API
    // For this example, we'll assume a common frame rate of 30fps
    const frameRate = 30;

    // Calculate trim offset based on specific frame number
    // Example: Start at frame 60 for a 30fps video = 2.0 seconds
    const startFrame = 60;
    const trimOffsetSeconds = startFrame / frameRate;

    // Trim for exactly 150 frames = 5.0 seconds at 30fps
    const trimFrames = 150;
    const trimLengthSeconds = trimFrames / frameRate;

    engine.block.setTrimOffset(frameFill, trimOffsetSeconds);
    engine.block.setTrimLength(frameFill, trimLengthSeconds);

    // eslint-disable-next-line no-console
    console.log(
      `Frame-accurate trim - Frame rate: ${frameRate}fps (assumed), Start frame: ${startFrame}, Duration: ${trimFrames} frames`
    );

    // Pattern: Batch processing multiple video clips
    // Create multiple video blocks to demonstrate batch trimming
    const batchVideoUris = [
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      'https://img.ly/static/ubq_video_samples/bbb.mp4'
    ];

    const batchVideos = [];
    for (let i = 0; i < batchVideoUris.length; i++) {
      const batchVideo = await engine.block.addVideo(
        batchVideoUris[i],
        blockWidth,
        blockHeight
      );
      batchVideos.push(batchVideo);

      // Get the fill for trim operations
      const batchFill = engine.block.getFill(batchVideo);

      // Load resource before trimming
      await engine.block.forceLoadAVResource(batchFill);

      // Apply consistent trim: first 4 seconds of each video
      engine.block.setTrimOffset(batchFill, 0.0);
      engine.block.setTrimLength(batchFill, 4.0);

      // Set consistent duration
      engine.block.setDuration(batchVideo, 4.0);
    }

    // eslint-disable-next-line no-console
    console.log('Batch trim - Applied consistent 4s trim to 3 video blocks');

    // ===== Position all blocks in grid layout =====
    const blocks = [
      sampleVideo, // Position 0
      basicTrimVideo, // Position 1
      durationTrimVideo, // Position 2
      loopingTrimVideo, // Position 3
      frameAccurateTrimVideo, // Position 4
      ...batchVideos // Positions 5-7
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Start playback automatically when the example loads
    try {
      engine.block.setPlaying(page, true);
      // eslint-disable-next-line no-console
      console.log(
        'Video trim guide initialized. Playback started automatically. Use timeline controls to adjust trim handles.'
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        'Video trim guide initialized. Click play button to start playback.'
      );
    }
  }
}

export default Example;
