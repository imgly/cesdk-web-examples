import type {
  EditorPlugin,
  EditorPluginContext,
  SpotColor
} from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

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

/**
 * CE.SDK Plugin: Spot Colors Guide
 *
 * This example demonstrates:
 * - Defining spot colors with RGB and CMYK approximations
 * - Applying spot colors to fills, strokes, and shadows
 * - Using tints for lighter color variations
 * - Querying and updating spot color definitions
 * - Removing spot colors and handling the magenta fallback
 * - Assigning spot colors to cutout types
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());


    // Create a design scene using CE.SDK convenience method
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

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
    engine.block.setColor(
      lightTintFill,
      'fill/color/value',
      brandAccentLightTint
    );

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
    // eslint-disable-next-line no-console
    console.log('Defined spot colors:', spotColors);

    // Query RGB approximation for a spot color
    const rgbaApprox = engine.editor.getSpotColorRGBA('Brand-Primary');
    // eslint-disable-next-line no-console
    console.log('Brand-Primary RGB approximation:', rgbaApprox);

    // Query CMYK approximation for a spot color
    const cmykApprox = engine.editor.getSpotColorCMYK('Brand-Primary');
    // eslint-disable-next-line no-console
    console.log('Brand-Primary CMYK approximation:', cmykApprox);

    // Read back the color from a block and check if it's a spot color
    const retrievedColor = engine.block.getColor(
      primaryFill,
      'fill/color/value'
    );
    if (isSpotColor(retrievedColor)) {
      // eslint-disable-next-line no-console
      console.log(
        `Retrieved SpotColor - Name: ${retrievedColor.name}, Tint: ${retrievedColor.tint}`
      );
    }

    // Update an existing spot color's approximation
    // This changes how the color appears on screen without affecting the color name
    engine.editor.setSpotColorRGB('Brand-Accent', 0.3, 0.5, 0.9);
    // eslint-disable-next-line no-console
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

    // eslint-disable-next-line no-console
    console.log('Removed Temporary-Color - block now shows magenta fallback');

    // Verify the color is no longer defined
    const remainingSpotColors = engine.editor.findAllSpotColors();
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log('Cutout type Solid uses spot color:', cutoutSpotColor);

    // Create a legend block with text
    const textBlock = engine.block.create('text');
    engine.block.replaceText(textBlock, 'Spot Colors Demo');
    engine.block.setTextFontSize(textBlock, 36);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setPositionX(textBlock, 50);
    engine.block.setPositionY(textBlock, 400);
    engine.block.appendChild(page, textBlock);

    // Create smaller label texts
    const labels = [
      { text: 'Brand-Primary', x: 50, y: 205 },
      { text: 'Brand-Accent', x: 220, y: 205 },
      { text: 'Primary 50%', x: 390, y: 205 },
      { text: 'Accent 30%', x: 560, y: 205 },
      { text: 'Stroke', x: 50, y: 375 },
      { text: 'Shadow', x: 220, y: 375 },
      { text: 'Updated', x: 390, y: 375 },
      { text: 'Removed', x: 560, y: 375 }
    ];

    for (const label of labels) {
      const labelBlock = engine.block.create('text');
      engine.block.replaceText(labelBlock, label.text);
      engine.block.setTextFontSize(labelBlock, 14);
      engine.block.setWidthMode(labelBlock, 'Auto');
      engine.block.setHeightMode(labelBlock, 'Auto');
      engine.block.setPositionX(labelBlock, label.x);
      engine.block.setPositionY(labelBlock, label.y);
      engine.block.appendChild(page, labelBlock);
    }

    // Zoom to fit all content
    await engine.scene.zoomToBlock(page, {
      padding: {
        left: 40,
        top: 40,
        right: 40,
        bottom: 40
      }
    });
  }
}

export default Example;
