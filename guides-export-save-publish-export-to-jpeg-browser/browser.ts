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
    if (!cesdk) throw new Error('CE.SDK instance is required');

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
    const page = engine.scene.getCurrentPage()!;

    // Zoom to fit page in view
    await engine.scene.zoomToBlock(page);

    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          onClick: async () => {
            await cesdk.actions.run('exportDesign', {
              mimeType: 'image/jpeg',
              jpegQuality: 0.9
            });
          },
          key: 'export-action',
          label: 'Export',
          icon: '@imgly/Download',
        },

        {
          id: 'ly.img.action.navigationBar',
          onClick: async () => {
            const currentPage = engine.scene.getCurrentPage()!;
            const exported = await engine.block.export(currentPage, {
              mimeType: 'image/jpeg',
              jpegQuality: 0.9
            });
            await cesdk.utils.downloadFile(exported, 'image/jpeg');
            cesdk.ui.showNotification({
              message: `Standard (${(exported.size / 1024).toFixed(0)} KB)`,
              type: 'success'
            });
          },
          key: 'export-standard',
          label: 'Standard',
          icon: '@imgly/Save'
        },
        {
          id: 'ly.img.action.navigationBar',
          onClick: async () => {
            const currentPage = engine.scene.getCurrentPage()!;
            const exported = await engine.block.export(currentPage, {
              mimeType: 'image/jpeg',
              jpegQuality: 1.0
            });
            await cesdk.utils.downloadFile(exported, 'image/jpeg');
            cesdk.ui.showNotification({
              message: `High Quality (${(exported.size / 1024).toFixed(0)} KB)`,
              type: 'success'
            });
          },
          key: 'export-high',
          label: 'High Quality',
          icon: '@imgly/Save'
        },
        {
          id: 'ly.img.action.navigationBar',
          onClick: async () => {
            const currentPage = engine.scene.getCurrentPage()!;
            const exported = await engine.block.export(currentPage, {
              mimeType: 'image/jpeg',
              targetWidth: 1920,
              targetHeight: 1080
            });
            await cesdk.utils.downloadFile(exported, 'image/jpeg');
            cesdk.ui.showNotification({
              message: `1920×1080 (${(exported.size / 1024).toFixed(0)} KB)`,
              type: 'success'
            });
          },
          key: 'export-hd',
          label: '1920×1080',
          icon: '@imgly/Save'
        }
      ]
    });

    cesdk.actions.register('exportDesign', async () => {
      const currentPage = engine.scene.getCurrentPage()!;
      const jpeg = await engine.block.export(currentPage, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.9
      });
      await cesdk.utils.downloadFile(jpeg, 'image/jpeg');
    });
  }
}

export default Example;
