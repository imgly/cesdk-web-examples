import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create From Video
 *
 * Demonstrates how to create a scene from a video file in headless Node.js
 * environments. This sets up the scene structure with timeline mode enabled.
 *
 * Note: Video frame rendering/export requires browser-level video decoding
 * which is not available in Node.js. Use the browser version for video
 * frame export, or save the scene for later use in a browser environment.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  mkdirSync('output', { recursive: true });

  // ========================================
  // Create Scene from Remote Video URL
  // ========================================
  // Load a video directly from a URL
  const videoUrl = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Create a scene sized to match the video dimensions
  // Timeline mode is automatically enabled
  await engine.scene.createFromVideo(videoUrl);

  // The scene structure is ready with video as content

  console.log('✓ Created scene from video URL');

  // ========================================
  // Working with the Created Scene
  // ========================================
  // After creating the scene, access the page for modifications
  const pages = engine.block.findByType('page');
  const page = pages[0];

  if (page) {
    // Get the page dimensions (set from the video)
    const width = engine.block.getWidth(page);
    const height = engine.block.getHeight(page);
    console.log(`Scene dimensions: ${width}x${height}`);

    // Get the video duration
    const duration = engine.block.getDuration(page);
    console.log(`Video duration: ${duration.toFixed(2)} seconds`);
  }

  // ========================================
  // Find and Modify the Video Block
  // ========================================
  // The video is placed inside a graphic block
  const graphicBlocks = engine.block.findByType('graphic');
  const videoBlock = graphicBlocks[0];

  if (videoBlock) {
    // Modify video block properties
    engine.block.setOpacity(videoBlock, 0.95);
    console.log('✓ Found and modified video block');
  }

  // ========================================
  // Save Scene for Later Use
  // ========================================
  // Save the scene to a string for storage or transfer
  const sceneString = await engine.scene.saveToString();
  writeFileSync('output/video-scene.scene', sceneString);
  console.log('📄 Saved scene to: output/video-scene.scene');

  // Or save as an archive with embedded assets
  const archiveBlob = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
  writeFileSync('output/video-scene.zip', archiveBuffer);
  console.log('📦 Saved archive to: output/video-scene.zip');

  console.log('\n✓ Create From Video guide completed successfully!');
  console.log(
    '\nNote: Video frame export requires browser-level video decoding.'
  );
  console.log('Use the saved scene in a browser environment for frame export.');
} finally {
  // Always dispose the engine when done
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
