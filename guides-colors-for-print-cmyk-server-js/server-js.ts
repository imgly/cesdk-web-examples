import CreativeEngine from '@cesdk/node';
import type { CMYKColor, RGBAColor } from '@cesdk/node';

// Type guard to check if a color is CMYK
// Color can be RGBAColor, CMYKColor, or SpotColor
const isCMYKColor = (color: unknown): color is CMYKColor => {
  return (
    typeof color === 'object' &&
    color !== null &&
    'c' in color &&
    'm' in color &&
    'y' in color &&
    'k' in color
  );
};
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: CMYK Colors
 *
 * This example demonstrates:
 * - Creating CMYK color values for print workflows
 * - Applying CMYK colors to fills, strokes, and shadows
 * - Using the tint property for color intensity control
 * - Converting between RGB and CMYK color spaces
 * - Checking color types with type guards
 * - Exporting designs with CMYK colors for print
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

  // Set page background to light gray (using CMYK)
  const pageFill = engine.block.getFill(page);
  engine.block.setColor(pageFill, 'fill/color/value', {
    c: 0.0,
    m: 0.0,
    y: 0.0,
    k: 0.04,
    tint: 1.0
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

  // Create CMYK color objects for print production
  // CMYK values range from 0.0 to 1.0
  const cmykCyan: CMYKColor = { c: 1.0, m: 0.0, y: 0.0, k: 0.0, tint: 1.0 };
  const cmykMagenta: CMYKColor = { c: 0.0, m: 1.0, y: 0.0, k: 0.0, tint: 1.0 };
  const cmykYellow: CMYKColor = { c: 0.0, m: 0.0, y: 1.0, k: 0.0, tint: 1.0 };
  const cmykBlack: CMYKColor = { c: 0.0, m: 0.0, y: 0.0, k: 1.0, tint: 1.0 };

  // Apply CMYK colors to fills
  const { fill: cyanFill } = createColorBlock(50, 50, 150, 150);
  engine.block.setColor(cyanFill, 'fill/color/value', cmykCyan);

  // Apply remaining CMYK primary colors
  const { fill: magentaFill } = createColorBlock(220, 50, 150, 150);
  engine.block.setColor(magentaFill, 'fill/color/value', cmykMagenta);

  const { fill: yellowFill } = createColorBlock(390, 50, 150, 150);
  engine.block.setColor(yellowFill, 'fill/color/value', cmykYellow);

  const { fill: blackFill } = createColorBlock(560, 50, 150, 150);
  engine.block.setColor(blackFill, 'fill/color/value', cmykBlack);

  // Use tint for partial color intensity
  // Tint of 0.5 gives 50% color intensity
  const cmykHalfMagenta: CMYKColor = {
    c: 0.0,
    m: 1.0,
    y: 0.0,
    k: 0.0,
    tint: 0.5
  };
  const { fill: tintedFill } = createColorBlock(50, 220, 150, 150, 'ellipse');
  engine.block.setColor(tintedFill, 'fill/color/value', cmykHalfMagenta);

  // Apply CMYK color to stroke
  const { block: strokeBlock, fill: strokeBlockFill } = createColorBlock(
    220,
    220,
    150,
    150
  );
  // Set fill to white (using CMYK)
  engine.block.setColor(strokeBlockFill, 'fill/color/value', {
    c: 0.0,
    m: 0.0,
    y: 0.0,
    k: 0.0,
    tint: 1.0
  });
  // Enable stroke and set CMYK color
  engine.block.setStrokeEnabled(strokeBlock, true);
  engine.block.setStrokeWidth(strokeBlock, 8);
  const cmykStrokeColor: CMYKColor = {
    c: 0.8,
    m: 0.2,
    y: 0.0,
    k: 0.1,
    tint: 1.0
  };
  engine.block.setColor(strokeBlock, 'stroke/color', cmykStrokeColor);

  // Apply CMYK color to drop shadow
  const { block: shadowBlock, fill: shadowBlockFill } = createColorBlock(
    390,
    220,
    150,
    150
  );
  // Set fill to light gray (using CMYK)
  engine.block.setColor(shadowBlockFill, 'fill/color/value', {
    c: 0.0,
    m: 0.0,
    y: 0.0,
    k: 0.05,
    tint: 1.0
  });
  // Enable drop shadow and set CMYK color
  engine.block.setDropShadowEnabled(shadowBlock, true);
  engine.block.setDropShadowOffsetX(shadowBlock, 10);
  engine.block.setDropShadowOffsetY(shadowBlock, 10);
  engine.block.setDropShadowBlurRadiusX(shadowBlock, 15);
  engine.block.setDropShadowBlurRadiusY(shadowBlock, 15);
  const cmykShadowColor: CMYKColor = {
    c: 0.0,
    m: 0.0,
    y: 0.0,
    k: 0.6,
    tint: 0.8
  };
  engine.block.setColor(shadowBlock, 'dropShadow/color', cmykShadowColor);

  // Read CMYK color from a block and check with type guard
  const { fill: readFill } = createColorBlock(560, 220, 150, 150, 'ellipse');
  const cmykOrange: CMYKColor = { c: 0.0, m: 0.5, y: 1.0, k: 0.0, tint: 1.0 };
  engine.block.setColor(readFill, 'fill/color/value', cmykOrange);

  // Retrieve and check the color
  const retrievedColor = engine.block.getColor(readFill, 'fill/color/value');
  if (isCMYKColor(retrievedColor)) {
    console.log(
      `CMYK Color - C: ${retrievedColor.c}, M: ${retrievedColor.m}, Y: ${retrievedColor.y}, K: ${retrievedColor.k}, Tint: ${retrievedColor.tint}`
    );
  }

  // Convert RGB to CMYK
  const rgbBlue: RGBAColor = { r: 0.2, g: 0.4, b: 0.9, a: 1.0 };
  const convertedCmyk = engine.editor.convertColorToColorSpace(rgbBlue, 'CMYK');
  const { fill: convertedFill } = createColorBlock(50, 390, 150, 150);
  engine.block.setColor(convertedFill, 'fill/color/value', convertedCmyk);
  console.log('RGB to CMYK conversion:', convertedCmyk);

  // Convert CMYK to RGB (for demonstration)
  const cmykGreen: CMYKColor = { c: 0.7, m: 0.0, y: 1.0, k: 0.2, tint: 1.0 };
  const convertedRgb = engine.editor.convertColorToColorSpace(
    cmykGreen,
    'sRGB'
  );
  console.log('CMYK to RGB conversion:', convertedRgb);
  // Display using original CMYK color
  const { fill: previewFill } = createColorBlock(220, 390, 150, 150);
  engine.block.setColor(previewFill, 'fill/color/value', cmykGreen);

  // Use CMYK colors in gradients
  const gradientBlock = engine.block.create('graphic');
  const gradientShape = engine.block.createShape('rect');
  engine.block.setShape(gradientBlock, gradientShape);
  engine.block.setWidth(gradientBlock, 320);
  engine.block.setHeight(gradientBlock, 150);
  engine.block.setPositionX(gradientBlock, 390);
  engine.block.setPositionY(gradientBlock, 390);
  engine.block.appendChild(page, gradientBlock);

  const gradientFill = engine.block.createFill('gradient/linear');
  engine.block.setFill(gradientBlock, gradientFill);

  // Set gradient stops with CMYK colors
  engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
    { color: { c: 1.0, m: 0.0, y: 0.0, k: 0.0, tint: 1.0 }, stop: 0 },
    { color: { c: 0.0, m: 1.0, y: 0.0, k: 0.0, tint: 1.0 }, stop: 0.5 },
    { color: { c: 0.0, m: 0.0, y: 1.0, k: 0.0, tint: 1.0 }, stop: 1 }
  ]);

  // Export the design
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Export as PNG for preview
  const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
  const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
  writeFileSync(`${outputDir}/cmyk-colors.png`, pngBuffer);
  console.log(`\n✓ PNG exported: ${outputDir}/cmyk-colors.png`);

  // Export as PDF for print (preserves CMYK colors)
  const pdfBlob = await engine.block.export(page, {
    mimeType: 'application/pdf'
  });
  const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
  writeFileSync(`${outputDir}/cmyk-colors.pdf`, pdfBuffer);
  console.log(`✓ PDF exported: ${outputDir}/cmyk-colors.pdf`);

  console.log('\n✓ CMYK Colors example completed successfully!');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
