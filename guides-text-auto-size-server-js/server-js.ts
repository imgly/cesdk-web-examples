import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Text Auto-Size
 *
 * Demonstrates text auto-sizing capabilities:
 * - Auto width and height modes for content-fitting text
 * - Fixed dimensions with automatic font sizing
 * - Font size constraints (min/max)
 * - Detecting clipped text
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

  // Create text with Auto width and height - grows to fit content
  const autoText = engine.block.create('text');
  engine.block.appendChild(page, autoText);
  engine.block.setWidthMode(autoText, 'Auto');
  engine.block.setHeightMode(autoText, 'Auto');
  engine.block.replaceText(autoText, 'Auto-sized text');
  engine.block.setFloat(autoText, 'text/fontSize', 48);
  engine.block.setPositionX(autoText, 50);
  engine.block.setPositionY(autoText, 50);

  // Create text with fixed width and auto height - wraps and grows vertically
  const wrappedText = engine.block.create('text');
  engine.block.appendChild(page, wrappedText);
  engine.block.setWidthMode(wrappedText, 'Absolute');
  engine.block.setWidth(wrappedText, 250);
  engine.block.setHeightMode(wrappedText, 'Auto');
  engine.block.replaceText(
    wrappedText,
    'This text has a fixed width but auto height, so it wraps to multiple lines'
  );
  engine.block.setFloat(wrappedText, 'text/fontSize', 48);
  engine.block.setPositionX(wrappedText, 50);
  engine.block.setPositionY(wrappedText, 150);

  // Create text with automatic font sizing - scales to fit fixed dimensions
  const scaledText = engine.block.create('text');
  engine.block.appendChild(page, scaledText);
  engine.block.setWidthMode(scaledText, 'Absolute');
  engine.block.setHeightMode(scaledText, 'Absolute');
  engine.block.setWidth(scaledText, 300);
  engine.block.setHeight(scaledText, 80);
  engine.block.setBool(scaledText, 'text/automaticFontSizeEnabled', true);
  engine.block.replaceText(scaledText, 'Auto-scaled font');
  engine.block.setPositionX(scaledText, 50);
  engine.block.setPositionY(scaledText, 350);

  // Add background to visualize the text frame
  engine.block.setBool(scaledText, 'backgroundColor/enabled', true);
  engine.block.setColor(scaledText, 'backgroundColor/color', {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0
  });

  // Create text with font size constraints
  const constrainedText = engine.block.create('text');
  engine.block.appendChild(page, constrainedText);
  engine.block.setWidthMode(constrainedText, 'Absolute');
  engine.block.setHeightMode(constrainedText, 'Absolute');
  engine.block.setWidth(constrainedText, 300);
  engine.block.setHeight(constrainedText, 80);
  engine.block.setBool(constrainedText, 'text/automaticFontSizeEnabled', true);

  // Set min and max font size constraints
  engine.block.setFloat(constrainedText, 'text/minAutomaticFontSize', 12);
  engine.block.setFloat(constrainedText, 'text/maxAutomaticFontSize', 48);

  engine.block.replaceText(
    constrainedText,
    'Font size constrained between 12-48pt'
  );
  engine.block.setPositionX(constrainedText, 50);
  engine.block.setPositionY(constrainedText, 460);

  // Add background to visualize the text frame
  engine.block.setBool(constrainedText, 'backgroundColor/enabled', true);
  engine.block.setColor(constrainedText, 'backgroundColor/color', {
    r: 0.9,
    g: 0.95,
    b: 1.0,
    a: 1.0
  });

  // Query the size modes and automatic font size state
  const widthMode = engine.block.getWidthMode(autoText);
  const heightMode = engine.block.getHeightMode(autoText);
  const isAutoFontSize = engine.block.getBool(
    scaledText,
    'text/automaticFontSizeEnabled'
  );

  console.log('Auto text width mode:', widthMode);
  console.log('Auto text height mode:', heightMode);
  console.log('Scaled text has automatic font sizing:', isAutoFontSize);

  // Check for clipped lines (text exceeding frame bounds)
  const hasClippedLines = engine.block.getBool(
    scaledText,
    'text/hasClippedLines'
  );
  console.log('Scaled text has clipped lines:', hasClippedLines);

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/text-auto-size.png', buffer);
  console.log('✅ Exported text auto-size demo to output/text-auto-size.png');
} finally {
  engine.dispose();
}
