import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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

/**
 * CE.SDK Plugin: Supported Filters and Effects Reference
 *
 * Demonstrates how to check effect support and add effects to blocks:
 * - Checking if a block supports effects
 * - Creating and appending effects
 * - Configuring effect properties
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

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];


    // Enable effects and filters in the inspector panel
    cesdk.feature.enable('ly.img.effect');
    cesdk.feature.enable('ly.img.filter');

    // Create a beautiful gradient background
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.02, g: 0.02, b: 0.08, a: 1.0 }, stop: 0 }, // Near black
      { color: { r: 0.04, g: 0.06, b: 0.18, a: 1.0 }, stop: 0.4 }, // Dark navy
      { color: { r: 0.08, g: 0.12, b: 0.28, a: 1.0 }, stop: 0.7 }, // Deep blue
      { color: { r: 0.1, g: 0.15, b: 0.35, a: 1.0 }, stop: 1 } // Dark blue
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Define font for text
    const fontUri =
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Bold.ttf';
    const typeface = {
      name: 'Roboto',
      fonts: [
        {
          uri: fontUri,
          subFamily: 'Bold',
          weight: 'bold' as const,
          style: 'normal' as const
        }
      ]
    };

    // Create title text: "Supported Filters and Effects" at 80pt (centered)
    const titleText = engine.block.create('text');
    engine.block.appendChild(page, titleText);
    engine.block.replaceText(titleText, 'Supported Filters and Effects');
    engine.block.setFont(titleText, fontUri, typeface);
    engine.block.setTextFontSize(titleText, 80);
    engine.block.setTextColor(titleText, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleText, 780);
    engine.block.setWidthMode(titleText, 'Absolute');
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.setPositionX(titleText, 10);
    engine.block.setPositionY(titleText, 160);

    // Create subtext: "img.ly" at 64pt (closer to title)
    const subtitleText = engine.block.create('text');
    engine.block.appendChild(page, subtitleText);
    engine.block.replaceText(subtitleText, 'img.ly');
    engine.block.setFont(subtitleText, fontUri, typeface);
    engine.block.setTextFontSize(subtitleText, 64);
    engine.block.setTextColor(subtitleText, {
      r: 0.75,
      g: 0.82,
      b: 1.0,
      a: 0.85
    });
    engine.block.setEnum(subtitleText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(subtitleText, 780);
    engine.block.setWidthMode(subtitleText, 'Absolute');
    engine.block.setHeightMode(subtitleText, 'Auto');
    engine.block.setPositionX(subtitleText, 10);
    engine.block.setPositionY(subtitleText, 210);

    // Check if a block supports effects before applying them
    // Not all block types support effects - verify first to avoid errors

    // Add an image to demonstrate effects (centered below text)
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: 300, height: 210 }
    });
    engine.block.appendChild(page, imageBlock);

    // Center the image below the subtext
    engine.block.setPositionX(imageBlock, (800 - 300) / 2); // 250
    engine.block.setPositionY(imageBlock, 310);

    // Image blocks support effects
    const imageSupportsEffects = engine.block.supportsEffects(imageBlock);
    console.log('Image supports effects:', imageSupportsEffects); // true

    // Create an effect using the effect type identifier
    // CE.SDK provides 22 built-in effect types (see property tables below)
    const duotoneEffect = engine.block.createEffect('duotone_filter');

    // Append the effect to the image's effect stack
    engine.block.appendEffect(imageBlock, duotoneEffect);

    // Configure effect properties using the property path format:
    // effect/{effect-type}/{property-name}
    // Set duotone colors to match the dark blue gradient background
    engine.block.setColor(duotoneEffect, 'effect/duotone_filter/darkColor', {
      r: 0.02,
      g: 0.04,
      b: 0.12,
      a: 1.0
    }); // Near black blue
    engine.block.setColor(duotoneEffect, 'effect/duotone_filter/lightColor', {
      r: 0.5,
      g: 0.7,
      b: 1.0,
      a: 1.0
    }); // Light blue
    engine.block.setFloat(
      duotoneEffect,
      'effect/duotone_filter/intensity',
      0.8
    );

    // Retrieve all effects applied to a block
    const appliedEffects = engine.block.getEffects(imageBlock);
    console.log('Number of applied effects:', appliedEffects.length);

    // Log each effect's type
    appliedEffects.forEach((effect, index) => {
      const effectType = engine.block.getType(effect);
      console.log(`Effect ${index}: ${effectType}`);
    });

    // Select the image to show effects in inspector
    engine.block.select(imageBlock);

    console.log(
      'Support guide initialized. Select the image to see effects in the inspector.'
    );
  }
}

export default Example;
