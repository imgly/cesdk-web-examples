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

class Example implements EditorPlugin {
  name = 'guides-outlines-stroke-browser';
  version = '1.0.0';

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
    const page = engine.block.findByType('page')[0]!;


    // Create a graphic block with a rectangle shape
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.appendChild(page, block);

    // Position and size the block
    engine.block.setPositionX(block, 200);
    engine.block.setPositionY(block, 150);
    engine.block.setWidth(block, 400);
    engine.block.setHeight(block, 300);

    // Add a fill so the shape is visible
    const solidFill = engine.block.createFill('color');
    engine.block.setFill(block, solidFill);
    engine.block.setColor(solidFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Check if block supports strokes
    const canHaveStroke = engine.block.supportsStroke(block);
    console.log('Block supports stroke:', canHaveStroke);

    if (canHaveStroke) {
      // Enable stroke on the block
      engine.block.setStrokeEnabled(block, true);
      const strokeIsEnabled = engine.block.isStrokeEnabled(block);
      console.log('Stroke enabled:', strokeIsEnabled);

      // Set stroke color to blue
      engine.block.setStrokeColor(block, { r: 0.0, g: 0.4, b: 0.9, a: 1.0 });
      const strokeColor = engine.block.getStrokeColor(block);
      console.log('Stroke color:', strokeColor);

      // Set stroke width
      engine.block.setStrokeWidth(block, 8);
      const strokeWidth = engine.block.getStrokeWidth(block);
      console.log('Stroke width:', strokeWidth);

      // Apply a dashed stroke style
      engine.block.setStrokeStyle(block, 'Dashed');
      const strokeStyle = engine.block.getStrokeStyle(block);
      console.log('Stroke style:', strokeStyle);

      // Set stroke position to outer
      engine.block.setStrokePosition(block, 'Outer');
      const strokePosition = engine.block.getStrokePosition(block);
      console.log('Stroke position:', strokePosition);

      // Set corner geometry to round
      engine.block.setStrokeCornerGeometry(block, 'Round');
      const strokeCornerGeometry = engine.block.getStrokeCornerGeometry(block);
      console.log('Stroke corner geometry:', strokeCornerGeometry);
    }

    // Select the block to show it in the inspector
    engine.block.select(block);
  }
}

export default Example;
