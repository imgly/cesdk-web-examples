import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Using Strokes
 *
 * Demonstrates how to add and customize strokes (outlines) programmatically:
 * - Checking stroke support on blocks
 * - Enabling and disabling strokes
 * - Setting stroke color and width
 * - Applying stroke styles (solid, dashed, dotted)
 * - Controlling stroke position relative to block edges
 * - Adjusting stroke corner geometry
 * - Exporting the result
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];

    // Create a graphic block with a rectangle shape
    const graphic = engine.block.create('graphic');
    engine.block.setShape(graphic, engine.block.createShape('rect'));
    engine.block.setWidth(graphic, 300);
    engine.block.setHeight(graphic, 200);
    engine.block.setPositionX(graphic, 250);
    engine.block.setPositionY(graphic, 200);
    engine.block.appendChild(page, graphic);

    // Set a fill color so the shape is visible
    const fill = engine.block.createFill('color');
    engine.block.setFill(graphic, fill);
    engine.block.setColor(fill, 'fill/color/value', {
      r: 0.9,
      g: 0.9,
      b: 0.9,
      a: 1.0
    });

    // Check if the block supports strokes before applying
    const canHaveStroke = engine.block.supportsStroke(graphic);
    console.log('Block supports strokes:', canHaveStroke);

    // Enable stroke on the block
    engine.block.setStrokeEnabled(graphic, true);

    // Verify stroke is enabled
    const strokeEnabled = engine.block.isStrokeEnabled(graphic);
    console.log('Stroke enabled:', strokeEnabled);

    // Set stroke color to blue (RGBA values from 0.0 to 1.0)
    engine.block.setStrokeColor(graphic, { r: 0.2, g: 0.4, b: 0.9, a: 1.0 });

    // Read the current stroke color
    const strokeColor = engine.block.getStrokeColor(graphic);
    console.log('Stroke color:', strokeColor);

    // Set stroke width in design units
    engine.block.setStrokeWidth(graphic, 8);

    // Read the current stroke width
    const strokeWidth = engine.block.getStrokeWidth(graphic);
    console.log('Stroke width:', strokeWidth);

    // Set stroke style to dashed
    // Available styles: 'Solid', 'Dashed', 'DashedRound', 'Dotted',
    // 'LongDashed', 'LongDashedRound'
    engine.block.setStrokeStyle(graphic, 'Dashed');

    // Read the current stroke style
    const strokeStyle = engine.block.getStrokeStyle(graphic);
    console.log('Stroke style:', strokeStyle);

    // Set stroke position relative to block edge
    // Available positions: 'Center', 'Inner', 'Outer'
    engine.block.setStrokePosition(graphic, 'Outer');

    // Read the current stroke position
    const strokePosition = engine.block.getStrokePosition(graphic);
    console.log('Stroke position:', strokePosition);

    // Set stroke corner geometry
    // Available geometries: 'Miter', 'Round', 'Bevel'
    engine.block.setStrokeCornerGeometry(graphic, 'Round');

    // Read the current corner geometry
    const cornerGeometry = engine.block.getStrokeCornerGeometry(graphic);
    console.log('Corner geometry:', cornerGeometry);

    // Create additional shapes to demonstrate different stroke configurations

    // Dotted stroke with inner position
    const graphic2 = engine.block.create('graphic');
    engine.block.setShape(graphic2, engine.block.createShape('rect'));
    engine.block.setWidth(graphic2, 150);
    engine.block.setHeight(graphic2, 100);
    engine.block.setPositionX(graphic2, 50);
    engine.block.setPositionY(graphic2, 50);
    engine.block.appendChild(page, graphic2);

    const fill2 = engine.block.createFill('color');
    engine.block.setFill(graphic2, fill2);
    engine.block.setColor(fill2, 'fill/color/value', {
      r: 1.0,
      g: 0.95,
      b: 0.8,
      a: 1.0
    });

    engine.block.setStrokeEnabled(graphic2, true);
    engine.block.setStrokeColor(graphic2, { r: 0.9, g: 0.5, b: 0.1, a: 1.0 });
    engine.block.setStrokeWidth(graphic2, 4);
    engine.block.setStrokeStyle(graphic2, 'Dotted');
    engine.block.setStrokePosition(graphic2, 'Inner');
    engine.block.setStrokeCornerGeometry(graphic2, 'Miter');

    // Solid stroke with bevel corners
    const graphic3 = engine.block.create('graphic');
    engine.block.setShape(graphic3, engine.block.createShape('rect'));
    engine.block.setWidth(graphic3, 150);
    engine.block.setHeight(graphic3, 100);
    engine.block.setPositionX(graphic3, 600);
    engine.block.setPositionY(graphic3, 50);
    engine.block.appendChild(page, graphic3);

    const fill3 = engine.block.createFill('color');
    engine.block.setFill(graphic3, fill3);
    engine.block.setColor(fill3, 'fill/color/value', {
      r: 0.85,
      g: 0.95,
      b: 0.85,
      a: 1.0
    });

    engine.block.setStrokeEnabled(graphic3, true);
    engine.block.setStrokeColor(graphic3, { r: 0.2, g: 0.6, b: 0.3, a: 1.0 });
    engine.block.setStrokeWidth(graphic3, 6);
    engine.block.setStrokeStyle(graphic3, 'Solid');
    engine.block.setStrokePosition(graphic3, 'Center');
    engine.block.setStrokeCornerGeometry(graphic3, 'Bevel');

    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/stroked-shapes.png`, buffer);

    console.log('Exported result to output/stroked-shapes.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
