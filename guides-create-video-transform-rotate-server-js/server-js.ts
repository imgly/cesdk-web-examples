import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Rotate Videos
 *
 * Demonstrates video rotation in headless mode:
 * - Setting rotation angles in radians
 * - Converting between degrees and radians
 * - Getting current rotation values
 * - Locking rotation on specific blocks
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

  // Helper functions for angle conversion
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const toDegrees = (radians: number) => (radians * 180) / Math.PI;

  // Demo 1: Rotated Video - 45 degree rotation
  console.log('Loading video 1 of 3...');
  const rotatedVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, rotatedVideo);
  engine.block.setPositionX(rotatedVideo, 50);
  engine.block.setPositionY(rotatedVideo, 100);
  console.log('✓ Video 1 loaded');

  // Rotate the video 45 degrees (convert to radians)
  engine.block.setRotation(rotatedVideo, toRadians(45));

  // Add label for rotated video
  const text1 = engine.block.create('text');
  engine.block.setString(text1, 'text/text', '45° Rotation');
  engine.block.setFloat(text1, 'text/fontSize', 28);
  engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text1, 200);
  engine.block.setPositionX(text1, 50);
  engine.block.setPositionY(text1, 280);
  engine.block.appendChild(page, text1);

  // Get current rotation value
  const currentRotation = engine.block.getRotation(rotatedVideo);
  console.log('Current rotation:', toDegrees(currentRotation), 'degrees');

  // Demo 2: 90 Degree Rotation
  console.log('Loading video 2 of 3...');
  const rotatedVideo90 = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, rotatedVideo90);
  engine.block.setPositionX(rotatedVideo90, 300);
  engine.block.setPositionY(rotatedVideo90, 100);
  console.log('✓ Video 2 loaded');

  // Rotate 90 degrees using Math.PI / 2
  engine.block.setRotation(rotatedVideo90, Math.PI / 2);

  // Add label for 90 degree rotation
  const text2 = engine.block.create('text');
  engine.block.setString(text2, 'text/text', '90° Rotation');
  engine.block.setFloat(text2, 'text/fontSize', 28);
  engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text2, 200);
  engine.block.setPositionX(text2, 300);
  engine.block.setPositionY(text2, 280);
  engine.block.appendChild(page, text2);

  // Demo 3: Locked Rotation - Rotation is disabled for this block
  console.log('Loading video 3 of 3...');
  const lockedVideo = await engine.block.addVideo(
    videoUri,
    blockSize.width,
    blockSize.height
  );
  engine.block.appendChild(page, lockedVideo);
  engine.block.setPositionX(lockedVideo, 550);
  engine.block.setPositionY(lockedVideo, 150);
  console.log('✓ Video 3 loaded');

  // Disable rotation for this specific block
  engine.block.setScopeEnabled(lockedVideo, 'layer/rotate', false);

  // Add label for locked video
  const text3 = engine.block.create('text');
  engine.block.setString(text3, 'text/text', 'Rotation Locked');
  engine.block.setFloat(text3, 'text/fontSize', 28);
  engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
  engine.block.setWidth(text3, 200);
  engine.block.setPositionX(text3, 550);
  engine.block.setPositionY(text3, 320);
  engine.block.appendChild(page, text3);

  // Check if rotation is enabled for a block
  const canRotate = engine.block.isScopeEnabled(lockedVideo, 'layer/rotate');
  console.log('Rotation enabled:', canRotate);

  // Save the scene to preserve the rotated videos
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
  writeFileSync('output/rotate-videos.scene', sceneString);
  console.log('Saved to output/rotate-videos.scene');

  // Log final rotation values to verify
  console.log('Video rotations:');
  console.log(
    `  Rotated video (45°): ${toDegrees(engine.block.getRotation(rotatedVideo)).toFixed(1)}°`
  );
  console.log(
    `  Rotated video (90°): ${toDegrees(engine.block.getRotation(rotatedVideo90)).toFixed(1)}°`
  );
  console.log(
    `  Locked video: ${toDegrees(engine.block.getRotation(lockedVideo)).toFixed(1)}° [Rotation locked]`
  );

  console.log('Video rotation guide completed successfully.');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
