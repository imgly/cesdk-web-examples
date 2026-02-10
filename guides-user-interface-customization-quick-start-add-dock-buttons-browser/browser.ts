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

    // First, clear the default dock to demonstrate our custom dock
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, []);

    // Add a Media button combining images and videos
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'media',
        entries: ['ly.img.image', 'ly.img.video'],
        label: 'Media',
        icon: '@imgly/Image'
      }
    );

    // Add an Elements button for shapes and stickers
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'elements',
        entries: ['ly.img.sticker', 'ly.img.vectorpath'],
        label: 'Elements',
        icon: '@imgly/Shapes'
      }
    );

    // Add a Text button
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'text',
        entries: ['ly.img.text'],
        label: 'Text',
        icon: '@imgly/Text'
      }
    );

    // Add an Upload button with custom onClick handler
    cesdk.ui.insertOrderComponent({ in: 'ly.img.dock' }, [
      'ly.img.spacer', // Push upload to bottom
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'upload',
        entries: ['ly.img.upload'],
        label: 'Upload',
        icon: '@imgly/Upload',
        onClick: () => {
          // Custom behavior instead of opening asset library
          // eslint-disable-next-line no-console
          console.log('Custom upload action triggered!');
          // In production: open your custom upload dialog
          alert('Custom upload dialog would open here!');
        }
      }
    ]);

    // Insert a separator between Elements and Text
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock', after: { key: 'elements' } },
      'ly.img.separator'
    );

    // Insert a button at the beginning of the dock
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock', position: 'start' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'templates',
        entries: ['ly.img.template'],
        label: 'Templates',
        icon: '@imgly/Template'
      }
    );

    // eslint-disable-next-line no-console
    console.log('Add Dock Buttons example loaded successfully');
  }
}

export default Example;
