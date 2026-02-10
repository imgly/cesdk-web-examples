import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Control Audio and Video
 *
 * Demonstrates audio and video control in headless mode:
 * - Force loading video resources with forceLoadAVResource
 * - Querying video metadata (dimensions, duration)
 * - Setting and getting playback time for timeline positioning
 * - Checking visibility at current playback time
 * - Checking playback control support
 * - Saving the scene for later rendering
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a video scene with page - required for timeline-based editing
  engine.scene.createVideo({
    page: { size: { width: 1920, height: 1080 } }
  });
  const page = engine.block.findByType('page')[0];

  // Set page duration to accommodate our video content
  engine.block.setDuration(page, 15);

  // Create a track for video blocks
  const track = engine.block.create('track');
  engine.block.appendChild(page, track);

  // Sample video URL
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Create a video block and add it to the track
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

  // Force load the video resource to access metadata
  // This is required before accessing duration, dimensions, or other properties
  console.log('Loading video resource...');
  await engine.block.forceLoadAVResource(videoFill);
  console.log('Video resource loaded successfully');

  // Query video dimensions from the loaded resource
  const videoWidth = engine.block.getVideoWidth(videoFill);
  const videoHeight = engine.block.getVideoHeight(videoFill);
  console.log(`Video dimensions: ${videoWidth}x${videoHeight} pixels`);

  // Get the total duration of the source media
  const totalDuration = engine.block.getAVResourceTotalDuration(videoFill);
  console.log(`Source media duration: ${totalDuration} seconds`);

  // Check if a block supports playback control
  // Pages and scenes support playback control for timeline-based playback
  const pageSupportsPlayback = engine.block.supportsPlaybackControl(page);
  console.log(`Page supports playback control: ${pageSupportsPlayback}`);

  // Video fills support playback for individual block preview
  const fillSupportsPlayback = engine.block.supportsPlaybackControl(videoFill);
  console.log(`Video fill supports playback control: ${fillSupportsPlayback}`);

  // Check if the page is currently playing
  // In headless mode, this will be false as there is no active playback
  const isPlaying = engine.block.isPlaying(page);
  console.log(`Is playing: ${isPlaying}`);

  // Check if the page supports playback time operations
  if (engine.block.supportsPlaybackTime(page)) {
    // Set the playback time to position the timeline
    // This is useful for rendering frames at specific times
    engine.block.setPlaybackTime(page, 3.0);
    console.log('Playback time set to 3.0 seconds');

    // Get the current playback time
    const currentTime = engine.block.getPlaybackTime(page);
    console.log(`Current playback time: ${currentTime} seconds`);
  }

  // Check if the video block is visible at the current playback time
  // This is useful when working with multiple blocks that have different time offsets
  const isVisible = engine.block.isVisibleAtCurrentPlaybackTime(videoBlock);
  console.log(`Video block visible at current time: ${isVisible}`);

  // Time offset controls when a block becomes active in the timeline
  // Duration controls how long the block appears
  const blockDuration = engine.block.getDuration(videoBlock);
  const blockTimeOffset = engine.block.getTimeOffset(videoBlock);
  console.log(`Video block duration: ${blockDuration} seconds`);
  console.log(`Video block time offset: ${blockTimeOffset} seconds`);

  // Modify time offset to start the block at 1 second
  engine.block.setTimeOffset(videoBlock, 1.0);
  console.log(
    `Updated time offset to: ${engine.block.getTimeOffset(videoBlock)} seconds`
  );

  // Trim controls which portion of the source media plays
  // Check if the video fill supports trimming
  if (engine.block.supportsTrim(videoFill)) {
    // Set trim offset to start playback 2 seconds into the source video
    engine.block.setTrimOffset(videoFill, 2.0);

    // Set trim length to play 5 seconds of the source video
    engine.block.setTrimLength(videoFill, 5.0);

    const trimOffset = engine.block.getTrimOffset(videoFill);
    const trimLength = engine.block.getTrimLength(videoFill);
    console.log(
      `Trim offset: ${trimOffset} seconds (starts at this point in source)`
    );
    console.log(
      `Trim length: ${trimLength} seconds (plays this much of source)`
    );
  }

  // Demonstrate visibility with multiple blocks at different time offsets
  // Create a second video block that starts later in the timeline
  const videoBlock2 = engine.block.create('graphic');
  engine.block.setShape(videoBlock2, engine.block.createShape('rect'));
  engine.block.setWidth(videoBlock2, 960);
  engine.block.setHeight(videoBlock2, 540);

  const videoFill2 = engine.block.createFill('video');
  engine.block.setString(videoFill2, 'fill/video/fileURI', videoUri);
  engine.block.setFill(videoBlock2, videoFill2);

  engine.block.appendChild(track, videoBlock2);
  engine.block.setTimeOffset(videoBlock2, 5.0); // Starts at 5 seconds
  engine.block.setDuration(videoBlock2, 8);

  // Load resources for the second video
  console.log('Loading second video resource...');
  await engine.block.forceLoadAVResource(videoFill2);
  console.log('Second video resource loaded');

  // At playback time 3.0s: first video visible, second not yet
  engine.block.setPlaybackTime(page, 3.0);
  console.log(
    `At 3.0s - Video 1 visible: ${engine.block.isVisibleAtCurrentPlaybackTime(videoBlock)}`
  );
  console.log(
    `At 3.0s - Video 2 visible: ${engine.block.isVisibleAtCurrentPlaybackTime(videoBlock2)}`
  );

  // At playback time 7.0s: both videos visible (if first extends to this time)
  engine.block.setPlaybackTime(page, 7.0);
  console.log(
    `At 7.0s - Video 1 visible: ${engine.block.isVisibleAtCurrentPlaybackTime(videoBlock)}`
  );
  console.log(
    `At 7.0s - Video 2 visible: ${engine.block.isVisibleAtCurrentPlaybackTime(videoBlock2)}`
  );

  // Add an audio block to demonstrate audio resource handling
  const audioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';
  const audioBlock = engine.block.create('audio');
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);
  engine.block.appendChild(page, audioBlock);
  engine.block.setDuration(audioBlock, 5);
  engine.block.setTimeOffset(audioBlock, 2.0);

  // Force load the audio resource
  console.log('Loading audio resource...');
  await engine.block.forceLoadAVResource(audioBlock);
  const audioDuration = engine.block.getAVResourceTotalDuration(audioBlock);
  console.log(`Audio resource loaded - duration: ${audioDuration} seconds`);

  // Check audio visibility at different times
  engine.block.setPlaybackTime(page, 1.0);
  console.log(
    `At 1.0s - Audio visible: ${engine.block.isVisibleAtCurrentPlaybackTime(audioBlock)}`
  );
  engine.block.setPlaybackTime(page, 3.0);
  console.log(
    `At 3.0s - Audio visible: ${engine.block.isVisibleAtCurrentPlaybackTime(audioBlock)}`
  );

  // Save the scene for later rendering with CE.SDK Renderer
  // Video export is not supported in Node.js - use CE.SDK Renderer instead
  console.log('');
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/video-control.scene', sceneString);
  console.log('Exported to output/video-control.scene');

  console.log('');
  console.log('Audio and video control guide completed successfully.');
  console.log('Scene saved with:');
  console.log('  - 2 video blocks with different time offsets');
  console.log('  - 1 audio block');
  console.log('  - Ready for rendering with CE.SDK Renderer');
} finally {
  engine.dispose();
}
