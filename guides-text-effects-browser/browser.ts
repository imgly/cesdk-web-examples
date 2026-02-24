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
 * CE.SDK Plugin: Text Effects Guide
 *
 * Demonstrates applying visual effects to text blocks:
 * - Drop shadows for depth
 * - Outline effect for text borders
 * - Glow effect for luminous aura
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
      page: { width: 800, height: 500, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];


    // Create a text block with drop shadow
    const shadowText = engine.block.create('//ly.img.ubq/text');
    engine.block.replaceText(shadowText, 'Drop Shadow');
    engine.block.setTextFontSize(shadowText, 90);
    engine.block.setWidthMode(shadowText, 'Auto');
    engine.block.setHeightMode(shadowText, 'Auto');
    engine.block.setPositionX(shadowText, 50);
    engine.block.setPositionY(shadowText, 50);
    engine.block.appendChild(page, shadowText);

    // Enable and configure drop shadow
    engine.block.setDropShadowEnabled(shadowText, true);
    engine.block.setDropShadowColor(shadowText, {
      r: 0,
      g: 0,
      b: 0,
      a: 0.6
    });
    engine.block.setDropShadowOffsetX(shadowText, 5);
    engine.block.setDropShadowOffsetY(shadowText, 5);
    engine.block.setDropShadowBlurRadiusX(shadowText, 10);
    engine.block.setDropShadowBlurRadiusY(shadowText, 10);

    // Create a text block with stroke outline
    const outlineText = engine.block.create('//ly.img.ubq/text');
    engine.block.replaceText(outlineText, 'Outline');
    engine.block.setTextFontSize(outlineText, 90);
    engine.block.setWidthMode(outlineText, 'Auto');
    engine.block.setHeightMode(outlineText, 'Auto');
    engine.block.setPositionX(outlineText, 50);
    engine.block.setPositionY(outlineText, 180);
    engine.block.appendChild(page, outlineText);

    // Enable and configure stroke
    engine.block.setStrokeEnabled(outlineText, true);
    engine.block.setStrokeWidth(outlineText, 2);
    engine.block.setStrokeColor(outlineText, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1.0
    });
    engine.block.setStrokeStyle(outlineText, 'Solid');
    engine.block.setStrokePosition(outlineText, 'Center');

    // Select the first text block
    engine.block.select(shadowText);
  }
}

export default Example;
