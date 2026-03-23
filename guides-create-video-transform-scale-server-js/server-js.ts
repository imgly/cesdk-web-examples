import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Scale Videos
 *
 * Demonstrates video scaling in headless mode:
 * - Uniform scaling with different anchor points
 * - Non-uniform scaling (width/height independently)
 * - Locking transforms to prevent scaling
 * - Saving scenes for later rendering
 *
 * Note: Full video export (MP4) requires the CE.SDK Renderer.
 * In headless Node.js mode, we save the scene for later use.
 */

console.log('🚀 Starting CE.SDK Scale Videos Guide...');
console.log('⏳ Initializing engine...');

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

console.log('✓ Engine initialized');

try {
  // Create a scene with a page
  console.log('⏳ Creating scene...');
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 500);
  engine.block.appendChild(scene, page);
  console.log('✓ Scene created');

  // Sample video URL for demonstrations
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Centered 2x2 grid layout for 800x500 canvas
  // Videos: 120x90, scaled to 180x135
  const leftColumnX = 200;
  const rightColumnX = 420;
  const topRowY = 50;
  const bottomRowY = 265;

  // For center-scaled video, compensate for position shift
  // Center scaling shifts top-left by (-30, -22.5) for 1.5x scale on 120x90
  const centerScaleOffsetX = 30;
  const centerScaleOffsetY = 22.5;

  // Demo 1: Uniform scaling from default top-left anchor
  console.log('⏳ Adding uniform scaled video...');
  const uniformVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, uniformVideo);
  engine.block.setPositionX(uniformVideo, leftColumnX);
  engine.block.setPositionY(uniformVideo, topRowY);

  // Scale the video to 150% from the default top-left anchor
  engine.block.scale(uniformVideo, 1.5);
  console.log('✓ Uniform scaled video added (150% from top-left)');

  // Add label for uniform scaled video
  const text1 = engine.block.create('text');
  engine.block.setString(text1, 'text/text', 'Uniform Scale (150%)');
  engine.block.setFloat(text1, 'text/fontSize', 16);
  engine.block.setWidth(text1, 200);
  engine.block.setPositionX(text1, leftColumnX);
  engine.block.setPositionY(text1, topRowY + 145);
  engine.block.appendChild(page, text1);

  // Demo 2: Scaling from center anchor
  console.log('⏳ Adding center-scaled video...');
  const centerVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, centerVideo);
  // Position compensates for center scaling shift so final position aligns with grid
  engine.block.setPositionX(centerVideo, rightColumnX + centerScaleOffsetX);
  engine.block.setPositionY(centerVideo, topRowY + centerScaleOffsetY);

  // Scale from center anchor (0.5, 0.5)
  engine.block.scale(centerVideo, 1.5, 0.5, 0.5);
  console.log('✓ Center-scaled video added (150% from center)');

  // Add label for center scaled video
  const text2 = engine.block.create('text');
  engine.block.setString(text2, 'text/text', 'Center Scale (150%)');
  engine.block.setFloat(text2, 'text/fontSize', 16);
  engine.block.setWidth(text2, 200);
  engine.block.setPositionX(text2, rightColumnX);
  engine.block.setPositionY(text2, topRowY + 145);
  engine.block.appendChild(page, text2);

  // Demo 3: Non-uniform scaling (width only)
  console.log('⏳ Adding width-stretched video...');
  const stretchVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, stretchVideo);
  engine.block.setPositionX(stretchVideo, leftColumnX);
  engine.block.setPositionY(stretchVideo, bottomRowY);

  // Stretch only the width by 1.5x
  engine.block.setWidthMode(stretchVideo, 'Absolute');
  const currentWidth = engine.block.getWidth(stretchVideo);
  engine.block.setWidth(stretchVideo, currentWidth * 1.5, true);
  console.log('✓ Width-stretched video added (150% width only)');

  // Add label for stretched video
  const text3 = engine.block.create('text');
  engine.block.setString(text3, 'text/text', 'Width Stretch (150%)');
  engine.block.setFloat(text3, 'text/fontSize', 16);
  engine.block.setWidth(text3, 200);
  engine.block.setPositionX(text3, leftColumnX);
  engine.block.setPositionY(text3, bottomRowY + 145);
  engine.block.appendChild(page, text3);

  // Demo 4: Locked scaling
  console.log('⏳ Adding transform-locked video...');
  const lockedVideo = await engine.block.addVideo(videoUri, 120, 90);
  engine.block.appendChild(page, lockedVideo);
  engine.block.setPositionX(lockedVideo, rightColumnX);
  engine.block.setPositionY(lockedVideo, bottomRowY);

  // Lock all transforms to prevent scaling
  engine.block.setTransformLocked(lockedVideo, true);
  console.log('✓ Transform-locked video added');

  // Add label for locked video
  const text4 = engine.block.create('text');
  engine.block.setString(text4, 'text/text', 'Transform Locked');
  engine.block.setFloat(text4, 'text/fontSize', 16);
  engine.block.setWidth(text4, 200);
  engine.block.setPositionX(text4, rightColumnX);
  engine.block.setPositionY(text4, bottomRowY + 145);
  engine.block.appendChild(page, text4);

  // Save the scene to preserve the scaled videos
  // Note: Video export (MP4/PNG with video frames) requires the CE.SDK Renderer.
  // In headless Node.js mode, we save the scene file which can be loaded later
  // in a browser environment or rendered with the CE.SDK Renderer.
  console.log('⏳ Saving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save scene to .scene file
  writeFileSync('output/scale-videos.scene', sceneString);
  console.log('✓ Scene saved to output/scale-videos.scene');

  // Log scale information to verify
  console.log('\n📊 Video scaling results:');
  console.log(
    `  Uniform video: ${engine.block.getWidth(uniformVideo).toFixed(1)}x${engine.block.getHeight(uniformVideo).toFixed(1)}`
  );
  console.log(
    `  Center video: ${engine.block.getWidth(centerVideo).toFixed(1)}x${engine.block.getHeight(centerVideo).toFixed(1)}`
  );
  console.log(
    `  Stretched video: ${engine.block.getWidth(stretchVideo).toFixed(1)}x${engine.block.getHeight(stretchVideo).toFixed(1)}`
  );
  console.log(`  Locked video: Transform locked = true`);

  console.log('\n✅ Scale videos guide completed successfully!');
} finally {
  // Always dispose the engine to free resources
  console.log('⏳ Disposing engine...');
  engine.dispose();
  console.log('✓ Engine disposed');
}
