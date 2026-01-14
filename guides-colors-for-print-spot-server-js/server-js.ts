import CreativeEngine from '@cesdk/node';
import type { SpotColor } from '@cesdk/node';

// Type guard to check if a color is a SpotColor
// Color can be RGBAColor, CMYKColor, or SpotColor
const isSpotColor = (color: unknown): color is SpotColor => {
  return (
    typeof color === 'object' &&
    color !== null &&
    'name' in color &&
    'tint' in color &&
    'externalReference' in color
  );
};

import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Spot Colors
 *
 * This example demonstrates:
 * - Defining spot colors with RGB and CMYK approximations
 * - Applying spot colors to fills, strokes, and shadows
 * - Using tints for lighter color variations
 * - Querying and updating spot color definitions
 * - Removing spot colors and handling the magenta fallback
 * - Assigning spot colors to cutout types
 * - Exporting designs with spot colors for print
 */

// Initialize CE.SDK engine with baseURL for asset loading
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
  baseURL: `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`
});

try {
  // Create a scene with a page
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  // Set page background to light gray for visibility
  const pageFill = engine.block.getFill(page);
  engine.block.setColor(pageFill, 'fill/color/value', {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0
  });

  // Helper function to create a graphic block with a color fill
  const createColorBlock = (
    x: number,
    y: number,
    width: number,
    height: number,
    shape: 'rect' | 'ellipse' = 'rect'
  ): { block: number; fill: number } => {
    const block = engine.block.create('graphic');
    const blockShape = engine.block.createShape(shape);
    engine.block.setShape(block, blockShape);
    engine.block.setWidth(block, width);
    engine.block.setHeight(block, height);
    engine.block.setPositionX(block, x);
    engine.block.setPositionY(block, y);
    engine.block.appendChild(page, block);

    const colorFill = engine.block.createFill('color');
    engine.block.setFill(block, colorFill);

    return { block, fill: colorFill };
  };

  // Define a spot color with RGB approximation
  // RGB values range from 0.0 to 1.0
  engine.editor.setSpotColorRGB('Brand-Primary', 0.8, 0.1, 0.2);

  // Add CMYK approximation for the same spot color
  // This provides print-accurate preview in addition to screen display
  engine.editor.setSpotColorCMYK('Brand-Primary', 0.05, 0.95, 0.85, 0.0);

  // Define another spot color with both approximations
  engine.editor.setSpotColorRGB('Brand-Accent', 0.2, 0.4, 0.8);
  engine.editor.setSpotColorCMYK('Brand-Accent', 0.75, 0.5, 0.0, 0.0);

  // Apply spot colors to fills using SpotColor objects
  // The tint property (0.0 to 1.0) controls color intensity
  // The externalReference field stores metadata like color system origin
  const brandPrimary: SpotColor = {
    name: 'Brand-Primary',
    tint: 1.0,
    externalReference: ''
  };

  // Create a block and apply the Brand-Primary spot color
  const { fill: primaryFill } = createColorBlock(50, 50, 150, 150);
  engine.block.setColor(primaryFill, 'fill/color/value', brandPrimary);

  // Apply Brand-Accent to another block
  const brandAccent: SpotColor = {
    name: 'Brand-Accent',
    tint: 1.0,
    externalReference: ''
  };
  const { fill: accentFill } = createColorBlock(220, 50, 150, 150);
  engine.block.setColor(accentFill, 'fill/color/value', brandAccent);

  // Use tints for lighter variations without defining new spot colors
  // Tint of 0.5 gives 50% color intensity
  const brandPrimaryHalfTint: SpotColor = {
    name: 'Brand-Primary',
    tint: 0.5,
    externalReference: ''
  };
  const { fill: tintedFill } = createColorBlock(390, 50, 150, 150, 'ellipse');
  engine.block.setColor(tintedFill, 'fill/color/value', brandPrimaryHalfTint);

  // Create a gradient of tints
  const brandAccentLightTint: SpotColor = {
    name: 'Brand-Accent',
    tint: 0.3,
    externalReference: ''
  };
  const { fill: lightTintFill } = createColorBlock(560, 50, 150, 150);
  engine.block.setColor(lightTintFill, 'fill/color/value', brandAccentLightTint);

  // Apply spot colors to strokes and shadows
  const { block: strokeBlock, fill: strokeBlockFill } = createColorBlock(
    50,
    220,
    150,
    150
  );
  // Set fill to white
  engine.block.setColor(strokeBlockFill, 'fill/color/value', {
    r: 1.0,
    g: 1.0,
    b: 1.0,
    a: 1.0
  });

  // Enable stroke and apply spot color
  engine.block.setStrokeEnabled(strokeBlock, true);
  engine.block.setStrokeWidth(strokeBlock, 8);
  const strokeColor: SpotColor = {
    name: 'Brand-Primary',
    tint: 1.0,
    externalReference: ''
  };
  engine.block.setColor(strokeBlock, 'stroke/color', strokeColor);

  // Apply spot color to drop shadow
  const { block: shadowBlock, fill: shadowBlockFill } = createColorBlock(
    220,
    220,
    150,
    150
  );
  engine.block.setColor(shadowBlockFill, 'fill/color/value', {
    r: 0.95,
    g: 0.95,
    b: 0.95,
    a: 1.0
  });

  engine.block.setDropShadowEnabled(shadowBlock, true);
  engine.block.setDropShadowOffsetX(shadowBlock, 10);
  engine.block.setDropShadowOffsetY(shadowBlock, 10);
  engine.block.setDropShadowBlurRadiusX(shadowBlock, 15);
  engine.block.setDropShadowBlurRadiusY(shadowBlock, 15);
  const shadowColor: SpotColor = {
    name: 'Brand-Accent',
    tint: 0.8,
    externalReference: ''
  };
  engine.block.setColor(shadowBlock, 'dropShadow/color', shadowColor);

  // Query all defined spot colors
  const spotColors = engine.editor.findAllSpotColors();
  console.log('Defined spot colors:', spotColors);

  // Query RGB approximation for a spot color
  const rgbaApprox = engine.editor.getSpotColorRGBA('Brand-Primary');
  console.log('Brand-Primary RGB approximation:', rgbaApprox);

  // Query CMYK approximation for a spot color
  const cmykApprox = engine.editor.getSpotColorCMYK('Brand-Primary');
  console.log('Brand-Primary CMYK approximation:', cmykApprox);

  // Read back the color from a block and check if it's a spot color
  const retrievedColor = engine.block.getColor(primaryFill, 'fill/color/value');
  if (isSpotColor(retrievedColor)) {
    console.log(
      `Retrieved SpotColor - Name: ${retrievedColor.name}, Tint: ${retrievedColor.tint}`
    );
  }

  // Update an existing spot color's approximation
  // This changes how the color appears on screen without affecting the color name
  engine.editor.setSpotColorRGB('Brand-Accent', 0.3, 0.5, 0.9);
  console.log('Updated Brand-Accent RGB approximation');

  // Show the updated color in a new block
  const { fill: updatedFill } = createColorBlock(390, 220, 150, 150);
  const updatedAccent: SpotColor = {
    name: 'Brand-Accent',
    tint: 1.0,
    externalReference: ''
  };
  engine.block.setColor(updatedFill, 'fill/color/value', updatedAccent);

  // Define a temporary spot color
  engine.editor.setSpotColorRGB('Temporary-Color', 0.5, 0.8, 0.3);

  // Create a block using the temporary color
  const { fill: tempFill } = createColorBlock(560, 220, 150, 150);
  const tempColor: SpotColor = {
    name: 'Temporary-Color',
    tint: 1.0,
    externalReference: ''
  };
  engine.block.setColor(tempFill, 'fill/color/value', tempColor);

  // Remove the spot color definition
  // Blocks using this color will display magenta (default fallback)
  engine.editor.removeSpotColor('Temporary-Color');

  console.log('Removed Temporary-Color - block now shows magenta fallback');

  // Verify the color is no longer defined
  const remainingSpotColors = engine.editor.findAllSpotColors();
  console.log('Remaining spot colors:', remainingSpotColors);

  // Assign spot colors to cutout types for die-cutting operations
  // First define a spot color for the die line
  engine.editor.setSpotColorRGB('DieLine', 1.0, 0.0, 1.0);
  engine.editor.setSpotColorCMYK('DieLine', 0.0, 1.0, 0.0, 0.0);

  // Associate the spot color with a cutout type
  // CutoutType can be 'Solid' or 'Dashed'
  engine.editor.setSpotColorForCutoutType('Solid', 'DieLine');

  // Query the assigned spot color
  const cutoutSpotColor = engine.editor.getSpotColorForCutoutType('Solid');
  console.log('Cutout type Solid uses spot color:', cutoutSpotColor);

  // Export the design
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Export as PNG for preview
  const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
  const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
  writeFileSync(`${outputDir}/spot-colors.png`, pngBuffer);
  console.log(`\nPNG exported: ${outputDir}/spot-colors.png`);

  // Export as PDF for print (preserves spot colors)
  const pdfBlob = await engine.block.export(page, {
    mimeType: 'application/pdf'
  });
  const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
  writeFileSync(`${outputDir}/spot-colors.pdf`, pdfBuffer);
  console.log(`PDF exported: ${outputDir}/spot-colors.pdf`);

  console.log('\nSpot Colors example completed successfully!');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
