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


    const engine = cesdk.engine;

    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');
    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Export programmatically using the engine API
    const exportProgrammatically = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png'
      });
      await cesdk.utils.downloadFile(blob, 'image/png');
    };

    // Export with compression level (0-9)
    // Higher values produce smaller files but take longer
    const exportWithCompression = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 9
      });
      await cesdk.utils.downloadFile(blob, 'image/png');
    };

    // Export with target dimensions
    // The block scales to fill the target while maintaining aspect ratio
    const exportWithDimensions = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 1920,
        targetHeight: 1080
      });
      await cesdk.utils.downloadFile(blob, 'image/png');
    };

    // Trigger the built-in export action
    const triggerExportAction = async () => {
      await cesdk.actions.run('exportDesign', {
        mimeType: 'image/png'
      });
    };

    // Override the default export action to customize behavior
    cesdk.actions.register('exportDesign', async (options) => {
      // Use the utils API to export with a loading dialog
      const { blobs, options: exportOptions } =
        await cesdk.utils.export(options);

      // Custom logic: log the export details
      console.log(
        `Exported ${blobs.length} file(s) as ${exportOptions.mimeType}`
      );

      // Download the exported file
      await cesdk.utils.downloadFile(blobs[0], exportOptions.mimeType);
    });

    // Add export dropdown to navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-png',
          label: 'Export PNG',
          icon: '@imgly/Save',
          onClick: exportProgrammatically
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-png-action',
          label: 'Export PNG (action)',
          icon: '@imgly/Save',
          onClick: triggerExportAction
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-png-compressed',
          label: 'Export PNG (compressed)',
          icon: '@imgly/Save',
          onClick: exportWithCompression
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-png-hd',
          label: 'Export PNG (HD)',
          icon: '@imgly/Save',
          onClick: exportWithDimensions
        }
      ]
    });
  }
}

export default Example;
