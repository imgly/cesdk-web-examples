import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Get the current navigation bar order
    const currentOrder = cesdk.ui.getNavigationBarOrder();
    console.log('Current navigation bar order:', currentOrder);

    // Set a custom navigation bar with fewer buttons
    cesdk.ui.setNavigationBarOrder([
      'ly.img.zoom.navigationBar',
      'ly.img.actions.navigationBar',
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.back.navigationBar'
    ]);

    // Remove flip options from the canvas menu
    cesdk.ui.removeCanvasMenuOrderComponent('ly.img.flipX.canvasMenu');
    cesdk.ui.removeCanvasMenuOrderComponent('ly.img.flipY.canvasMenu');

    // Configure a custom dock with asset library buttons
    cesdk.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'shapes',
        label: 'Shapes',
        icon: '@imgly/Shapes',
        entries: ['ly.img.vectorpath']
      },
      'ly.img.separator',
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'images',
        label: 'Images',
        icon: '@imgly/Image',
        entries: ['ly.img.image']
      },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'text',
        label: 'Text',
        icon: '@imgly/Text',
        entries: ['ly.img.text']
      }
    ]);

    // Insert a separator before the export actions button
    cesdk.ui.insertNavigationBarOrderComponent(
      'ly.img.actions.navigationBar',
      'ly.img.separator',
      'before'
    );

    // Update a component's properties without changing its position
    cesdk.ui.updateDockOrderComponent(
      { id: 'ly.img.assetLibrary.dock', key: 'images' },
      { label: 'Photos' }
    );

    // Set a different canvas menu order for Text edit mode
    cesdk.ui.setCanvasMenuOrder(
      [
        'ly.img.text.bold.canvasMenu',
        'ly.img.text.italic.canvasMenu',
        'ly.img.separator',
        'ly.img.copy.canvasMenu',
        'ly.img.paste.canvasMenu',
        'ly.img.delete.canvasMenu'
      ],
      { editMode: 'Text' }
    );

    // Load assets and create design scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    console.log('Rearrange buttons example loaded successfully!');
  }
}

export default Example;
