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

    await engine.scene.zoomToBlock(page);

    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          onClick: async () => {
            const currentPage = engine.scene.getCurrentPage()!;
            const blob = await engine.block.export(currentPage, {
              mimeType: 'image/png'
            });
            const base64 = await this.blobToBase64(blob);
            await cesdk.utils.downloadFile(blob, 'image/png');
            cesdk.ui.showNotification({
              message: `Base64: ${(base64.length / 1024).toFixed(0)} KB`,
              type: 'success'
            });
          },
          key: 'export-base64',
          label: 'To Base64',
          icon: '@imgly/Save'
        }
      ]
    });

    cesdk.actions.register('exportDesign', async () => {
      const currentPage = engine.scene.getCurrentPage()!;
      const blob = await engine.block.export(currentPage, {
        mimeType: 'image/png'
      });
      const base64 = await this.blobToBase64(blob);
      await cesdk.utils.downloadFile(blob, 'image/png');
    });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }
}

export default Example;
