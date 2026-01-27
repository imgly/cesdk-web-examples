import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) throw new Error('CE.SDK instance is required');

    const engine = cesdk.engine;

    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage()!;

    await engine.scene.zoomToBlock(page);

    cesdk.ui.insertNavigationBarOrderComponent('last', {
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
