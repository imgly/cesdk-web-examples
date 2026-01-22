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

    // Get the current canvas menu order for Transform mode (default)
    const currentOrder = cesdk.ui.getCanvasMenuOrder();
    console.log('Canvas menu order:', currentOrder);

    // Get order for a specific edit mode
    const textModeOrder = cesdk.ui.getCanvasMenuOrder({ editMode: 'Text' });
    console.log('Text mode order:', textModeOrder);

    // Remove a component from the canvas menu
    cesdk.ui.removeCanvasMenuOrderComponent('ly.img.placeholder.canvasMenu');

    // Update an existing component to add custom properties
    cesdk.ui.updateCanvasMenuOrderComponent('ly.img.delete.canvasMenu', {
      variant: 'regular'
    });

    // Register a custom component for the canvas menu
    cesdk.ui.registerComponent(
      'ly.img.download.canvasMenu',
      ({ builder, engine }) => {
        const selectedBlocks = engine.block.findAllSelected();
        const hasSelection = selectedBlocks.length > 0;

        builder.Button('download-button', {
          label: 'Download',
          icon: '@imgly/Download',
          isDisabled: !hasSelection,
          onClick: async () => {
            if (selectedBlocks.length === 0) return;
            const block = selectedBlocks[0];
            const blob = await engine.block.export(block, {
              mimeType: 'image/png'
            });
            await cesdk.utils.downloadFile(blob, 'image/png');
          }
        });
      }
    );

    // Insert the custom component after duplicate
    cesdk.ui.insertCanvasMenuOrderComponent(
      'ly.img.duplicate.canvasMenu',
      'ly.img.download.canvasMenu',
      'after'
    );

    // Add a custom action to the options dropdown
    cesdk.ui.insertCanvasMenuOrderComponent(
      'ly.img.options.canvasMenu',
      {
        id: 'ly.img.action.canvasMenu',
        key: 'export-jpeg',
        label: 'Export JPEG',
        onClick: async () => {
          const selectedBlocks = engine.block.findAllSelected();
          if (selectedBlocks.length === 0) return;
          const block = selectedBlocks[0];
          const blob = await engine.block.export(block, {
            mimeType: 'image/jpeg'
          });
          await cesdk.utils.downloadFile(blob, 'image/jpeg');
        }
      },
      'asChild'
    );

    // Set a complete order for Text edit mode
    cesdk.ui.setCanvasMenuOrder(
      [
        'ly.img.text.color.canvasMenu',
        'ly.img.text.bold.canvasMenu',
        'ly.img.text.italic.canvasMenu',
        'ly.img.separator',
        'ly.img.delete.canvasMenu'
      ],
      { editMode: 'Text' }
    );

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();
  }
}

export default Example;
