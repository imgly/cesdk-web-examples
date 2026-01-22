import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Import a Design
 *
 * Demonstrates different methods to import designs in headless mode:
 * - Loading scenes from URLs
 * - Loading scenes from strings
 * - Loading scenes from archives
 * - Creating scenes from images
 * - Creating scenes from videos
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  mkdirSync('output', { recursive: true });

  // ========================================
  // Demonstration 1: Create Scene from Image
  // ========================================
  // Start with creating a scene from an image (no preexisting scene needed)

  // Create a scene based on an existing image
  const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Create a scene sized to the image with the image as content
  await engine.scene.createFromImage(imageUrl);

  // The scene is ready for editing with the image as the base

  console.log('✓ Created scene from image');

  // Export the image-based scene
  const page1 = engine.block.findByType('page')[0];
  if (page1) {
    const imageBlob = await engine.block.export(page1, {
      mimeType: 'image/png'
    });
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    writeFileSync('output/image-import-result.png', imageBuffer);
    console.log('📄 Exported image scene to: output/image-import-result.png');
  }

  // ========================================
  // Demonstration 2: Load Scene from String
  // ========================================
  // Save the current scene to demonstrate loading from string

  const sceneString = await engine.scene.saveToString();

  // Scene content as a string (from saveToString() or storage)
  const savedSceneString = sceneString;

  // Load the scene from string content
  await engine.scene.loadFromString(savedSceneString);

  // The scene is restored from the string representation

  console.log('✓ Loaded scene from string');

  // ========================================
  // Demonstration 3: Load from Archive
  // ========================================
  // Create and load an archive

  const archiveBlob = await engine.scene.saveToArchive();
  const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
  writeFileSync('output/temp-archive.zip', archiveBuffer);

  // In server environments, you might load archives from the filesystem
  // or from a URL. Here we demonstrate loading from a file

  // Read the archive file
  const archiveData = readFileSync('output/temp-archive.zip');
  const archiveBlob2 = new Blob([archiveData], { type: 'application/zip' });

  // Load the archive using loadFromArchive
  await engine.scene.loadFromArchive(archiveBlob2);

  // Archives include all assets, making them portable across environments
  // No external asset URLs need to be accessible

  console.log('✓ Loaded scene from archive');

  // ========================================
  // Demonstration 4: Load Scene from URL
  // ========================================

  // URL to a saved CE.SDK scene file
  const sceneUrl =
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene';

  // Load the scene from remote URL
  await engine.scene.loadFromURL(sceneUrl);

  // The scene is now loaded and ready for editing
  // All blocks and properties from the saved scene are restored

  console.log('✓ Loaded scene from URL');

  // ========================================
  // Demonstration 5: Modify Loaded Scene
  // ========================================

  // Modify the loaded scene - all blocks are accessible
  const pages = engine.block.findByType('page');
  const page = pages[0];

  if (page) {
    // Find all graphic blocks in the scene
    const graphics = engine.block.findByType('graphic');

    // Modify properties of the first graphic if it exists
    if (graphics.length > 0) {
      const graphic = graphics[0];

      // Example: Adjust opacity
      engine.block.setOpacity(graphic, 0.8);

      // Example: Adjust position
      const currentX = engine.block.getPositionX(graphic);
      engine.block.setPositionX(graphic, currentX + 10);
    }
  }

  console.log('✓ Modified loaded scene');

  // Export the final result
  const page2 = engine.block.findByType('page')[0];
  if (page2) {
    const finalBlob = await engine.block.export(page2, {
      mimeType: 'image/png',
      targetWidth: 800,
      targetHeight: 600
    });
    const finalBuffer = Buffer.from(await finalBlob.arrayBuffer());
    writeFileSync('output/import-design-result.png', finalBuffer);
    console.log('📄 Exported final result to: output/import-design-result.png');
  }

  // ========================================
  // Demonstration 6: Create Scene from Video
  // ========================================

  // Create a scene configured for video editing
  const videoUrl =
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barreling-a-wave-18069232.mp4';

  // Create a video scene with timeline support
  await engine.scene.createFromVideo(videoUrl);

  // The scene is set up for video editing with timeline controls

  console.log('✓ Created scene from video');

  console.log('\n✓ Import Design guide completed successfully!');
} finally {
  // Always dispose the engine
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
