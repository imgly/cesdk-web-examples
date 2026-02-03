import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * Inspector Bar Customization Example
 *
 * This example demonstrates how to use CE.SDK's Inspector Bar Order API to:
 * - Get and set the inspector bar component order
 * - Insert custom components into the inspector bar
 * - Remove built-in components
 * - Configure different orders for different edit modes
 * - Register custom components for the inspector bar
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Add an image to demonstrate the inspector bar
    const image = await engine.asset.defaultApplyAsset({
      id: 'ly.img.cesdk.images.samples/sample.1',
      meta: {
        uri: 'https://cdn.img.ly/assets/demo/v1/ly.img.image/images/sample_1.jpg',
        width: 2500,
        height: 1667
      }
    });

    if (image) {
      // Position the image in the center of the page
      const pageWidth = engine.block.getWidth(page);
      const pageHeight = engine.block.getHeight(page);
      const imageWidth = engine.block.getWidth(image);
      const imageHeight = engine.block.getHeight(image);

      engine.block.setPositionX(image, (pageWidth - imageWidth) / 2);
      engine.block.setPositionY(image, (pageHeight - imageHeight) / 2);

      // Select the image to show the inspector bar
      engine.block.select(image);
    }

    // Get the current inspector bar order
    const currentOrder = cesdk.ui.getInspectorBarOrder();
    console.log('Current inspector bar order:', currentOrder);

    // Get the order for a specific edit mode
    const cropOrder = cesdk.ui.getInspectorBarOrder({ editMode: 'Crop' });
    console.log('Crop mode inspector bar order:', cropOrder);

    // Set a completely new inspector bar order
    // This replaces all existing components with a simplified set
    cesdk.ui.setInspectorBarOrder([
      'ly.img.fill.inspectorBar',
      'ly.img.separator',
      'ly.img.stroke.inspectorBar',
      'ly.img.separator',
      'ly.img.filter.inspectorBar',
      'ly.img.effect.inspectorBar',
      'ly.img.spacer',
      'ly.img.crop.inspectorBar'
    ]);

    // Remove specific components from the inspector bar
    // Remove shadow controls for a simpler UI
    const removeResult = cesdk.ui.removeInspectorBarOrderComponent(
      'ly.img.shadow.inspectorBar'
    );
    console.log('Removed components:', removeResult.removed);

    // Remove multiple components using a matcher function
    cesdk.ui.removeInspectorBarOrderComponent((component) =>
      component.id.includes('blur')
    );

    // Register a custom component for the inspector bar
    cesdk.ui.registerComponent(
      'my.custom.quickExport.inspectorBar',
      ({ builder }) => {
        builder.Button('quick-export', {
          label: 'Quick Export',
          icon: '@imgly/icons/Download',
          onClick: async () => {
            const pages = engine.block.findByType('page');
            if (pages.length > 0) {
              const blob = await engine.block.export(pages[0], {
                mimeType: 'image/png'
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'export.png';
              link.click();
              URL.revokeObjectURL(url);
            }
          }
        });
      }
    );

    // Insert the custom component after the crop controls
    cesdk.ui.insertInspectorBarOrderComponent(
      'ly.img.crop.inspectorBar',
      'my.custom.quickExport.inspectorBar',
      'after'
    );

    // Insert a component at the beginning of the inspector bar
    cesdk.ui.insertInspectorBarOrderComponent(
      'first',
      'ly.img.opacityOptions.inspectorBar',
      'before'
    );

    // Update an existing component's properties
    // Add a custom key to identify this specific instance
    cesdk.ui.updateInspectorBarOrderComponent('ly.img.fill.inspectorBar', {
      key: 'main-fill-control'
    });

    // Configure different inspector bar orders for different edit modes
    // Set a minimal order for Crop mode
    cesdk.ui.setInspectorBarOrder(['ly.img.cropControls.inspectorBar'], {
      editMode: 'Crop'
    });

    // Set a custom order for Text editing mode
    cesdk.ui.setInspectorBarOrder(
      [
        'ly.img.text.typeFace.inspectorBar',
        'ly.img.text.fontSize.inspectorBar',
        'ly.img.separator',
        'ly.img.text.bold.inspectorBar',
        'ly.img.text.italic.inspectorBar',
        'ly.img.separator',
        'ly.img.text.alignHorizontal.inspectorBar',
        'ly.img.spacer',
        'ly.img.fill.inspectorBar'
      ],
      { editMode: 'Text' }
    );

    // Control inspector bar visibility with view modes
    // The inspector bar appears in 'default' view and is hidden in 'advanced' view
    const currentView = cesdk.ui.getView();
    console.log('Current view mode:', currentView);

    // Toggle between default (inspector bar visible) and advanced (inspector panel visible)
    // Uncomment to switch views:
    // cesdk.ui.setView('advanced'); // Hides inspector bar, shows inspector panel
    // cesdk.ui.setView('default');  // Shows inspector bar

    // Log the final inspector bar order
    const finalOrder = cesdk.ui.getInspectorBarOrder();
    console.log('Final inspector bar order:', finalOrder);
  }
}

export default Example;
