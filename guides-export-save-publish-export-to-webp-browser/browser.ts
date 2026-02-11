import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
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
