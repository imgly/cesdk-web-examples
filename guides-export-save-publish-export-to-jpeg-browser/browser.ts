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

    // Zoom to fit page in view
    await engine.scene.zoomToBlock(page);

    cesdk.ui.insertNavigationBarOrderComponent('last', {
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
