import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Start With Blank Canvas
 *
 * Demonstrates how to create an empty scene from scratch
 * in headless Node.js environments.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  mkdirSync('output', { recursive: true });

  // ========================================
  // Create an Empty Scene
  // ========================================
  // Create a new empty scene with a page of specific dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });

  console.log('✓ Created empty scene');

  // Find the page that was automatically created
  const pages = engine.block.findByType('page');
  const page = pages[0];

  // ========================================
  // Zoom to Fit the Page
  // ========================================
  // Set the zoom level to fit the page with padding
  // This is useful for previewing the design before export
  await engine.scene.zoomToBlock(page, { padding: 40 });

  console.log('✓ Zoomed to fit page');

  // ========================================
  // Export the Result
  // ========================================
  // Export the scene to an image file
  if (page) {
    const exportBlob = await engine.block.export(page, {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await exportBlob.arrayBuffer());
    writeFileSync('output/blank-canvas-result.png', buffer);
    console.log('📄 Exported to: output/blank-canvas-result.png');
  }

  console.log('\n✓ Start With Blank Canvas guide completed successfully!');
} finally {
  // Always dispose the engine when done
  engine.dispose();
  console.log('\n🧹 Engine disposed successfully');
}
