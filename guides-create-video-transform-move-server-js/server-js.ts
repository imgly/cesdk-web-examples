import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Move Videos
 *
 * Demonstrates video positioning in headless mode:
 * - Absolute positioning with pixel coordinates
 * - Percentage-based positioning for responsive layouts
 * - Getting current position values
 * - Locking transforms to prevent repositioning
 * - Saving scenes for later rendering
 *
 * Note: Full video export (MP4) requires the CE.SDK Renderer.
 * In headless Node.js mode, we save the scene for later use.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a video scene with specific page dimensions
  engine.scene.createVideo({
    page: { size: { width: 800, height: 500 } }
  });
  const page = engine.block.findByType('page')[0];

  // Sample video URL for demonstrations
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Block size for layout
  const blockSize = { width: 200, height: 150 };

  // Demo 1: Movable Video - Absolute positioning with pixel coordinates
  const movableVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, movableVideo);
  engine.block.setPositionX(movableVideo, 50);
  engine.block.setPositionY(movableVideo, 100);

  // Add label for movable video
  const text1 = engine.block.create('text');
  engine.block.setString(text1, 'text/text', 'Movable');
  engine.block.setFloat(text1, 'text/fontSize', 32);
  engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text1, 200);
  engine.block.setPositionX(text1, 50);
  engine.block.setPositionY(text1, 260);
  engine.block.appendChild(page, text1);

  // Demo 2: Percentage Positioning - Responsive layout
  const percentVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, percentVideo);

  // Set position mode to percentage (0.0 to 1.0)
  engine.block.setPositionXMode(percentVideo, 'Percent');
  engine.block.setPositionYMode(percentVideo, 'Percent');

  // Position at 37.5% from left (300px on 800px width), 20% from top (100px on 500px height)
  engine.block.setPositionX(percentVideo, 0.375);
  engine.block.setPositionY(percentVideo, 0.2);

  // Add label for percentage video
  const text2 = engine.block.create('text');
  engine.block.setString(text2, 'text/text', 'Percentage');
  engine.block.setFloat(text2, 'text/fontSize', 32);
  engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text2, 200);
  engine.block.setPositionX(text2, 300);
  engine.block.setPositionY(text2, 260);
  engine.block.appendChild(page, text2);

  // Demo 3: Locked Video - Cannot be moved, rotated, or scaled
  const lockedVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, lockedVideo);
  engine.block.setPositionX(lockedVideo, 550);
  engine.block.setPositionY(lockedVideo, 100);

  // Lock the transform to prevent repositioning
  engine.block.setBool(lockedVideo, 'transformLocked', true);

  // Add label for locked video
  const text3 = engine.block.create('text');
  engine.block.setString(text3, 'text/text', 'Locked');
  engine.block.setFloat(text3, 'text/fontSize', 32);
  engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text3, 200);
  engine.block.setPositionX(text3, 550);
  engine.block.setPositionY(text3, 260);
  engine.block.appendChild(page, text3);

  // Get current position values
  const currentX = engine.block.getPositionX(movableVideo);
  const currentY = engine.block.getPositionY(movableVideo);
  console.log('Current position:', currentX, currentY);

  // Move relative to current position by adding offset values
  const offsetX = engine.block.getPositionX(movableVideo);
  const offsetY = engine.block.getPositionY(movableVideo);
  engine.block.setPositionX(movableVideo, offsetX + 25);
  engine.block.setPositionY(movableVideo, offsetY + 25);

  // Save the scene to preserve the positioned videos
  // Note: Video export (MP4/PNG with video frames) requires the CE.SDK Renderer.
  // In headless Node.js mode, we save the scene file which can be loaded later
  // in a browser environment or rendered with the CE.SDK Renderer.
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene to file
  writeFileSync('output/move-videos-scene.json', sceneString);
  console.log('Saved to output/move-videos-scene.json');

  // Log final positions to verify
  console.log('Video positions:');
  console.log(
    `  Movable video: (${engine.block.getPositionX(movableVideo)}, ${engine.block.getPositionY(movableVideo)})`
  );
  console.log(
    `  Percent video: (${engine.block.getPositionX(percentVideo)}, ${engine.block.getPositionY(percentVideo)}) [Mode: Percent]`
  );
  console.log(
    `  Locked video: (${engine.block.getPositionX(lockedVideo)}, ${engine.block.getPositionY(lockedVideo)}) [Transform locked]`
  );

  console.log('Video positioning guide completed successfully.');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
