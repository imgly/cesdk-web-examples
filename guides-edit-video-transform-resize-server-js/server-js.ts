import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Resize Videos
 *
 * Demonstrates video resizing in headless mode:
 * - Absolute sizing with pixel dimensions
 * - Percentage-based sizing for responsive layouts
 * - Getting current dimensions
 * - Locking transforms to prevent resizing
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

  // Demo 1: Resizable Video - Absolute sizing with pixel dimensions
  console.log('Loading video 1/3 (Resizable)...');
  const resizableVideo = await engine.block.addVideo(videoUri, 200, 150);
  engine.block.appendChild(page, resizableVideo);
  engine.block.setWidth(resizableVideo, 200);
  engine.block.setHeight(resizableVideo, 150);
  engine.block.setPositionX(resizableVideo, 50);
  engine.block.setPositionY(resizableVideo, 100);
  console.log('✓ Video 1/3 loaded');

  // Add label for resizable video
  const text1 = engine.block.create('text');
  engine.block.setString(text1, 'text/text', 'Resizable');
  engine.block.setFloat(text1, 'text/fontSize', 32);
  engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text1, 200);
  engine.block.setPositionX(text1, 50);
  engine.block.setPositionY(text1, 260);
  engine.block.appendChild(page, text1);

  // Demo 2: Percentage Sizing - Responsive layout
  console.log('Loading video 2/3 (Percentage)...');
  const percentVideo = await engine.block.addVideo(videoUri, 200, 150);
  engine.block.appendChild(page, percentVideo);

  // Set size mode to percentage (0.0 to 1.0)
  engine.block.setWidthMode(percentVideo, 'Percent');
  engine.block.setHeightMode(percentVideo, 'Percent');
  // Set to 25% width, 30% height of parent
  engine.block.setWidth(percentVideo, 0.25);
  engine.block.setHeight(percentVideo, 0.3);

  engine.block.setPositionX(percentVideo, 300);
  engine.block.setPositionY(percentVideo, 100);
  console.log('✓ Video 2/3 loaded');

  // Add label for percentage video
  const text2 = engine.block.create('text');
  engine.block.setString(text2, 'text/text', 'Percentage');
  engine.block.setFloat(text2, 'text/fontSize', 32);
  engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text2, 200);
  engine.block.setPositionX(text2, 300);
  engine.block.setPositionY(text2, 260);
  engine.block.appendChild(page, text2);

  // Demo 3: Locked Video - Cannot be resized
  console.log('Loading video 3/3 (Locked)...');
  const lockedVideo = await engine.block.addVideo(videoUri, 200, 150);
  engine.block.appendChild(page, lockedVideo);
  engine.block.setPositionX(lockedVideo, 550);
  engine.block.setPositionY(lockedVideo, 100);

  // Lock the transform to prevent resizing
  engine.block.setTransformLocked(lockedVideo, true);
  console.log('✓ Video 3/3 loaded');

  // Add label for locked video
  const text3 = engine.block.create('text');
  engine.block.setString(text3, 'text/text', 'Locked');
  engine.block.setFloat(text3, 'text/fontSize', 32);
  engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text3, 200);
  engine.block.setPositionX(text3, 550);
  engine.block.setPositionY(text3, 260);
  engine.block.appendChild(page, text3);

  // Get current dimensions
  const currentWidth = engine.block.getWidth(resizableVideo);
  const currentHeight = engine.block.getHeight(resizableVideo);
  console.log('Current dimensions:', currentWidth, 'x', currentHeight);

  // Check size mode
  const widthMode = engine.block.getWidthMode(percentVideo);
  const heightMode = engine.block.getHeightMode(percentVideo);
  console.log('Size modes:', widthMode, heightMode);

  // Save the scene to preserve the resized videos
  // Note: Video export (MP4/PNG with video frames) requires the CE.SDK Renderer.
  // In headless Node.js mode, we save the scene file which can be loaded later
  // in a browser environment or rendered with the CE.SDK Renderer.
  console.log('Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene to .scene file (standard CE.SDK scene format)
  writeFileSync('output/resize-videos-scene.scene', sceneString);
  console.log('✓ Saved to output/resize-videos-scene.scene');

  // Log final dimensions to verify
  console.log('\nVideo dimensions:');
  console.log(
    `  Resizable video: ${engine.block.getWidth(resizableVideo)}x${engine.block.getHeight(resizableVideo)} [Mode: Absolute]`
  );
  console.log(
    `  Percent video: ${engine.block.getWidth(percentVideo)}x${engine.block.getHeight(percentVideo)} [Mode: Percent]`
  );
  console.log(
    `  Locked video: ${engine.block.getWidth(lockedVideo)}x${engine.block.getHeight(lockedVideo)} [Transform locked]`
  );

  console.log('\n✓ Video resizing guide completed successfully.');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
