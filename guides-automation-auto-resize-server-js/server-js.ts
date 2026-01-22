import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Auto-Resize
 *
 * Demonstrates block sizing modes and responsive layout patterns:
 * - Setting width and height modes (Absolute, Percent, Auto)
 * - Reading computed frame dimensions after layout
 * - Centering text blocks based on computed dimensions
 * - Creating responsive layouts with percentage-based sizing
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Create a scene with a page
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create a text block with Auto sizing mode
  // Auto mode makes the block expand to fit its content
  const titleBlock = engine.block.create('text');
  engine.block.replaceText(titleBlock, 'Auto-Resize Demo');
  engine.block.setTextFontSize(titleBlock, 64);

  // Set width and height modes to Auto
  // The block will automatically size to fit the text content
  engine.block.setWidthMode(titleBlock, 'Auto');
  engine.block.setHeightMode(titleBlock, 'Auto');
  engine.block.appendChild(page, titleBlock);

  // Read computed frame dimensions after layout
  // getFrameWidth/getFrameHeight return the actual rendered size
  const titleWidth = engine.block.getFrameWidth(titleBlock);
  const titleHeight = engine.block.getFrameHeight(titleBlock);

  // eslint-disable-next-line no-console
  console.log(`Title dimensions: ${titleWidth.toFixed(0)}x${titleHeight.toFixed(0)} pixels`);

  // Calculate centered position using frame dimensions
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);
  const centerX = (pageWidth - titleWidth) / 2;
  const centerY = (pageHeight - titleHeight) / 2 - 100; // Offset up for layout

  // Position the title at center
  engine.block.setPositionX(titleBlock, centerX);
  engine.block.setPositionY(titleBlock, centerY);

  // Create a block using Percent mode for responsive sizing
  // Percent mode sizes the block relative to its parent
  const backgroundBlock = engine.block.create('graphic');
  engine.block.setShape(backgroundBlock, engine.block.createShape('rect'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', { r: 0.2, g: 0.4, b: 0.8, a: 0.3 });
  engine.block.setFill(backgroundBlock, fill);

  // Set to Percent mode - values are normalized (0-1)
  engine.block.setWidthMode(backgroundBlock, 'Percent');
  engine.block.setHeightMode(backgroundBlock, 'Percent');
  engine.block.setWidth(backgroundBlock, 0.8); // 80% of parent width
  engine.block.setHeight(backgroundBlock, 0.3); // 30% of parent height

  // Center the background block
  engine.block.setPositionX(backgroundBlock, pageWidth * 0.1); // 10% margin
  engine.block.setPositionY(backgroundBlock, pageHeight * 0.6);
  engine.block.appendChild(page, backgroundBlock);

  // Create a subtitle with Auto mode
  const subtitleBlock = engine.block.create('text');
  engine.block.replaceText(subtitleBlock, 'Text automatically sizes to fit content');
  engine.block.setTextFontSize(subtitleBlock, 32);
  engine.block.setWidthMode(subtitleBlock, 'Auto');
  engine.block.setHeightMode(subtitleBlock, 'Auto');
  engine.block.appendChild(page, subtitleBlock);

  // Read computed dimensions and center
  const subtitleWidth = engine.block.getFrameWidth(subtitleBlock);
  const subtitleCenterX = (pageWidth - subtitleWidth) / 2;
  engine.block.setPositionX(subtitleBlock, subtitleCenterX);
  engine.block.setPositionY(subtitleBlock, pageHeight * 0.7);

  // Verify sizing modes
  const titleWidthMode = engine.block.getWidthMode(titleBlock);
  const titleHeightMode = engine.block.getHeightMode(titleBlock);
  const bgWidthMode = engine.block.getWidthMode(backgroundBlock);
  const bgHeightMode = engine.block.getHeightMode(backgroundBlock);

  // eslint-disable-next-line no-console
  console.log(`Title modes: width=${titleWidthMode}, height=${titleHeightMode}`);
  // eslint-disable-next-line no-console
  console.log(`Background modes: width=${bgWidthMode}, height=${bgHeightMode}`);

  // Export the result
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/auto-resize-demo.png`, buffer);

  // eslint-disable-next-line no-console
  console.log(`\n✓ Exported auto-resize-demo.png to ${outputDir}/`);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
