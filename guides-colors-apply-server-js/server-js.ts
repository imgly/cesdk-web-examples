import CreativeEngine, { RGBAColor } from '@cesdk/node';
import * as fs from 'fs';

async function main() {
  const engine = await CreativeEngine.init({
    // license: 'YOUR_CESDK_LICENSE_KEY'
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Create a graphic block to apply colors to
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setFill(block, engine.block.createFill('color'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 100);
    engine.block.setPositionY(block, 100);
    engine.block.appendChild(page, block);

    // Create RGB color (values 0.0-1.0)
    const rgbaBlue: RGBAColor = { r: 0.0, g: 0.0, b: 1.0, a: 1.0 };

    // Create CMYK color (cyan, magenta, yellow, black, tint)
    const cmykRed = { c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 1.0 };

    // Create spot color reference
    const spotPink = {
      name: 'Pink-Flamingo',
      tint: 1.0,
      externalReference: 'Pantone'
    };

    // Define spot colors with screen preview approximations
    engine.editor.setSpotColorRGB('Pink-Flamingo', 1.0, 0.41, 0.71);
    engine.editor.setSpotColorCMYK('Corporate-Blue', 1.0, 0.5, 0.0, 0.2);

    // Apply RGB color to fill
    const fill = engine.block.getFill(block);
    engine.block.setColor(fill, 'fill/color/value', rgbaBlue);

    // Read the current fill color
    const currentFillColor = engine.block.getColor(fill, 'fill/color/value');
    console.log('Current fill color:', currentFillColor);

    // Enable and apply stroke color
    engine.block.setStrokeEnabled(block, true);
    engine.block.setStrokeWidth(block, 8);
    engine.block.setColor(block, 'stroke/color', cmykRed);

    // Enable and apply drop shadow color
    engine.block.setDropShadowEnabled(block, true);
    engine.block.setDropShadowOffsetX(block, 10);
    engine.block.setDropShadowOffsetY(block, 10);
    engine.block.setColor(block, 'dropShadow/color', spotPink);

    // Convert colors between color spaces
    const cmykFromRgb = engine.editor.convertColorToColorSpace(
      rgbaBlue,
      'CMYK'
    );
    console.log('CMYK from RGB:', cmykFromRgb);

    const rgbFromCmyk = engine.editor.convertColorToColorSpace(cmykRed, 'sRGB');
    console.log('RGB from CMYK:', rgbFromCmyk);

    // List all defined spot colors
    const allSpotColors = engine.editor.findAllSpotColors();
    console.log('Defined spot colors:', allSpotColors);

    // Update a spot color definition
    engine.editor.setSpotColorRGB('Pink-Flamingo', 1.0, 0.6, 0.8);
    console.log('Updated Pink-Flamingo spot color');

    // Remove a spot color definition (falls back to magenta)
    engine.editor.removeSpotColor('Corporate-Blue');
    console.log('Removed Corporate-Blue spot color');

    // Export the scene with applied colors
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync('output.png', buffer);
    console.log('Exported scene to output.png');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
