import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Save Designs Guide
 *
 * Demonstrates how to save and serialize designs in CE.SDK:
 * - Saving scenes to string format for database storage
 * - Saving scenes to archive format with embedded assets
 * - Using built-in save actions and customization
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
      throw new Error('CE.SDK instance is required');
    }

    const engine = cesdk.engine;

    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    const page = engine.scene.getCurrentPage();
    if (page == null) {
      throw new Error('No page found in scene');
    }
    engine.scene.zoomToBlock(page, { padding: 40 });

    cesdk.actions.register('saveScene', async () => {
      const sceneString = await engine.scene.saveToString();
      // Send to your backend API
      console.log('Custom save:', sceneString.length, 'bytes');
    });

    // Button: Save Scene & Download
    const handleSaveScene = async () => {
      const sceneString = await engine.scene.saveToString();
      const sceneBlob = new Blob([sceneString], {
        type: 'application/octet-stream'
      });
      await cesdk.utils.downloadFile(sceneBlob, 'application/octet-stream');
      cesdk.ui.showNotification({
        message: `Scene downloaded (${(sceneString.length / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Button: Save to Archive & Download
    const handleSaveToArchive = async () => {
      const archiveBlob = await engine.scene.saveToArchive();
      await cesdk.utils.downloadFile(archiveBlob, 'application/zip');
      cesdk.ui.showNotification({
        message: `Archive downloaded (${(archiveBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    const handleLoadScene = async () => {
      await cesdk.actions.run('importScene', { format: 'scene' });
    };

    const handleLoadArchive = async () => {
      await cesdk.actions.run('importScene', { format: 'archive' });
      const loadedPage = engine.scene.getCurrentPage();
      if (loadedPage != null) {
        engine.scene.zoomToBlock(loadedPage, { padding: 40 });
      }
    };

    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'save-scene',
          label: 'Save Scene',
          icon: '@imgly/Save',
          onClick: handleSaveScene
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'save-archive',
          label: 'Save Archive',
          icon: '@imgly/Download',
          onClick: handleSaveToArchive
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'load-scene',
          label: 'Load Scene',
          icon: '@imgly/Upload',
          onClick: handleLoadScene
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'load-archive',
          label: 'Load Archive',
          icon: '@imgly/Upload',
          onClick: handleLoadArchive
        }
      ]
    });
  }
}

export default Example;
