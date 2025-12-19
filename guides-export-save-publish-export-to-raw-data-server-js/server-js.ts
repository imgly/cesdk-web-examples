import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Export to Raw Data
 *
 * Demonstrates exporting designs to uncompressed RGBA pixel data for custom
 * image processing in Node.js:
 * - Exporting blocks to raw pixel data
 * - Processing pixels with custom algorithms
 * - Integrating with image processing libraries (Sharp)
 * - Saving processed data to files
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({});

try {
  // Create a design scene with a single image
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];

  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const imageBlock = await engine.block.addImage(imageUri, {
    size: { width: 800, height: 600 },
  });
  engine.block.appendChild(page, imageBlock);
  engine.block.setPositionX(imageBlock, 0);
  engine.block.setPositionY(imageBlock, 0);

  // Export to raw pixel data
  const width = Math.floor(engine.block.getWidth(imageBlock));
  const height = Math.floor(engine.block.getHeight(imageBlock));

  const blob = await engine.block.export(imageBlock, {
    mimeType: 'application/octet-stream',
    targetWidth: width,
    targetHeight: height,
  });

  // Convert blob to Buffer for Node.js processing
  const arrayBuffer = await blob.arrayBuffer();
  const pixelData = Buffer.from(arrayBuffer);

  // eslint-disable-next-line no-console
  console.log(`✓ Exported ${pixelData.length} bytes (${width}x${height} RGBA)`);

  // Apply grayscale processing to demonstrate pixel manipulation
  const processedData = toGrayscale(pixelData);

  // eslint-disable-next-line no-console
  console.log('✓ Applied grayscale effect');

  // Save processed raw data to file
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(`${outputDir}/raw-data.bin`, processedData);

  // eslint-disable-next-line no-console
  console.log(`✓ Saved raw data to ${outputDir}/raw-data.bin`);

  // Integration with Sharp for converting raw data to PNG
  // Note: This requires 'sharp' to be installed: npm install sharp
  //
  // import sharp from 'sharp';
  //
  // await sharp(processedData, {
  //   raw: {
  //     width,
  //     height,
  //     channels: 4 // RGBA
  //   }
  // })
  //   .png({ compressionLevel: 9 })
  //   .toFile(`${outputDir}/processed.png`);
  //
  // console.log('✓ Saved PNG to output/processed.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}

/**
 * Convert image to grayscale by averaging RGB channels
 */
function toGrayscale(pixelData: Buffer): Buffer {
  const result = Buffer.from(pixelData);
  for (let i = 0; i < result.length; i += 4) {
    const avg = Math.round((result[i] + result[i + 1] + result[i + 2]) / 3);
    result[i] = avg; // R
    result[i + 1] = avg; // G
    result[i + 2] = avg; // B
    // Keep alpha unchanged: result[i + 3]
  }
  return result;
}
