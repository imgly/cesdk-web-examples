import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Resize Video Blocks
 *
 * Demonstrates resizing video blocks in headless mode:
 * - Setting absolute pixel dimensions with setWidth/setHeight
 * - Reading current dimensions with getWidth/getHeight
 * - Using percentage-based sizing with setWidthMode/setHeightMode
 * - Maintaining aspect ratio when resizing
 * - Resizing multiple blocks together as a group
 * - Locking resize operations for template protection
 * - Understanding content fill behavior
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a video scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1920, height: 1080 } }
  });
  const page = engine.block.findByType('page')[0];

  // Sample video URL for demonstrations
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Create a video block with initial dimensions
  const videoBlock = await engine.block.addVideo(videoUri, 640, 360);
  engine.block.appendChild(page, videoBlock);

  console.log('Initial dimensions:');
  console.log('  Width:', engine.block.getWidth(videoBlock));
  console.log('  Height:', engine.block.getHeight(videoBlock));

  // Resize to specific pixel dimensions (1280x720)
  engine.block.setWidth(videoBlock, 1280);
  engine.block.setHeight(videoBlock, 720);

  console.log('After resize to 1280x720:');
  console.log('  Width:', engine.block.getWidth(videoBlock));
  console.log('  Height:', engine.block.getHeight(videoBlock));

  // Read current dimensions and sizing modes
  const currentWidth = engine.block.getWidth(videoBlock);
  const currentHeight = engine.block.getHeight(videoBlock);
  const widthMode = engine.block.getWidthMode(videoBlock);
  const heightMode = engine.block.getHeightMode(videoBlock);

  console.log('Current state:');
  console.log(`  Dimensions: ${currentWidth} x ${currentHeight}`);
  console.log(`  Width mode: ${widthMode}`);
  console.log(`  Height mode: ${heightMode}`);

  // Set sizing modes to control dimension interpretation
  // 'Absolute' - Fixed pixel values
  // 'Percent' - Percentage of parent container (0.0 to 1.0)
  // 'Auto' - Automatic sizing based on content

  // Ensure we're using absolute mode for pixel values
  engine.block.setWidthMode(videoBlock, 'Absolute');
  engine.block.setHeightMode(videoBlock, 'Absolute');

  console.log('Sizing modes set to Absolute');

  // Create another video block for percentage-based sizing
  const percentVideo = await engine.block.addVideo(videoUri, 400, 225);
  engine.block.appendChild(page, percentVideo);

  // Switch to percentage mode and resize to 50% of parent width
  engine.block.setWidthMode(percentVideo, 'Percent');
  engine.block.setWidth(percentVideo, 0.5); // 50% of parent width

  // Keep height in absolute mode for this example
  engine.block.setHeightMode(percentVideo, 'Absolute');
  engine.block.setHeight(percentVideo, 270);

  console.log('Percentage-based sizing:');
  console.log(`  Width mode: ${engine.block.getWidthMode(percentVideo)}`);
  console.log(
    `  Width value: ${engine.block.getWidth(percentVideo)} (50% of parent)`
  );

  // Calculate and maintain aspect ratio when resizing
  const aspectVideo = await engine.block.addVideo(videoUri, 800, 450);
  engine.block.appendChild(page, aspectVideo);

  // Get current dimensions
  const originalWidth = engine.block.getWidth(aspectVideo);
  const originalHeight = engine.block.getHeight(aspectVideo);
  const aspectRatio = originalWidth / originalHeight;

  console.log(
    `Original aspect ratio: ${aspectRatio.toFixed(4)} (${originalWidth}x${originalHeight})`
  );

  // Resize width to 1200, calculate height to maintain aspect ratio
  const newWidth = 1200;
  const newHeight = newWidth / aspectRatio;

  engine.block.setWidth(aspectVideo, newWidth);
  engine.block.setHeight(aspectVideo, newHeight);

  console.log(
    `After aspect-ratio-preserving resize: ${newWidth}x${newHeight.toFixed(0)}`
  );

  // Group multiple video blocks for unified resizing
  const groupVideo1 = await engine.block.addVideo(videoUri, 300, 169);
  const groupVideo2 = await engine.block.addVideo(videoUri, 300, 169);
  engine.block.appendChild(page, groupVideo1);
  engine.block.appendChild(page, groupVideo2);

  // Position the blocks before grouping
  engine.block.setPositionX(groupVideo1, 50);
  engine.block.setPositionY(groupVideo1, 600);
  engine.block.setPositionX(groupVideo2, 400);
  engine.block.setPositionY(groupVideo2, 600);

  // Group the blocks
  const group = engine.block.group([groupVideo1, groupVideo2]);

  console.log('Created group with 2 video blocks');
  console.log(
    '  Before scale - Block 1 width:',
    engine.block.getWidth(groupVideo1)
  );
  console.log(
    '  Before scale - Block 2 width:',
    engine.block.getWidth(groupVideo2)
  );

  // Scale the entire group - child blocks scale proportionally
  engine.block.scale(group, 1.5);

  console.log(
    '  After 1.5x scale - Block 1 width:',
    engine.block.getWidth(groupVideo1)
  );
  console.log(
    '  After 1.5x scale - Block 2 width:',
    engine.block.getWidth(groupVideo2)
  );

  // Lock resize operations on a block for template protection
  const templateVideo = await engine.block.addVideo(videoUri, 500, 281);
  engine.block.appendChild(page, templateVideo);
  engine.block.setPositionX(templateVideo, 1300);
  engine.block.setPositionY(templateVideo, 50);

  // Disable the layer/resize scope to prevent resizing
  engine.block.setScopeEnabled(templateVideo, 'layer/resize', false);

  // Verify the scope is disabled
  const canResize = engine.block.isScopeEnabled(templateVideo, 'layer/resize');
  console.log('Resize scope enabled:', canResize); // false

  // Alternative: Lock all transforms (move, resize, rotate)
  const fullyLockedVideo = await engine.block.addVideo(videoUri, 400, 225);
  engine.block.appendChild(page, fullyLockedVideo);
  engine.block.setPositionX(fullyLockedVideo, 1300);
  engine.block.setPositionY(fullyLockedVideo, 400);

  engine.block.setTransformLocked(fullyLockedVideo, true);
  console.log('All transforms locked on block');

  // Control how video content fills the block frame
  const fillModeVideo = await engine.block.addVideo(videoUri, 600, 400);
  engine.block.appendChild(page, fillModeVideo);
  engine.block.setPositionX(fillModeVideo, 1300);
  engine.block.setPositionY(fillModeVideo, 700);

  // Available fill modes:
  // 'Crop' - Fill the frame, crop overflow (default)
  // 'Cover' - Scale to cover the frame completely
  // 'Contain' - Scale to fit within frame, may show letterboxing

  // Set content fill mode
  engine.block.setContentFillMode(fillModeVideo, 'Contain');

  const currentFillMode = engine.block.getContentFillMode(fillModeVideo);
  console.log('Content fill mode:', currentFillMode);

  // Position all blocks in a grid layout for the export
  const margin = 40;

  engine.block.setPositionX(videoBlock, margin);
  engine.block.setPositionY(videoBlock, margin);

  engine.block.setPositionX(percentVideo, margin);
  engine.block.setPositionY(percentVideo, 400);

  engine.block.setPositionX(aspectVideo, margin);
  engine.block.setPositionY(aspectVideo, 700);

  // Export the scene as a PNG snapshot
  // Note: Full video export with encoding requires the browser SDK.
  // In headless mode, we export a frame snapshot to verify resize operations.
  console.log('Starting PNG export...');

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/resized-videos-snapshot.png', buffer);
  console.log('Exported to output/resized-videos-snapshot.png');

  console.log('Video resize guide completed successfully.');
} finally {
  engine.dispose();
}
