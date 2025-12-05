import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Export with Color Mask
 *
 * Demonstrates color mask exports for removing specific colors:
 * - Basic color mask export with RGB values
 * - Specifying and converting mask colors
 * - Export format options (PNG, compression)
 * - Saving masked image and alpha mask files
 * - Different block types (pages, groups, individual blocks)
 * - Use cases (print workflows, transparency creation)
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

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Output directory for exported files
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Create an image with registration marks that we'll mask out
  const imageBlock = await engine.block.addImage(imageUri, {
    size: { width: pageWidth * 0.8, height: pageHeight * 0.8 }
  });
  engine.block.appendChild(page, imageBlock);

  // Center the image on the page
  const imageWidth = engine.block.getWidth(imageBlock);
  const imageHeight = engine.block.getHeight(imageBlock);
  engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
  engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

  // Add registration marks at the corners (pure red)
  const markSize = 30;
  const imageX = engine.block.getPositionX(imageBlock);
  const imageY = engine.block.getPositionY(imageBlock);

  const markPositions = [
    { x: imageX - markSize - 10, y: imageY - markSize - 10 }, // Top-left
    { x: imageX + imageWidth + 10, y: imageY - markSize - 10 }, // Top-right
    { x: imageX - markSize - 10, y: imageY + imageHeight + 10 }, // Bottom-left
    { x: imageX + imageWidth + 10, y: imageY + imageHeight + 10 } // Bottom-right
  ];

  markPositions.forEach((pos) => {
    const mark = engine.block.create('graphic');
    engine.block.setShape(mark, engine.block.createShape('rect'));
    const redFill = engine.block.createFill('color');
    engine.block.setColor(redFill, 'fill/color/value', {
      r: 1.0,
      g: 0.0,
      b: 0.0,
      a: 1.0
    });
    engine.block.setFill(mark, redFill);
    engine.block.setWidth(mark, markSize);
    engine.block.setHeight(mark, markSize);
    engine.block.setPositionX(mark, pos.x);
    engine.block.setPositionY(mark, pos.y);
    engine.block.appendChild(page, mark);
  });

  // Export with red color masked - removes registration marks
  const [maskedImage1, alphaMask1] = await engine.block.exportWithColorMask(
    page,
    1.0, // Red component (0.0-1.0)
    0.0, // Green component
    0.0, // Blue component (RGB: pure red)
    { mimeType: 'image/png' }
  );

  // Save both files to the file system
  const buffer1 = Buffer.from(await maskedImage1.arrayBuffer());
  writeFileSync(`${outputDir}/example1-masked.png`, buffer1);
  const maskBuffer1 = Buffer.from(await alphaMask1.arrayBuffer());
  writeFileSync(`${outputDir}/example1-mask.png`, maskBuffer1);

  // Convert RGB values from 0-255 to 0.0-1.0 range
  // Clear previous marks for new example
  const allBlocks = engine.block.findByType('graphic');
  allBlocks.forEach((block) => {
    if (block !== imageBlock) {
      engine.block.destroy(block);
    }
  });

  // RGB values in 0-255 range
  const rgb255 = { r: 255, g: 128, b: 64 };

  // Convert to 0.0-1.0 range
  const rgb01 = {
    r: rgb255.r / 255, // 1.0
    g: rgb255.g / 255, // 0.502
    b: rgb255.b / 255 // 0.251
  };

  // Add custom color marks
  markPositions.forEach((pos) => {
    const mark = engine.block.create('graphic');
    engine.block.setShape(mark, engine.block.createShape('rect'));
    const customFill = engine.block.createFill('color');
    engine.block.setColor(customFill, 'fill/color/value', {
      r: rgb01.r,
      g: rgb01.g,
      b: rgb01.b,
      a: 1.0
    });
    engine.block.setFill(mark, customFill);
    engine.block.setWidth(mark, markSize);
    engine.block.setHeight(mark, markSize);
    engine.block.setPositionX(mark, pos.x);
    engine.block.setPositionY(mark, pos.y);
    engine.block.appendChild(page, mark);
  });

  // Export with custom color masked
  const [maskedImage2, alphaMask2] = await engine.block.exportWithColorMask(
    page,
    rgb01.r,
    rgb01.g,
    rgb01.b,
    { mimeType: 'image/png' }
  );

  const buffer2 = Buffer.from(await maskedImage2.arrayBuffer());
  writeFileSync(`${outputDir}/example2-masked.png`, buffer2);
  const maskBuffer2 = Buffer.from(await alphaMask2.arrayBuffer());
  writeFileSync(`${outputDir}/example2-mask.png`, maskBuffer2);
  // Export with specific format options (compression, size)
  // Clear previous marks
  const blocks2 = engine.block.findByType('graphic');
  blocks2.forEach((block) => {
    if (block !== imageBlock) {
      engine.block.destroy(block);
    }
  });

  // Add magenta marks
  markPositions.forEach((pos) => {
    const mark = engine.block.create('graphic');
    engine.block.setShape(mark, engine.block.createShape('rect'));
    const magentaFill = engine.block.createFill('color');
    engine.block.setColor(magentaFill, 'fill/color/value', {
      r: 1.0,
      g: 0.0,
      b: 1.0,
      a: 1.0
    });
    engine.block.setFill(mark, magentaFill);
    engine.block.setWidth(mark, markSize);
    engine.block.setHeight(mark, markSize);
    engine.block.setPositionX(mark, pos.x);
    engine.block.setPositionY(mark, pos.y);
    engine.block.appendChild(page, mark);
  });

  // Export with format options
  const [maskedImage3, alphaMask3] = await engine.block.exportWithColorMask(
    page,
    1.0,
    0.0,
    1.0, // Magenta
    {
      mimeType: 'image/png',
      pngCompressionLevel: 9, // Maximum compression
      targetWidth: 400,
      targetHeight: 300
    }
  );

  const buffer3 = Buffer.from(await maskedImage3.arrayBuffer());
  writeFileSync(`${outputDir}/example3-masked.png`, buffer3);
  const maskBuffer3 = Buffer.from(await alphaMask3.arrayBuffer());
  writeFileSync(`${outputDir}/example3-mask.png`, maskBuffer3);
  // Demonstrate saving both masked image and alpha mask
  const blocks3 = engine.block.findByType('graphic');
  blocks3.forEach((block) => {
    if (block !== imageBlock) {
      engine.block.destroy(block);
    }
  });

  // Add cyan marks
  markPositions.forEach((pos) => {
    const mark = engine.block.create('graphic');
    engine.block.setShape(mark, engine.block.createShape('rect'));
    const cyanFill = engine.block.createFill('color');
    engine.block.setColor(cyanFill, 'fill/color/value', {
      r: 0.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });
    engine.block.setFill(mark, cyanFill);
    engine.block.setWidth(mark, markSize);
    engine.block.setHeight(mark, markSize);
    engine.block.setPositionX(mark, pos.x);
    engine.block.setPositionY(mark, pos.y);
    engine.block.appendChild(page, mark);
  });

  // Export and save both files
  const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
    page,
    0.0,
    1.0,
    1.0, // Cyan
    { mimeType: 'image/png' }
  );

  // Save masked image
  const maskedBuffer = Buffer.from(await maskedImage.arrayBuffer());
  writeFileSync(`${outputDir}/saved-masked.png`, maskedBuffer);

  // Save alpha mask
  const maskBuffer = Buffer.from(await alphaMask.arrayBuffer());
  writeFileSync(`${outputDir}/saved-mask.png`, maskBuffer);

  // eslint-disable-next-line no-console
  console.log('✓ Saved masked image and alpha mask to output/');
  // Export different block types with color masking
  const blocks4 = engine.block.findByType('graphic');
  blocks4.forEach((block) => {
    if (block !== imageBlock) {
      engine.block.destroy(block);
    }
  });

  // Create a group of blocks with green element
  const greenRect = engine.block.create('graphic');
  engine.block.setShape(greenRect, engine.block.createShape('rect'));
  const greenFill = engine.block.createFill('color');
  engine.block.setColor(greenFill, 'fill/color/value', {
    r: 0.0,
    g: 1.0,
    b: 0.0,
    a: 1.0
  });
  engine.block.setFill(greenRect, greenFill);
  engine.block.setWidth(greenRect, 200);
  engine.block.setHeight(greenRect, 200);
  engine.block.setPositionX(greenRect, (pageWidth - 200) / 2);
  engine.block.setPositionY(greenRect, (pageHeight - 200) / 2);
  engine.block.appendChild(page, greenRect);

  // Group the image and rectangle
  const group = engine.block.group([imageBlock, greenRect]);

  // Export the entire group with green masked
  const [groupMasked, groupMask] = await engine.block.exportWithColorMask(
    group,
    0.0,
    1.0,
    0.0, // Green
    { mimeType: 'image/png' }
  );

  const groupBuffer = Buffer.from(await groupMasked.arrayBuffer());
  writeFileSync(`${outputDir}/group-masked.png`, groupBuffer);
  const groupMaskBuffer = Buffer.from(await groupMask.arrayBuffer());
  writeFileSync(`${outputDir}/group-mask.png`, groupMaskBuffer);
  // Use case: Remove registration marks for print workflows
  engine.block.ungroup(group);
  engine.block.destroy(greenRect);

  // Add red registration marks for print workflow example
  markPositions.forEach((pos) => {
    const mark = engine.block.create('graphic');
    engine.block.setShape(mark, engine.block.createShape('rect'));
    const markFill = engine.block.createFill('color');
    engine.block.setColor(markFill, 'fill/color/value', {
      r: 1.0,
      g: 0.0,
      b: 0.0,
      a: 1.0
    });
    engine.block.setFill(mark, markFill);
    engine.block.setWidth(mark, markSize);
    engine.block.setHeight(mark, markSize);
    engine.block.setPositionX(mark, pos.x);
    engine.block.setPositionY(mark, pos.y);
    engine.block.appendChild(page, mark);
  });

  // Export with registration marks removed
  const [printReady, registrationMask] = await engine.block.exportWithColorMask(
    page,
    1.0,
    0.0,
    0.0, // Remove pure red
    {
      mimeType: 'image/png',
      pngCompressionLevel: 0 // Fast export for print
    }
  );

  const printBuffer = Buffer.from(await printReady.arrayBuffer());
  writeFileSync(`${outputDir}/print-ready.png`, printBuffer);
  const regMaskBuffer = Buffer.from(await registrationMask.arrayBuffer());
  writeFileSync(`${outputDir}/registration-mask.png`, regMaskBuffer);

  // eslint-disable-next-line no-console
  console.log('✓ Print-ready export with registration marks removed');

  // eslint-disable-next-line no-console
  console.log('✓ Exported all color mask examples to output/');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
