import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

// Type guard helpers for identifying color types
function isRGBAColor(
  color: any
): color is { r: number; g: number; b: number; a: number } {
  return 'r' in color && 'g' in color && 'b' in color && 'a' in color;
}

function isCMYKColor(
  color: any
): color is { c: number; m: number; y: number; k: number; tint: number } {
  return 'c' in color && 'm' in color && 'y' in color && 'k' in color;
}

function isSpotColor(
  color: any
): color is { name: string; tint: number; externalReference: string } {
  return 'name' in color && 'tint' in color && 'externalReference' in color;
}

async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Calculate block sizes for three columns
    const margin = 40;
    const spacing = 30;
    const availableWidth = pageWidth - 2 * margin - 2 * spacing;
    const blockWidth = availableWidth / 3;
    const blockHeight = pageHeight - 2 * margin;

    // Define a spot color with RGB approximation for screen preview
    engine.editor.setSpotColorRGB('Brand Red', 0.95, 0.25, 0.21);

    // Create three blocks with different color spaces

    // Block 1: sRGB color (for screen display)
    const srgbBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      srgbBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const srgbFill = engine.block.createFill('//ly.img.ubq/fill/color');
    engine.block.setColor(srgbFill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1.0
    });
    engine.block.setFill(srgbBlock, srgbFill);
    engine.block.setWidth(srgbBlock, blockWidth);
    engine.block.setHeight(srgbBlock, blockHeight);
    engine.block.appendChild(page, srgbBlock);

    // Block 2: CMYK color (for print workflows)
    const cmykBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      cmykBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const cmykFill = engine.block.createFill('//ly.img.ubq/fill/color');
    engine.block.setColor(cmykFill, 'fill/color/value', {
      c: 0.0,
      m: 0.8,
      y: 0.95,
      k: 0.0,
      tint: 1.0
    });
    engine.block.setFill(cmykBlock, cmykFill);
    engine.block.setWidth(cmykBlock, blockWidth);
    engine.block.setHeight(cmykBlock, blockHeight);
    engine.block.appendChild(page, cmykBlock);

    // Block 3: Spot color (for specialized printing)
    const spotBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      spotBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const spotFill = engine.block.createFill('//ly.img.ubq/fill/color');
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'Brand Red',
      tint: 1.0,
      externalReference: ''
    });
    engine.block.setFill(spotBlock, spotFill);
    engine.block.setWidth(spotBlock, blockWidth);
    engine.block.setHeight(spotBlock, blockHeight);
    engine.block.appendChild(page, spotBlock);

    // Position all color blocks
    engine.block.setPositionX(srgbBlock, margin);
    engine.block.setPositionY(srgbBlock, margin);

    engine.block.setPositionX(cmykBlock, margin + blockWidth + spacing);
    engine.block.setPositionY(cmykBlock, margin);

    engine.block.setPositionX(spotBlock, margin + 2 * (blockWidth + spacing));
    engine.block.setPositionY(spotBlock, margin);

    // Convert colors to sRGB for screen display
    const srgbColor = engine.block.getColor(srgbFill, 'fill/color/value');
    const cmykColor = engine.block.getColor(cmykFill, 'fill/color/value');
    const spotColor = engine.block.getColor(spotFill, 'fill/color/value');

    // Convert CMYK to sRGB
    const cmykToRgba = engine.editor.convertColorToColorSpace(
      cmykColor,
      'sRGB'
    );
    console.log('CMYK converted to sRGB:', cmykToRgba);

    // Convert Spot color to sRGB (uses defined RGB approximation)
    const spotToRgba = engine.editor.convertColorToColorSpace(
      spotColor,
      'sRGB'
    );
    console.log('Spot color converted to sRGB:', spotToRgba);

    // Convert colors to CMYK for print workflows
    const srgbToCmyk = engine.editor.convertColorToColorSpace(
      srgbColor,
      'CMYK'
    );
    console.log('sRGB converted to CMYK:', srgbToCmyk);

    // Convert Spot color to CMYK for print output
    // First define CMYK approximation for the spot color
    engine.editor.setSpotColorCMYK('Brand Red', 0.0, 0.85, 0.9, 0.05);
    const spotToCmyk = engine.editor.convertColorToColorSpace(
      spotColor,
      'CMYK'
    );
    console.log('Spot color converted to CMYK:', spotToCmyk);

    // Use type guards to identify color space before conversion
    if (isRGBAColor(srgbColor)) {
      console.log(
        'sRGB color components:',
        `R: ${srgbColor.r}, G: ${srgbColor.g}, B: ${srgbColor.b}, A: ${srgbColor.a}`
      );
    }

    if (isCMYKColor(cmykColor)) {
      console.log(
        'CMYK color components:',
        `C: ${cmykColor.c}, M: ${cmykColor.m}, Y: ${cmykColor.y}, K: ${cmykColor.k}, Tint: ${cmykColor.tint}`
      );
    }

    if (isSpotColor(spotColor)) {
      console.log('Spot color name:', spotColor.name, 'Tint:', spotColor.tint);
    }

    // Export the scene to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/color-conversion.png`, buffer);
    console.log('Exported to output/color-conversion.png');

    console.log('Color Conversion example completed successfully');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
