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
import { AdvancedEditorConfig } from './advanced-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Grid & Rulers Guide
 *
 * Demonstrates how to configure grid overlay, snap-to-grid,
 * and canvas rulers for precise element alignment.
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

    // Show the grid overlay on the canvas
    engine.editor.setSettingBool('grid/enabled', true);

    // Enable snapping so elements align to grid lines
    engine.editor.setSettingBool('grid/snapEnabled', true);

    // Set horizontal and vertical grid spacing in design units
    engine.editor.setSettingFloat('grid/spacingX', 20);
    engine.editor.setSettingFloat('grid/spacingY', 20);

    // Set a custom grid color with transparency
    engine.editor.setSettingColor('grid/color', {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 0.3
    });

    // Rulers are controlled through the editor's UI store.
    // The AdvancedEditorConfig plugin enables the 'ly.img.rulers'
    // feature flag, which makes rulers available in the UI.
    // Rulers are visible by default when the feature flag is enabled.

    // Add a sample block so the grid and rulers are visible in context
    const page = engine.block.findByType('page')[0];
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setFill(block, engine.block.createFill('color'));
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 150);
    engine.block.setPositionX(block, 100);
    engine.block.setPositionY(block, 100);
    engine.block.appendChild(page, block);

    console.log('Grid & Rulers guide initialized.');
  }
}

export default Example;
