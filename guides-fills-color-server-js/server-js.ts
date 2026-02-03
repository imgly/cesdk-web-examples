import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config();

async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    // Check if block supports fills
    const canHaveFill = engine.block.supportsFill(page);
    if (!canHaveFill) {
      throw new Error('Block does not support fills');
    }

    // Create a color fill
    const colorFill = engine.block.createFill('color');

    // Create a graphic block with a shape
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 50);
    engine.block.setPositionY(block, 50);
    engine.block.appendChild(page, block);

    // Apply the fill to the block
    engine.block.setFill(block, colorFill);

    // Set the fill color using RGB values
    engine.block.setColor(colorFill, 'fill/color/value', {
      r: 1.0, // Red (0.0 to 1.0)
      g: 0.0, // Green
      b: 0.0, // Blue
      a: 1.0 // Alpha (opacity)
    });

    // Get the current fill from a block
    const currentFill = engine.block.getFill(block);
    const fillType = engine.block.getType(currentFill);
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/color'

    // Get the current color value
    const currentColor = engine.block.getColor(colorFill, 'fill/color/value');
    console.log('Current color:', currentColor);

    // Create a block with CMYK color for print workflows
    const cmykBlock = engine.block.create('graphic');
    engine.block.setShape(cmykBlock, engine.block.createShape('ellipse'));
    engine.block.setWidth(cmykBlock, 150);
    engine.block.setHeight(cmykBlock, 150);
    engine.block.setPositionX(cmykBlock, 300);
    engine.block.setPositionY(cmykBlock, 50);
    engine.block.appendChild(page, cmykBlock);

    const cmykFill = engine.block.createFill('color');
    engine.block.setFill(cmykBlock, cmykFill);
    engine.block.setColor(cmykFill, 'fill/color/value', {
      c: 0.0, // Cyan (0.0 to 1.0)
      m: 1.0, // Magenta
      y: 0.0, // Yellow
      k: 0.0, // Key/Black
      tint: 1.0 // Tint value (0.0 to 1.0)
    });

    // First define the spot color globally
    engine.editor.setSpotColorRGB('BrandRed', 0.9, 0.1, 0.1);

    // Then apply to fill
    const spotBlock = engine.block.create('graphic');
    engine.block.setShape(spotBlock, engine.block.createShape('ellipse'));
    engine.block.setWidth(spotBlock, 150);
    engine.block.setHeight(spotBlock, 150);
    engine.block.setPositionX(spotBlock, 500);
    engine.block.setPositionY(spotBlock, 50);
    engine.block.appendChild(page, spotBlock);

    const spotFill = engine.block.createFill('color');
    engine.block.setFill(spotBlock, spotFill);
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'BrandRed',
      tint: 1.0,
      externalReference: '' // Optional reference system
    });

    // Toggle fill visibility
    const toggleBlock = engine.block.create('graphic');
    engine.block.setShape(toggleBlock, engine.block.createShape('rect'));
    engine.block.setWidth(toggleBlock, 150);
    engine.block.setHeight(toggleBlock, 100);
    engine.block.setPositionX(toggleBlock, 50);
    engine.block.setPositionY(toggleBlock, 250);
    engine.block.appendChild(page, toggleBlock);

    const toggleFill = engine.block.createFill('color');
    engine.block.setFill(toggleBlock, toggleFill);
    engine.block.setColor(toggleFill, 'fill/color/value', {
      r: 1.0,
      g: 0.5,
      b: 0.0,
      a: 1.0
    });

    // Check fill state
    const isEnabled = engine.block.isFillEnabled(toggleBlock);
    console.log('Fill enabled:', isEnabled); // true

    // Disable the fill (block becomes transparent)
    engine.block.setFillEnabled(toggleBlock, false);

    // Re-enable
    engine.block.setFillEnabled(toggleBlock, true);

    // Share a single fill instance between multiple blocks
    const block1 = engine.block.create('graphic');
    engine.block.setShape(block1, engine.block.createShape('rect'));
    engine.block.setWidth(block1, 100);
    engine.block.setHeight(block1, 100);
    engine.block.setPositionX(block1, 250);
    engine.block.setPositionY(block1, 250);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    engine.block.setShape(block2, engine.block.createShape('rect'));
    engine.block.setWidth(block2, 100);
    engine.block.setHeight(block2, 100);
    engine.block.setPositionX(block2, 370);
    engine.block.setPositionY(block2, 250);
    engine.block.appendChild(page, block2);

    // Create one fill
    const sharedFill = engine.block.createFill('color');
    engine.block.setColor(sharedFill, 'fill/color/value', {
      r: 0.5,
      g: 0.0,
      b: 0.5,
      a: 1.0
    });

    // Apply to both blocks
    engine.block.setFill(block1, sharedFill);
    engine.block.setFill(block2, sharedFill);

    // Now changing the fill affects both blocks
    engine.block.setColor(sharedFill, 'fill/color/value', {
      r: 0.0,
      g: 0.5,
      b: 0.5,
      a: 1.0
    });

    // Convert colors between different color spaces
    const rgbColor = { r: 1.0, g: 0.0, b: 0.0, a: 1.0 };

    // Convert to CMYK
    const cmykColor = engine.editor.convertColorToColorSpace(rgbColor, 'CMYK');
    console.log('Converted CMYK color:', cmykColor);

    // Define and apply brand colors as spot colors
    engine.editor.setSpotColorRGB('PrimaryBrand', 0.2, 0.4, 0.8);
    engine.editor.setSpotColorRGB('SecondaryBrand', 0.9, 0.5, 0.1);

    const brandBlock = engine.block.create('graphic');
    engine.block.setShape(brandBlock, engine.block.createShape('rect'));
    engine.block.setWidth(brandBlock, 150);
    engine.block.setHeight(brandBlock, 100);
    engine.block.setPositionX(brandBlock, 500);
    engine.block.setPositionY(brandBlock, 250);
    engine.block.appendChild(page, brandBlock);

    const brandFill = engine.block.createFill('color');
    engine.block.setFill(brandBlock, brandFill);

    // Apply brand color
    const brandColor = {
      name: 'PrimaryBrand',
      tint: 1.0,
      externalReference: ''
    };
    engine.block.setColor(brandFill, 'fill/color/value', brandColor);

    // Create semi-transparent overlay
    const transparentBlock = engine.block.create('graphic');
    engine.block.setShape(transparentBlock, engine.block.createShape('rect'));
    engine.block.setWidth(transparentBlock, 150);
    engine.block.setHeight(transparentBlock, 100);
    engine.block.setPositionX(transparentBlock, 50);
    engine.block.setPositionY(transparentBlock, 400);
    engine.block.appendChild(page, transparentBlock);

    const transparentFill = engine.block.createFill('color');
    engine.block.setFill(transparentBlock, transparentFill);
    engine.block.setColor(transparentFill, 'fill/color/value', {
      r: 0.0,
      g: 0.8,
      b: 0.2,
      a: 0.5 // 50% opacity
    });

    // Use CMYK color space for print production
    const printBlock = engine.block.create('graphic');
    engine.block.setShape(printBlock, engine.block.createShape('rect'));
    engine.block.setWidth(printBlock, 150);
    engine.block.setHeight(printBlock, 100);
    engine.block.setPositionX(printBlock, 250);
    engine.block.setPositionY(printBlock, 400);
    engine.block.appendChild(page, printBlock);

    const printFill = engine.block.createFill('color');
    engine.block.setFill(printBlock, printFill);

    const printColor = {
      c: 0.0,
      m: 0.85,
      y: 1.0,
      k: 0.0,
      tint: 1.0
    };
    engine.block.setColor(printFill, 'fill/color/value', printColor);

    // Export the result
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Ensure output directory exists
    if (!existsSync('./output')) {
      mkdirSync('./output');
    }

    writeFileSync('./output/solid-color-fills.png', buffer);
    console.log('Exported to ./output/solid-color-fills.png');

  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
