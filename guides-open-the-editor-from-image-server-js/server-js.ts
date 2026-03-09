import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create From Image
 *
 * Demonstrates how to create an editable scene from an image file
 * in headless Node.js environments.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  mkdirSync('output', { recursive: true });

  // ========================================
  // Create Scene from Remote Image URL
  // ========================================
  // The most common approach: load an image directly from a URL
  const imageUrl = 'https://img.ly/static/ubq_samples/sample_4.jpg';

  // Create a scene sized to match the image dimensions
  await engine.scene.createFromImage(imageUrl);

  // The scene is now ready for editing with the image as content

  console.log('✓ Created scene from image URL');

  // ========================================
  // Working with the Created Scene
  // ========================================
  // After creating the scene, access the page for modifications
  const pages = engine.block.findByType('page');
  const page = pages[0];

  if (page) {
    // Get the page dimensions (set from the image)
    const width = engine.block.getWidth(page);
    const height = engine.block.getHeight(page);
    console.log(`Scene dimensions: ${width}x${height}`);
  }

  // ========================================
  // Export the Result
  // ========================================
  // Export the scene to an image file
  if (page) {
    const exportBlob = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await exportBlob.arrayBuffer());
    writeFileSync('output/from-image-result.png', buffer);
    console.log('📄 Exported to: output/from-image-result.png');
  }

  console.log('\n✓ Create From Image guide completed successfully!');
} finally {
  // Always dispose the engine when done
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
