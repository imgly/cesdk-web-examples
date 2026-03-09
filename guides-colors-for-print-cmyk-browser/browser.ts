import type {
  CMYKColor,
  EditorPlugin,
  EditorPluginContext,
  RGBAColor
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

/**
 * CE.SDK Plugin: CMYK Colors Guide
 *
 * This example demonstrates:
 * - Creating CMYK color values for print workflows
 * - Applying CMYK colors to fills, strokes, and shadows
 * - Using the tint property for color intensity control
 * - Converting between RGB and CMYK color spaces
 * - Checking color types with type guards
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

    // Set page background to light gray for visibility (using CMYK)
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
    const cmykMagenta: CMYKColor = {
      c: 0.0,
      m: 1.0,
      y: 0.0,
      k: 0.0,
      tint: 1.0
    };
    const cmykYellow: CMYKColor = { c: 0.0, m: 0.0, y: 1.0, k: 0.0, tint: 1.0 };
    const cmykBlack: CMYKColor = { c: 0.0, m: 0.0, y: 0.0, k: 1.0, tint: 1.0 };

    // Example 1: Apply CMYK Cyan to a fill
    const { fill: cyanFill } = createColorBlock(50, 50, 150, 150);
    engine.block.setColor(cyanFill, 'fill/color/value', cmykCyan);

    // Example 2: Apply CMYK Magenta to a fill
    const { fill: magentaFill } = createColorBlock(220, 50, 150, 150);
    engine.block.setColor(magentaFill, 'fill/color/value', cmykMagenta);

    // Example 3: Apply CMYK Yellow to a fill
    const { fill: yellowFill } = createColorBlock(390, 50, 150, 150);
    engine.block.setColor(yellowFill, 'fill/color/value', cmykYellow);

    // Example 4: Apply CMYK Black to a fill
    const { fill: blackFill } = createColorBlock(560, 50, 150, 150);
    engine.block.setColor(blackFill, 'fill/color/value', cmykBlack);

    // Example 5: Use tint for partial color intensity
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

    // Example 6: Apply CMYK color to stroke
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

    // Example 7: Apply CMYK color to drop shadow
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

    // Example 8: Read CMYK color from a block
    const { fill: readFill } = createColorBlock(560, 220, 150, 150, 'ellipse');
    const cmykOrange: CMYKColor = { c: 0.0, m: 0.5, y: 1.0, k: 0.0, tint: 1.0 };
    engine.block.setColor(readFill, 'fill/color/value', cmykOrange);

    // Retrieve and check the color
    const retrievedColor = engine.block.getColor(readFill, 'fill/color/value');
    if (isCMYKColor(retrievedColor)) {
      // eslint-disable-next-line no-console
      console.log(
        `CMYK Color - C: ${retrievedColor.c}, M: ${retrievedColor.m}, Y: ${retrievedColor.y}, K: ${retrievedColor.k}, Tint: ${retrievedColor.tint}`
      );
    }

    // Example 9: Convert RGB to CMYK
    const rgbBlue: RGBAColor = { r: 0.2, g: 0.4, b: 0.9, a: 1.0 };
    const convertedCmyk = engine.editor.convertColorToColorSpace(
      rgbBlue,
      'CMYK'
    );
    const { fill: convertedFill } = createColorBlock(50, 390, 150, 150);
    engine.block.setColor(convertedFill, 'fill/color/value', convertedCmyk);
    // eslint-disable-next-line no-console
    console.log('RGB to CMYK conversion:', convertedCmyk);

    // Example 10: Convert CMYK to RGB (for demonstration)
    const cmykGreen: CMYKColor = { c: 0.7, m: 0.0, y: 1.0, k: 0.2, tint: 1.0 };
    const convertedRgb = engine.editor.convertColorToColorSpace(
      cmykGreen,
      'sRGB'
    );
    // eslint-disable-next-line no-console
    console.log('CMYK to RGB conversion:', convertedRgb);
    // Display using original CMYK color
    const { fill: previewFill } = createColorBlock(220, 390, 150, 150);
    engine.block.setColor(previewFill, 'fill/color/value', cmykGreen);

    // Example 11: Use CMYK colors in gradients
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
