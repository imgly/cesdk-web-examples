import type { EditorPlugin, EditorPluginContext, RGBAColor } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Apply Colors Guide
 *
 * Demonstrates how to apply solid colors to design elements:
 * - Creating color objects in RGB, CMYK, and spot color spaces
 * - Applying colors to fill, stroke, and shadow properties
 * - Defining and managing spot colors
 * - Converting colors between color spaces
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

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
    engine.block.setStrokeWidth(block, 4);
    engine.block.setColor(block, 'stroke/color', cmykRed);

    // Enable and apply drop shadow color
    engine.block.setDropShadowEnabled(block, true);
    engine.block.setDropShadowOffsetX(block, 5);
    engine.block.setDropShadowOffsetY(block, 5);
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

    // Select the block to show in the editor
    engine.block.select(block);

    console.log('Apply colors guide initialized.');
  }
}

export default Example;
