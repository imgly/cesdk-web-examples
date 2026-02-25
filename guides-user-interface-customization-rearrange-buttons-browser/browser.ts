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

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Get the current navigation bar order
    const currentOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' });
    console.log('Current navigation bar order:', currentOrder);

    // Set a custom navigation bar with fewer buttons
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.zoom.navigationBar',
      'ly.img.actions.navigationBar',
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.back.navigationBar'
    ]);

    // Remove flip options from the canvas menu
    cesdk.ui.removeOrderComponent({ in: 'ly.img.canvas.menu', match: 'ly.img.flipX.canvasMenu' });
    cesdk.ui.removeOrderComponent({ in: 'ly.img.canvas.menu', match: 'ly.img.flipY.canvasMenu' });

    // Configure a custom dock with asset library buttons
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock', when: { editMode: 'Text' } }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'shapes',
        label: 'Shapes',
        icon: '@imgly/Shapes',
        entries: ['ly.img.vectorpath']
      },
      'ly.img.separator',
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'images',
        label: 'Images',
        icon: '@imgly/Image',
        entries: ['ly.img.image']
      },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'text',
        label: 'Text',
        icon: '@imgly/Text',
        entries: ['ly.img.text']
      }
    ]);

    // Insert a separator before the export actions button
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', before: 'ly.img.actions.navigationBar' }, 'ly.img.separator');

    // Update a component's properties without changing its position
    cesdk.ui.updateOrderComponent({ in: 'ly.img.dock', match: { id: 'ly.img.assetLibrary.dock' }, key: 'images' },
      { label: 'Photos' });

    // Set a different canvas menu order for Text edit mode
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, [
        'ly.img.text.bold.canvasMenu',
        'ly.img.text.italic.canvasMenu',
        'ly.img.separator',
        'ly.img.copy.canvasMenu',
        'ly.img.paste.canvasMenu',
        'ly.img.delete.canvasMenu'
      ]);
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

    await cesdk.actions.run('scene.create', { page: { sourceId: 'ly.img.page.presets', assetId: 'ly.img.page.presets.print.iso.a6.landscape' } });

    console.log('Rearrange buttons example loaded successfully!');
  }
}

export default Example;
