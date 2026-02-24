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
 * CE.SDK Plugin: Export to WebP Guide
 *
 * Demonstrates exporting designs to WebP format with:
 * - Built-in export action triggered programmatically
 * - Three export buttons showcasing different quality presets
 * - Lossy, lossless, and social media export options
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required');
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

    // Load template and zoom to fit
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');

    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Three export buttons with different WebP settings
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'webp-lossy',
          label: 'Lossy',
          icon: '@imgly/Download',
          onClick: async () => {
            const p = engine.scene.getCurrentPage()!;
            // Export with lossy compression
            const blob = await engine.block.export(p, {
              mimeType: 'image/webp',
              webpQuality: 0.8
            });
            // Download using CE.SDK utils
            await cesdk.utils.downloadFile(blob, 'image/webp');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'webp-lossless',
          label: 'Lossless',
          icon: '@imgly/Download',
          onClick: async () => {
            const p = engine.scene.getCurrentPage()!;
            const blob = await engine.block.export(p, {
              mimeType: 'image/webp',
              webpQuality: 1.0
            });
            await cesdk.utils.downloadFile(blob, 'image/webp');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'webp-social',
          label: 'Social',
          icon: '@imgly/Download',
          onClick: async () => {
            const p = engine.scene.getCurrentPage()!;
            // Export with target dimensions for social media
            const blob = await engine.block.export(p, {
              mimeType: 'image/webp',
              webpQuality: 0.9,
              targetWidth: 1200,
              targetHeight: 630
            });
            await cesdk.utils.downloadFile(blob, 'image/webp');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-action',
          label: 'Export',
          icon: '@imgly/Download',
          onClick: () => {
            // Run built-in export with WebP format
            cesdk.actions.run('exportDesign', { mimeType: 'image/webp' });
          }
        }
      ]
    });
  }
}

export default Example;
