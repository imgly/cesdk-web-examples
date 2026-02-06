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

    cesdk.feature.enable('ly.img.video');
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.video.template/templates/milli-surf-school.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');

    await cesdk.actions.run('zoom.toPage', { autoFit: true });

    // Setup export functionality
    await this.setupExportActions(cesdk, page);
  }

  private async setupExportActions(
    cesdk: CreativeEditorSDK,
    page: number
  ): Promise<void> {
    const engine = cesdk.engine;

    // Add export buttons to navigation bar
    cesdk.ui.insertNavigationBarOrderComponent('last', {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-builtin',
          label: 'Export Video',
          icon: '@imgly/Save',
          onClick: () => {
            cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-video',
          label: 'Export MP4',
          icon: '@imgly/Save',
          onClick: async () => {
            const dialog = cesdk.utils.showLoadingDialog({
              title: 'Exporting Video',
              message: 'Encoding MP4...',
              progress: 0
            });

            try {
              const blob = await engine.block.exportVideo(page, {
                mimeType: 'video/mp4',
                onProgress: (_, encoded, total) => {
                  dialog.updateProgress({ value: encoded, max: total });
                }
              });

              dialog.close();
              await cesdk.utils.downloadFile(blob, 'video/mp4');
            } catch (error) {
              dialog.showError({ message: 'Export failed' });
              throw error;
            }
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-video-progress',
          label: 'Export (dialog)',
          icon: '@imgly/Save',
          onClick: async () => {
            const dialog = cesdk.utils.showLoadingDialog({
              title: 'Exporting Video',
              message: 'Encoding MP4...',
              progress: 0
            });

            try {
              const blob = await engine.block.exportVideo(page, {
                onProgress: (_, encoded, total) => {
                  dialog.updateProgress({ value: encoded, max: total });
                }
              });

              dialog.showSuccess({ message: 'Export complete!' });
              await cesdk.utils.downloadFile(blob, 'video/mp4');
            } catch (error) {
              dialog.showError({ message: 'Export failed' });
              throw error;
            }
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-video-hd',
          label: 'Export HD',
          icon: '@imgly/Save',
          onClick: async () => {
            const dialog = cesdk.utils.showLoadingDialog({
              title: 'Exporting HD Video',
              message: 'Encoding 1080p...',
              progress: 0
            });

            try {
              const blob = await engine.block.exportVideo(page, {
                targetWidth: 1920,
                targetHeight: 1080,
                framerate: 30,
                onProgress: (_, encoded, total) => {
                  dialog.updateProgress({ value: encoded, max: total });
                }
              });

              dialog.close();
              await cesdk.utils.downloadFile(blob, 'video/mp4');
            } catch (error) {
              dialog.showError({ message: 'Export failed' });
              throw error;
            }
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-video-quality',
          label: 'Export HQ',
          icon: '@imgly/Save',
          onClick: async () => {
            const dialog = cesdk.utils.showLoadingDialog({
              title: 'Exporting HQ Video',
              message: 'Encoding high quality...',
              progress: 0
            });

            try {
              const blob = await engine.block.exportVideo(page, {
                h264Profile: 100,
                videoBitrate: 8_000_000,
                onProgress: (_, encoded, total) => {
                  dialog.updateProgress({ value: encoded, max: total });
                }
              });

              dialog.close();
              await cesdk.utils.downloadFile(blob, 'video/mp4');
            } catch (error) {
              dialog.showError({ message: 'Export failed' });
              throw error;
            }
          }
        }
      ]
    });
  }
}

export default Example;
