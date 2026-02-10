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

    // Get the current order of components in the navigation bar
    const defaultOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.navigation.bar'
    });
    console.log('Default navigation bar order:', defaultOrder);

    // Set a custom order with title centered and actions grouped
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.back.navigationBar',
      'ly.img.spacer',
      'ly.img.title.navigationBar',
      'ly.img.spacer',
      'ly.img.undoRedo.navigationBar',
      'ly.img.actions.navigationBar'
    ]);
    console.log('Navigation bar reordered with centered title');

    // Canvas bar requires the 'at' option for top or bottom positioning
    const canvasBarOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.bar',
      at: 'top'
    });
    console.log('Canvas bar (top) order:', canvasBarOrder);

    // Set a custom canvas bar order
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'top' }, [
      'ly.img.page.add.canvasBar',
      'ly.img.spacer',
      'ly.img.zoom.canvasBar'
    ]);

    // Use component objects for inline configuration
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'ly.img.spacer',
      {
        id: 'ly.img.assetLibrary.dock',
        entries: ['ly.img.image', 'ly.img.text', 'ly.img.shape']
      }
    ]);
    console.log('Dock reordered with custom asset library entries');

    // Set different orders for specific edit modes
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
      [
        'ly.img.text.typeFace.inspectorBar',
        'ly.img.text.fontSize.inspectorBar',
        'ly.img.separator',
        'ly.img.text.bold.inspectorBar',
        'ly.img.text.italic.inspectorBar'
      ]
    );
    console.log('Inspector bar customized for Text edit mode');

    // Move a specific component to the beginning
    const navOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' });
    const actionsIndex = navOrder.findIndex(
      (c) => c.id === 'ly.img.actions.navigationBar'
    );

    if (actionsIndex > 0) {
      const [actions] = navOrder.splice(actionsIndex, 1);
      navOrder.unshift(actions);
      cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, navOrder);
      console.log('Moved actions to the beginning of navigation bar');
    }

    // eslint-disable-next-line no-console
    console.log('Reorder Components example loaded successfully');
  }
}

export default Example;
