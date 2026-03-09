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
import CutoutLibraryPlugin from '@imgly/plugin-cutout-library-web';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create scene
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

    // Add cutout library plugin for UI-based cutout creation
    await cesdk.addPlugin(
      CutoutLibraryPlugin({
        ui: { locations: ['canvasMenu'] }
      })
    );

    // Add cutout library to dock as the last entry
    const cutoutAssetEntry = cesdk.ui.getAssetLibraryEntry(
      'ly.img.cutout.entry'
    );
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui
        .getComponentOrder({ in: 'ly.img.dock' })
        .filter(({ key }) => key !== 'ly.img.template'),
      {
        id: 'ly.img.assetLibrary.dock',
        label: 'Cutouts',
        key: 'ly.img.assetLibrary.dock',
        icon: cutoutAssetEntry?.icon,
        entries: ['ly.img.cutout.entry']
      }
    ]);

    // Open cutout library panel on startup
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.cutout.entry']
      }
    });

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];


    // Create a circular cutout from SVG path (scaled up for visibility)
    const circle = engine.block.createCutoutFromPath(
      'M 0,75 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0 Z'
    );
    engine.block.appendChild(page, circle);
    engine.block.setPositionX(circle, 200);
    engine.block.setPositionY(circle, 225);

    // Set cutout type to Dashed for perforated cut line
    engine.block.setEnum(circle, 'cutout/type', 'Dashed');

    // Set cutout offset distance from source path
    engine.block.setFloat(circle, 'cutout/offset', 5.0);

    // Create a square cutout with solid type (scaled up for visibility)
    const square = engine.block.createCutoutFromPath('M 0,0 H 150 V 150 H 0 Z');
    engine.block.appendChild(page, square);
    engine.block.setPositionX(square, 450);
    engine.block.setPositionY(square, 225);
    engine.block.setFloat(square, 'cutout/offset', 8.0);

    // Combine cutouts using Union operation
    const combined = engine.block.createCutoutFromOperation(
      [circle, square],
      'Union'
    );
    engine.block.appendChild(page, combined);
    engine.block.setPositionX(combined, 200);
    engine.block.setPositionY(combined, 225);

    // Destroy original cutouts to avoid duplicate cuts
    engine.block.destroy(circle);
    engine.block.destroy(square);

    // Customize spot color RGB for rendering (bright blue for visibility)
    engine.editor.setSpotColorRGB('CutContour', 0.0, 0.4, 0.9);

    // Zoom to fit all cutouts
    await engine.scene.zoomToBlock(page, { padding: 40 });
  }
}

export default Example;
