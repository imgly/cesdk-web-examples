import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { calculateGridLayout } from './utils';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Partial Export
 *
 * Demonstrates exporting specific blocks, groups, and pages programmatically:
 * - Exporting individual design blocks
 * - Exporting grouped elements
 * - Exporting specific pages
 * - Export format selection and options
 * - Understanding block hierarchy in exports
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 1200, height: 900 } },
  });

  const page = engine.block.findByType('page')[0];
  if (!page) {
    throw new Error('No page found');
  }

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Calculate responsive grid layout for 6 examples
  const layout = calculateGridLayout(pageWidth, pageHeight, 6);
  const { blockWidth, blockHeight, getPosition } = layout;

  // Sample image URI for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const blockSize = { width: blockWidth, height: blockHeight };

  // Create first image block
  const imageBlock1 = await engine.block.addImage(imageUri, {
    size: blockSize,
  });
  engine.block.appendChild(page, imageBlock1);

  // Export the block as PNG
  const individualBlob = await engine.block.export(imageBlock1, {
    mimeType: 'image/png',
    pngCompressionLevel: 5,
  });

  // Save individual block export
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const individualBuffer = Buffer.from(await individualBlob.arrayBuffer());
  writeFileSync(`${outputDir}/individual-block.png`, individualBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported individual block to output/individual-block.png');

  // Create second image block with different styling
  const imageBlock2 = await engine.block.addImage(imageUri, {
    size: blockSize,
    cornerRadius: 20,
  });
  engine.block.appendChild(page, imageBlock2);

  // Export as PNG with high compression
  const pngBlob = await engine.block.export(imageBlock2, {
    mimeType: 'image/png',
    pngCompressionLevel: 9, // Maximum compression
  });
  const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
  writeFileSync(`${outputDir}/export-png.png`, pngBuffer);

  // Export as JPEG with quality setting
  const jpegBlob = await engine.block.export(imageBlock2, {
    mimeType: 'image/jpeg',
    jpegQuality: 0.95, // High quality
  });
  const jpegBuffer = Buffer.from(await jpegBlob.arrayBuffer());
  writeFileSync(`${outputDir}/export-jpeg.jpg`, jpegBuffer);

  // Export as WEBP
  const webpBlob = await engine.block.export(imageBlock2, {
    mimeType: 'image/webp',
    webpQuality: 0.9,
  });
  const webpBuffer = Buffer.from(await webpBlob.arrayBuffer());
  writeFileSync(`${outputDir}/export-webp.webp`, webpBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported different formats (PNG, JPEG, WEBP)');

  // Create two shapes for grouping demonstration
  const groupShape1 = engine.block.create('//ly.img.ubq/graphic');
  const rect = engine.block.createShape('rect');
  engine.block.setShape(groupShape1, rect);
  engine.block.setWidth(groupShape1, blockWidth * 0.4);
  engine.block.setHeight(groupShape1, blockHeight * 0.4);
  const groupFill1 = engine.block.createFill('color');
  engine.block.setFill(groupShape1, groupFill1);
  engine.block.setColor(groupFill1, 'fill/color/value', {
    r: 0.3,
    g: 0.6,
    b: 0.9,
    a: 1.0,
  });
  engine.block.appendChild(page, groupShape1);

  const groupShape2 = engine.block.create('//ly.img.ubq/graphic');
  const ellipse = engine.block.createShape('ellipse');
  engine.block.setShape(groupShape2, ellipse);
  engine.block.setWidth(groupShape2, blockWidth * 0.4);
  engine.block.setHeight(groupShape2, blockHeight * 0.4);
  const groupFill2 = engine.block.createFill('color');
  engine.block.setFill(groupShape2, groupFill2);
  engine.block.setColor(groupFill2, 'fill/color/value', {
    r: 0.9,
    g: 0.3,
    b: 0.5,
    a: 1.0,
  });
  engine.block.appendChild(page, groupShape2);

  // Group the blocks together
  const exportGroup = engine.block.group([groupShape1, groupShape2]);

  // Export the group (includes all children)
  const groupBlob = await engine.block.export(exportGroup, {
    mimeType: 'image/png',
  });
  const groupBuffer = Buffer.from(await groupBlob.arrayBuffer());
  writeFileSync(`${outputDir}/group-export.png`, groupBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported grouped elements to output/group-export.png');

  // Create shape block for resizing demonstration
  const shapeBlock = engine.block.create('//ly.img.ubq/graphic');
  const shape = engine.block.createShape('star');
  engine.block.setShape(shapeBlock, shape);
  engine.block.setWidth(shapeBlock, blockWidth);
  engine.block.setHeight(shapeBlock, blockHeight);

  // Add a color fill to the shape
  const shapeFill = engine.block.createFill('color');
  engine.block.setFill(shapeBlock, shapeFill);
  engine.block.setColor(shapeFill, 'fill/color/value', {
    r: 1.0,
    g: 0.7,
    b: 0.0,
    a: 1.0,
  });
  engine.block.appendChild(page, shapeBlock);

  // Export with specific target dimensions
  const resizedBlob = await engine.block.export(shapeBlock, {
    mimeType: 'image/png',
    targetWidth: 400,
    targetHeight: 400, // Aspect ratio is preserved
  });
  const resizedBuffer = Buffer.from(await resizedBlob.arrayBuffer());
  writeFileSync(`${outputDir}/resized-export.png`, resizedBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported resized block to output/resized-export.png');

  // Export the entire page
  const pageBlob = await engine.block.export(page, {
    mimeType: 'image/png',
    pngCompressionLevel: 5,
  });
  const pageBuffer = Buffer.from(await pageBlob.arrayBuffer());
  writeFileSync(`${outputDir}/page-export.png`, pageBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported current page to output/page-export.png');

  // Export all pages individually (for multi-page documents)
  const pages = engine.scene.getPages();
  for (let i = 0; i < pages.length; i++) {
    const pageBlob = await engine.block.export(pages[i], {
      mimeType: 'image/png',
    });
    const pageBuffer = Buffer.from(await pageBlob.arrayBuffer());
    writeFileSync(`${outputDir}/page-${i + 1}.png`, pageBuffer);
  }
  // eslint-disable-next-line no-console
  console.log(`✓ Exported ${pages.length} page(s) individually`);

  // Export as PDF to preserve vector information
  const pdfBlob = await engine.block.export(page, {
    mimeType: 'application/pdf',
  });
  const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
  writeFileSync(`${outputDir}/export.pdf`, pdfBuffer);
  // eslint-disable-next-line no-console
  console.log('✓ Exported page as PDF to output/export.pdf');

  // Get maximum export size
  const maxExportSize = engine.editor.getMaxExportSize();
  // eslint-disable-next-line no-console
  console.log('Maximum export size:', maxExportSize, 'pixels');

  // Get available memory
  const availableMemory = engine.editor.getAvailableMemory();
  // eslint-disable-next-line no-console
  console.log('Available memory:', availableMemory, 'bytes');

  // Position all blocks in grid layout for the first page
  const blocks = [
    imageBlock1,
    imageBlock2,
    exportGroup,
    shapeBlock,
    groupShape1,
    groupShape2,
  ];
  blocks.forEach((block, index) => {
    if (index < 4) {
      // Position first 4 blocks (group contains 2)
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    }
  });

  // Position grouped shapes relative to group
  const groupPos = getPosition(2);
  engine.block.setPositionX(exportGroup, groupPos.x);
  engine.block.setPositionY(exportGroup, groupPos.y);
  engine.block.setPositionX(groupShape1, 10);
  engine.block.setPositionY(groupShape1, 10);
  engine.block.setPositionX(groupShape2, 60);
  engine.block.setPositionY(groupShape2, 60);

  // Export the complete scene for reference
  const completeBlob = await engine.block.export(page, {
    mimeType: 'image/png',
  });
  const completeBuffer = Buffer.from(await completeBlob.arrayBuffer());
  writeFileSync(`${outputDir}/partial-export-result.png`, completeBuffer);

  // eslint-disable-next-line no-console
  console.log(
    '\n✓ Exported complete result to output/partial-export-result.png'
  );
  // eslint-disable-next-line no-console
  console.log('✓ Partial export examples completed successfully');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
