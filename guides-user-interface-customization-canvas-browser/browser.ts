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
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    // Enable the settings feature so the settings button can be displayed.
    cesdk.feature.enable('ly.img.settings');

    // Hide the canvas bar
    cesdk.feature.disable('ly.img.canvas.bar');

    // Show the canvas bar (default)
    cesdk.feature.enable('ly.img.canvas.bar');

    // Configure the top position with settings and add page
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'top' }, [
      'ly.img.settings.canvasBar',
      'ly.img.separator',
      'ly.img.page.add.canvasBar'
    ]);

    // Configure the bottom position independently
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'bottom' }, [
      'ly.img.spacer',
      'ly.img.page.add.canvasBar'
    ]);

    // Show only the settings button at the bottom while editing text.
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.canvas.bar', at: 'bottom', when: { editMode: 'Text' } },
      ['ly.img.settings.canvasBar']
    );

    // Use spacers and separators to control layout
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'bottom' }, [
      'ly.img.settings.canvasBar',
      'ly.img.separator',
      'ly.img.spacer',
      'ly.img.page.add.canvasBar',
      'ly.img.spacer'
    ]);

    // Retrieve and log the current canvas bar order for each position
    const topOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.bar',
      at: 'top'
    });
    console.log('Current top canvas bar order:', topOrder);

    const bottomOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.bar',
      at: 'bottom'
    });
    console.log('Current bottom canvas bar order:', bottomOrder);
  }
}

export default Example;
