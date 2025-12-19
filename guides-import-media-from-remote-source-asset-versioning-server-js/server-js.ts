import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Asset Versioning
 *
 * Demonstrates how CE.SDK handles asset URLs in saved designs:
 * - How assets are stored as URL references
 * - Scene serialization vs archive export
 * - Inspecting and modifying asset URLs
 * - Strategies for versioned asset URLs
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create an image block with a remote URL
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  const imageBlock = engine.block.create('graphic');
  engine.block.setShape(imageBlock, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUri);
  engine.block.setFill(imageBlock, imageFill);
  engine.block.setWidth(imageBlock, 300);
  engine.block.setHeight(imageBlock, 200);
  engine.block.setPositionX(imageBlock, 50);
  engine.block.setPositionY(imageBlock, 50);
  engine.block.appendChild(page, imageBlock);

  // Get the fill block that contains the image URI
  const fill = engine.block.getFill(imageBlock);

  // Inspect the stored URI - this is exactly what gets saved in the scene
  const storedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
  console.log('Stored image URI:', storedUri);

  // Save the scene to a string - URLs are preserved as references
  const sceneString = await engine.scene.saveToString();
  console.log('Scene saved to string, length:', sceneString.length);

  // The scene string contains the URL reference, not the image data itself
  // This keeps the saved scene small and loads quickly

  // Alternatively, save as an archive with embedded assets
  const archiveBlob = await engine.scene.saveToArchive();
  console.log('Archive created, size:', archiveBlob.size, 'bytes');

  // Archives are self-contained - they include all asset data
  // Use archives when designs need to work offline or across environments

  // Programmatically update an asset URL (e.g., for CDN migration)
  const newUri = 'https://img.ly/static/ubq_samples/sample_2.jpg';
  engine.block.setString(fill, 'fill/image/imageFileURI', newUri);

  // Verify the change
  const updatedUri = engine.block.getString(fill, 'fill/image/imageFileURI');
  console.log('Updated image URI:', updatedUri);

  // Find all graphic blocks to batch update their asset URLs
  const graphicBlocks = engine.block.findByType('graphic');
  console.log('Found graphic blocks:', graphicBlocks.length);

  // Iterate through blocks to inspect or update their fills
  for (const blockId of graphicBlocks) {
    const blockFill = engine.block.getFill(blockId);
    const fillType = engine.block.getType(blockFill);

    if (fillType === '//ly.img.ubq/fill/image') {
      const uri = engine.block.getString(blockFill, 'fill/image/imageFileURI');
      console.log('Image block found with URI:', uri);

      // Example: migrate from old CDN to new CDN
      if (uri.includes('old-cdn.example.com')) {
        const migratedUri = uri.replace(
          'old-cdn.example.com',
          'new-cdn.example.com'
        );
        engine.block.setString(
          blockFill,
          'fill/image/imageFileURI',
          migratedUri
        );
      }
    }
  }

  // Demonstrate versioned URL patterns

  // Path-based versioning: include version in the URL path
  const pathVersionedUrl = 'https://cdn.example.com/assets/v2/logo.png';
  console.log('Path-versioned URL:', pathVersionedUrl);

  // Hash-based versioning: include content hash in filename
  const hashVersionedUrl = 'https://cdn.example.com/assets/logo-a1b2c3d4.png';
  console.log('Hash-versioned URL:', hashVersionedUrl);

  // Query parameter versioning: append version as query string
  const queryVersionedUrl = 'https://cdn.example.com/assets/logo.png?v=2';
  console.log('Query-versioned URL:', queryVersionedUrl);

  // Add a second image to make the scene more complete
  const secondImageUri = 'https://img.ly/static/ubq_samples/sample_3.jpg';
  const secondImageBlock = engine.block.create('graphic');
  engine.block.setShape(secondImageBlock, engine.block.createShape('rect'));
  const secondImageFill = engine.block.createFill('image');
  engine.block.setString(
    secondImageFill,
    'fill/image/imageFileURI',
    secondImageUri
  );
  engine.block.setFill(secondImageBlock, secondImageFill);
  engine.block.setWidth(secondImageBlock, 300);
  engine.block.setHeight(secondImageBlock, 200);
  engine.block.setPositionX(secondImageBlock, 400);
  engine.block.setPositionY(secondImageBlock, 50);
  engine.block.appendChild(page, secondImageBlock);

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/asset-versioning-result.png`, buffer);

  // Also save the scene string for demonstration
  writeFileSync(`${outputDir}/scene.txt`, sceneString);

  console.log('✓ Exported result to output/asset-versioning-result.png');
  console.log('✓ Saved scene string to output/scene.txt');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
