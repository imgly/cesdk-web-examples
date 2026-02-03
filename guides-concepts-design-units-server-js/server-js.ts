import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Design Units Guide
 *
 * Demonstrates working with design units in CE.SDK:
 * - Understanding unit types (Pixel, Millimeter, Inch)
 * - Getting and setting the design unit
 * - Configuring DPI for print output
 * - Setting up print-ready dimensions
 */
async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a new scene
    const scene = engine.scene.create();

    // Get the current design unit
    const currentUnit = engine.scene.getDesignUnit();
    console.log('Current design unit:', currentUnit); // 'Pixel' by default

    // Set design unit to Millimeter for print workflow
    engine.scene.setDesignUnit('Millimeter');

    // Verify the change
    const newUnit = engine.scene.getDesignUnit();
    console.log('Design unit changed to:', newUnit); // 'Millimeter'

    // Set DPI to 300 for print-quality exports
    // Higher DPI produces higher resolution output
    engine.block.setFloat(scene, 'scene/dpi', 300);

    // Verify the DPI setting
    const dpi = engine.block.getFloat(scene, 'scene/dpi');
    console.log('DPI set to:', dpi); // 300

    // Create a page and set A4 dimensions (210 x 297 mm)
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page to A4 size in millimeters
    engine.block.setWidth(page, 210);
    engine.block.setHeight(page, 297);

    // Verify dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    console.log(`Page dimensions: ${pageWidth}mm x ${pageHeight}mm`);

    // Create a text block with millimeter dimensions
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    // Position text at 20mm from left, 30mm from top
    engine.block.setPositionX(textBlock, 20);
    engine.block.setPositionY(textBlock, 30);

    // Set text block size to 170mm x 50mm
    engine.block.setWidth(textBlock, 170);
    engine.block.setHeight(textBlock, 50);

    // Add content to the text block
    engine.block.setString(
      textBlock,
      'text/text',
      'This A4 document uses millimeter units with 300 DPI for print-ready output.'
    );

    // Demonstrate unit comparison
    // At 300 DPI: 1 inch = 300 pixels, 1 mm = ~11.81 pixels
    console.log('Unit comparison at 300 DPI:');
    console.log(
      '- A4 width (210mm) will export as',
      210 * (300 / 25.4),
      'pixels'
    );
    console.log(
      '- A4 height (297mm) will export as',
      297 * (300 / 25.4),
      'pixels'
    );

    console.log(
      'Design units guide completed. Scene configured for A4 print output.'
    );
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
