import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Trim Video and Audio
 *
 * Demonstrates trimming video clips in headless mode:
 * - Loading video resources with forceLoadAVResource
 * - Basic video trimming with setTrimOffset/setTrimLength
 * - Getting current trim values
 * - Getting source media duration
 * - Coordinating trim with block duration
 * - Trimming with looping enabled
 * - Checking trim support
 * - Frame-accurate trimming
 * - Batch trimming multiple videos
 * - Saving the scene for later use
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a video scene with page - required for timeline-based editing and addVideo()
  engine.scene.createVideo({
    page: { size: { width: 1280, height: 720 } }
  });
  const page = engine.block.findByType('page')[0];

  // Set page duration to accommodate all demonstrations
  engine.block.setDuration(page, 30);

  // Sample video URL for demonstrations
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Block size for layout
  const blockSize = { width: 320, height: 180 };

  // Create a video block to demonstrate trim support checking
  const sampleVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  // Get the video fill - trim operations are applied to the fill, not the block
  const videoFill = engine.block.getFill(sampleVideo);

  // Check if the fill supports trim operations
  const supportsTrim = engine.block.supportsTrim(videoFill);
  console.log('Video fill supports trim:', supportsTrim); // true for video fills

  // Load the video resource before accessing trim properties
  // This ensures metadata (duration, frame rate, etc.) is available
  await engine.block.forceLoadAVResource(videoFill);

  // Get the total duration of the source video
  const totalDuration = engine.block.getAVResourceTotalDuration(videoFill);
  console.log('Total video duration:', totalDuration, 'seconds');

  // Create a video block for basic trim demonstration
  const basicTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  // Get the fill to apply trim operations
  const basicTrimFill = engine.block.getFill(basicTrimVideo);

  // Load resource before trimming
  await engine.block.forceLoadAVResource(basicTrimFill);

  // Trim video to start at 2 seconds and play for 5 seconds
  engine.block.setTrimOffset(basicTrimFill, 2.0);
  engine.block.setTrimLength(basicTrimFill, 5.0);

  console.log('Basic trim applied: offset 2s, length 5s');

  // Get current trim values to verify or modify
  const currentOffset = engine.block.getTrimOffset(basicTrimFill);
  const currentLength = engine.block.getTrimLength(basicTrimFill);
  console.log(
    `Current trim values - Offset: ${currentOffset}s, Length: ${currentLength}s`
  );

  // Get the total duration of source media to validate trim values
  const sourceDuration = engine.block.getAVResourceTotalDuration(basicTrimFill);
  console.log('Source media duration:', sourceDuration, 'seconds');

  // Validate trim doesn't exceed source length
  const maxTrimLength = sourceDuration - currentOffset;
  console.log('Maximum trim length from current offset:', maxTrimLength, 's');

  // Create a video block demonstrating trim + duration coordination
  const durationTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  const durationTrimFill = engine.block.getFill(durationTrimVideo);
  await engine.block.forceLoadAVResource(durationTrimFill);

  // Set trim: play portion from 3s to 8s (5 seconds of content)
  engine.block.setTrimOffset(durationTrimFill, 3.0);
  engine.block.setTrimLength(durationTrimFill, 5.0);

  // Set block duration: how long this block appears in the timeline
  // When duration equals trim length, the entire trimmed portion plays once
  engine.block.setDuration(durationTrimVideo, 5.0);

  console.log('Trim+Duration: Block will play trimmed 5s exactly once');

  // Create a video block with trim + looping
  const loopingTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
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
  console.log('Looping enabled:', isLooping);

  // Set duration longer than trim length - the trim will loop to fill it
  engine.block.setDuration(loopingTrimVideo, 9.0);

  console.log('Looping trim: 3s segment will loop 3 times to fill 9s duration');

  // Create a video block for frame-accurate trimming
  const frameAccurateTrimVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );

  const frameFill = engine.block.getFill(frameAccurateTrimVideo);
  await engine.block.forceLoadAVResource(frameFill);

  // For frame-accurate trimming, assume a common frame rate (e.g., 30fps)
  // In production, you may know the frame rate from your video metadata
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

  console.log(
    `Frame-accurate trim - Frame rate: ${frameRate}fps, Start: ${startFrame}, Duration: ${trimFrames} frames`
  );

  // Batch process multiple video clips with consistent trimming
  const batchVideoUris = [
    'https://img.ly/static/ubq_video_samples/bbb.mp4',
    'https://img.ly/static/ubq_video_samples/bbb.mp4',
    'https://img.ly/static/ubq_video_samples/bbb.mp4'
  ];

  const batchVideos = [];
  for (const uri of batchVideoUris) {
    const batchVideo = await engine.block.addVideo(
      uri,
      blockSize.width,
      blockSize.height
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

  console.log(
    `Batch trim: Applied consistent 4s trim to ${batchVideos.length} videos`
  );

  // ===== Position all blocks in grid layout =====
  const spacing = 20;
  const margin = 40;
  const cols = 3;

  const getPosition = (index: number) => ({
    x: margin + (index % cols) * (blockSize.width + spacing),
    y: margin + Math.floor(index / cols) * (blockSize.height + spacing)
  });

  const blocks = [
    sampleVideo,
    basicTrimVideo,
    durationTrimVideo,
    loopingTrimVideo,
    frameAccurateTrimVideo,
    ...batchVideos
  ];

  blocks.forEach((block, index) => {
    const pos = getPosition(index);
    engine.block.setPositionX(block, pos.x);
    engine.block.setPositionY(block, pos.y);
  });

  // Save the scene as a .scene file for later use or rendering
  // This preserves all trim settings and can be loaded in any CE.SDK environment
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/trimmed-video.scene', sceneString);
  console.log('Exported to output/trimmed-video.scene');

  console.log('');
  console.log('Video trim guide completed successfully.');
  console.log('Scene saved with:');
  console.log('  - 8 video blocks with various trim configurations');
  console.log('  - Basic trim, duration coordination, looping, and batch trim');
  console.log('  - Ready for rendering with CE.SDK Renderer');
} finally {
  engine.dispose();
}
