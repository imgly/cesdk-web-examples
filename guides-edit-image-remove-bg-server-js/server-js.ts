import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { removeBackground, type Config } from '@imgly/background-removal-node';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Remove Background with @imgly/background-removal-node
 *
 * Demonstrates configuring and using the background removal library
 * for server-side image processing in Node.js.
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Create a graphic block with an image that has a background
  const imageBlock = engine.block.create('graphic');

  // Create a rect shape for the image
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(imageBlock, rectShape);

  // Create an image fill with a sample portrait image
  const imageFill = engine.block.createFill('image');
  const imageUri = 'https://img.ly/static/ubq_samples/sample_4.jpg';
  engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUri);

  // Apply the fill to the graphic block
  engine.block.setFill(imageBlock, imageFill);

  // Set content fill mode to cover the block
  engine.block.setContentFillMode(imageBlock, 'Cover');

  // Size and position the image block
  const imageWidth = 400;
  const imageHeight = 450;
  engine.block.setWidth(imageBlock, imageWidth);
  engine.block.setHeight(imageBlock, imageHeight);
  engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
  engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

  // Add to page
  engine.block.appendChild(page, imageBlock);

  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Configure background removal options
  const removalConfig: Config = {
    // Model size: 'small' for speed, 'medium' for balance, 'large' for quality
    model: 'medium',
    // Output format and quality
    output: {
      format: 'image/png',
      quality: 0.9,
    },
    // Progress callback for monitoring
    progress: (key, current, total) => {
      const percentage = Math.round((current / total) * 100);
      console.log(`  ${key}: ${percentage}%`);
    },
  };

  // Export the image block as PNG blob
  console.log('Removing background...');
  const imageBlob = await engine.block.export(imageBlock, {
    mimeType: 'image/png',
  });

  // Remove background using the configured options
  const processedBlob = await removeBackground(imageBlob, removalConfig);
  console.log('✓ Background removed successfully');

  // Convert the processed blob to a data URL and apply it back to the scene
  const processedBuffer = Buffer.from(await processedBlob.arrayBuffer());
  const base64Image = processedBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;

  // Update the image fill with the processed image
  engine.block.setString(imageFill, 'fill/image/imageFileURI', dataUrl);
  console.log('✓ Applied processed image to scene');

  // Export the final result with transparent background
  const resultBlob = await engine.block.export(page, { mimeType: 'image/png' });
  const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());
  writeFileSync(`${outputDir}/remove-bg-result.png`, resultBuffer);
  console.log('✓ Exported result to output/remove-bg-result.png');

  console.log('\n✓ Processing complete!');
  console.log('  Output directory:', outputDir);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
