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
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');
    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Setup thumbnail export functionality
    await this.setupThumbnailActions(cesdk, page);
  }

  private async setupThumbnailActions(
    cesdk: CreativeEditorSDK,
    page: number
  ): Promise<void> {
    const engine = cesdk.engine;

    // Add thumbnail export buttons to navigation bar
    cesdk.ui.insertNavigationBarOrderComponent('last', {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-thumbnail-small',
          label: 'Small Thumbnail',
          icon: '@imgly/Save',
          onClick: async () => {
            const blob = await engine.block.export(page, {
              mimeType: 'image/jpeg',
              targetWidth: 150,
              targetHeight: 150,
              jpegQuality: 0.8
            });

            await cesdk.utils.downloadFile(blob, 'image/jpeg');
            console.log(
              `✓ Small thumbnail: ${(blob.size / 1024).toFixed(1)} KB`
            );
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-thumbnail-medium',
          label: 'Medium Thumbnail',
          icon: '@imgly/Save',
          onClick: async () => {
            const blob = await engine.block.export(page, {
              mimeType: 'image/jpeg',
              targetWidth: 400,
              targetHeight: 300,
              jpegQuality: 0.85
            });

            await cesdk.utils.downloadFile(blob, 'image/jpeg');
            console.log(
              `✓ Medium thumbnail: ${(blob.size / 1024).toFixed(1)} KB`
            );
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-thumbnail-png',
          label: 'PNG Thumbnail',
          icon: '@imgly/Save',
          onClick: async () => {
            const blob = await engine.block.export(page, {
              mimeType: 'image/png',
              targetWidth: 400,
              targetHeight: 300,
              pngCompressionLevel: 6
            });

            await cesdk.utils.downloadFile(blob, 'image/png');
            console.log(`✓ PNG thumbnail: ${(blob.size / 1024).toFixed(1)} KB`);
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-thumbnail-webp',
          label: 'WebP Thumbnail',
          icon: '@imgly/Save',
          onClick: async () => {
            const blob = await engine.block.export(page, {
              mimeType: 'image/webp',
              targetWidth: 400,
              targetHeight: 300,
              webpQuality: 0.8
            });

            await cesdk.utils.downloadFile(blob, 'image/webp');
            console.log(
              `✓ WebP thumbnail: ${(blob.size / 1024).toFixed(1)} KB`
            );
          }
        }
      ]
    });
  }
}

export default Example;
