import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
import { AdvancedEditorConfig } from './advanced-editor/plugin';
import packageJson from './package.json';

/**
 * Turns on equal-distance snapping and builds a row of blocks to drag into equal spacing.
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new AdvancedEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
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

    // Equal-distance snapping is off by default. Turn it on per engine instance.
    engine.editor.setSettingBool('features/equalDistanceSnappingEnabled', true);

    // The pull distance is shared with edge and center snapping. It is in
    // screen pixels, so it does not change with the zoom.
    engine.editor.setSettingFloat('positionSnappingThreshold', 4);

    // The badges and the measurement lines use the snapping guide color.
    engine.editor.setSettingColor('snappingGuideColor', {
      r: 1,
      g: 0.004,
      b: 0.361,
      a: 1
    });

    // Build a row of three blocks with unequal spacing. Drag the third one
    // to the left to see the snap and the badges.
    const page = engine.block.findByType('page')[0];
    for (const positionX of [40, 260, 620]) {
      const block = engine.block.create('graphic');
      engine.block.setShape(block, engine.block.createShape('rect'));
      engine.block.setFill(block, engine.block.createFill('color'));
      engine.block.setWidth(block, 120);
      engine.block.setHeight(block, 120);
      engine.block.setPositionX(block, positionX);
      engine.block.setPositionY(block, 240);
      engine.block.appendChild(page, block);
    }
  }
}

export default Example;
