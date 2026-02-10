import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');
    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Setup export functionality
    await this.setupExportActions(cesdk, page);
  }

  private async setupExportActions(
    cesdk: CreativeEditorSDK,
    page: number
  ): Promise<void> {
    const engine = cesdk.engine;

    // Add export button to navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-design',
          label: 'Export PNG',
          icon: '@imgly/Save',
          onClick: async () => {
            const blob = await engine.block.export(page, {
              mimeType: 'image/png'
            });

            await cesdk.utils.downloadFile(blob, 'image/png');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-design',
          label: 'Export PNG (default)',
          icon: '@imgly/Save',
          onClick: () => cesdk.actions.run('exportDesign')
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-design',
          label: 'Export PNG (compressed)',
          icon: '@imgly/Save',
          onClick: async () => {
            // Export with compression
            const compressedBlob = await engine.block.export(page, {
              mimeType: 'image/png',
              pngCompressionLevel: 9
            });

            await cesdk.utils.downloadFile(compressedBlob, 'image/png');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-design',
          label: 'Export PNG (hd)',
          icon: '@imgly/Save',
          onClick: async () => {
            const hdBlob = await engine.block.export(page, {
              mimeType: 'image/png',
              targetWidth: 1920,
              targetHeight: 1080
            });

            await cesdk.utils.downloadFile(hdBlob, 'image/png');
          }
        }
      ]
    });
  }
}

export default Example;
