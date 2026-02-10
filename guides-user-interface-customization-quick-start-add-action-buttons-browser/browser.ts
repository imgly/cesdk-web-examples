import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    // Add a built-in save button that integrates with the Actions API
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', after: 'ly.img.spacer' },
      { id: 'ly.img.saveScene.navigationBar' }
    );

    // Register the action handler for the save button
    cesdk.actions.register('saveScene', async () => {
      const sceneString = await cesdk.engine.scene.saveToString();
      // eslint-disable-next-line no-console
      console.log('Scene saved via Actions API! Length:', sceneString.length);
      // In production: send sceneString to your backend
      cesdk.ui.showNotification({
        message: 'Scene saved successfully!'
      });
    });

    // Add a custom action button with inline onClick handler
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', after: 'ly.img.saveScene.navigationBar' },
      {
        id: 'ly.img.action.navigationBar',
        key: 'my-custom-action',
        label: 'Custom',
        icon: '@imgly/Settings',
        onClick: async () => {
          // eslint-disable-next-line no-console
          console.log('Custom action clicked!');
          // Your custom logic here
        }
      }
    );

    // Add an Export button with accent styling
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', after: 'ly.img.saveScene.navigationBar' },
      {
        id: 'ly.img.action.navigationBar',
        key: 'my-export',
        label: 'Export',
        icon: '@imgly/Download',
        color: 'accent',
        onClick: async () => {
          // Export to PNG using the utils API
          const { blobs } = await cesdk.utils.export({ mimeType: 'image/png' });
          // eslint-disable-next-line no-console
          console.log('Exported PNG! Size:', blobs[0].size);
          // In production: download or upload the blob
        }
      }
    );

    // Create a dropdown menu with multiple export options
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar' },
      {
        id: 'ly.img.actions.navigationBar',
        label: 'Download',
        icon: '@imgly/Download',
        children: [
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-png',
            label: 'Download as PNG',
            onClick: async () => {
              const { blobs } = await cesdk.utils.export({
                mimeType: 'image/png'
              });
              downloadBlob(blobs[0], 'design.png');
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-jpeg',
            label: 'Download as JPEG',
            onClick: async () => {
              const { blobs } = await cesdk.utils.export({
                mimeType: 'image/jpeg'
              });
              downloadBlob(blobs[0], 'design.jpg');
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-pdf',
            label: 'Download as PDF',
            onClick: async () => {
              const { blobs } = await cesdk.utils.export({
                mimeType: 'application/pdf'
              });
              downloadBlob(blobs[0], 'design.pdf');
            }
          }
        ]
      }
    );

    // Insert multiple buttons at once with a separator between them
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', before: 'ly.img.actions.navigationBar' },
      [
        {
          id: 'ly.img.action.navigationBar',
          key: 'share',
          label: 'Share',
          icon: '@imgly/Share',
          onClick: () => {
            // eslint-disable-next-line no-console
            console.log('Share clicked!');
          }
        },
        'ly.img.separator',
        {
          id: 'ly.img.action.navigationBar',
          key: 'print',
          label: 'Print',
          icon: '@imgly/Print',
          onClick: () => {
            window.print();
          }
        }
      ]
    );

    // Use the Utils API for export with built-in loading dialog
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', before: 'ly.img.actions.navigationBar' },
      {
        id: 'ly.img.action.navigationBar',
        key: 'utils-export',
        label: 'Quick Export',
        icon: '@imgly/Download',
        color: 'accent',
        onClick: async () => {
          // cesdk.utils.export() shows a loading dialog automatically
          const { blobs } = await cesdk.utils.export({ mimeType: 'image/png' });
          // Download the exported file to user's device
          await cesdk.utils.downloadFile(blobs[0], 'image/png');
        }
      }
    );

    // eslint-disable-next-line no-console
    console.log('Add Action Buttons example loaded successfully');
  }
}

// Helper function to download a blob as a file
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default Example;
