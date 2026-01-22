import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create scene first
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    // ===== Canvas Bar Customization Examples =====

    // Register custom components before using them in the Canvas Bar
    // The component can read properties from its payload for customization
    cesdk.ui.registerComponent(
      'ly.img.export.canvasBar',
      ({ builder, payload }) => {
        // Read custom properties from payload with defaults
        const label = (payload?.label as string) ?? 'Export';
        const icon = (payload?.icon as string) ?? '@imgly/Download';

        builder.Button('ly.img.export.canvasBar.button', {
          label,
          icon,
          onClick: async () => {
            // Use the built-in export action
            await cesdk.actions.run('exportDesign', {
              mimeType: 'image/png'
            });
          }
        });
      }
    );

    cesdk.ui.registerComponent(
      'ly.img.themeSwitcher.canvasBar',
      ({ builder }) => {
        // Get current theme to show appropriate icon
        const currentTheme = cesdk.ui.getTheme();
        const isDark = currentTheme === 'dark';

        builder.Button('ly.img.themeSwitcher.canvasBar.button', {
          label: isDark ? 'Light Mode' : 'Dark Mode',
          icon: isDark ? '@imgly/Sun' : '@imgly/Moon',
          onClick: () => {
            // Toggle between light and dark themes
            const theme = cesdk.ui.getTheme();
            cesdk.ui.setTheme(theme === 'dark' ? 'light' : 'dark');
          }
        });
      }
    );

    cesdk.ui.registerComponent(
      'ly.img.boldText.canvasBar',
      ({ builder, engine: eng }) => {
        builder.Button('ly.img.boldText.canvasBar.button', {
          label: 'Bold',
          icon: '@imgly/Bold',
          onClick: () => {
            const selection = eng.block.findAllSelected();
            selection.forEach((blockId) => {
              if (eng.block.getType(blockId) === '//ly.img.ubq/text') {
                const [currentWeight] = eng.block.getTextFontWeights(blockId);
                const newWeight = currentWeight === 'bold' ? 'normal' : 'bold';
                eng.block.setTextFontWeight(blockId, newWeight);
              }
            });
          }
        });
      }
    );

    // Register a zoom button for the top bar
    cesdk.ui.registerComponent('ly.img.zoomFit.canvasBar', ({ builder }) => {
      builder.Button('ly.img.zoomFit.canvasBar.button', {
        label: 'Fit Page',
        icon: '@imgly/Fit',
        onClick: async () => {
          const currentPage = cesdk.engine.scene.getCurrentPage();
          if (currentPage) {
            await cesdk.engine.scene.zoomToBlock(currentPage, {
              padding: 40
            });
          }
        }
      });
    });

    // Register an undo button for the top bar
    cesdk.ui.registerComponent('ly.img.undo.canvasBar', ({ builder }) => {
      const canUndo = cesdk.engine.editor.canUndo();
      builder.Button('ly.img.undo.canvasBar.button', {
        label: 'Undo',
        icon: '@imgly/Undo',
        isDisabled: !canUndo,
        onClick: () => {
          cesdk.engine.editor.undo();
        }
      });
    });

    // Register a redo button for the top bar
    cesdk.ui.registerComponent('ly.img.redo.canvasBar', ({ builder }) => {
      const canRedo = cesdk.engine.editor.canRedo();
      builder.Button('ly.img.redo.canvasBar.button', {
        label: 'Redo',
        icon: '@imgly/Redo',
        isDisabled: !canRedo,
        onClick: () => {
          cesdk.engine.editor.redo();
        }
      });
    });

    // Get the current Canvas Bar order for the bottom position
    const currentOrder = cesdk.ui.getCanvasBarOrder('bottom');
    console.log('Current bottom Canvas Bar order:', currentOrder);

    // Get the order for a specific edit mode
    const textModeOrder = cesdk.ui.getCanvasBarOrder('bottom', {
      editMode: 'Text'
    });
    console.log('Text mode Canvas Bar order:', textModeOrder);

    // Insert the registered export button after the settings button
    cesdk.ui.insertCanvasBarOrderComponent(
      'ly.img.settings.canvasBar',
      'ly.img.export.canvasBar',
      'bottom',
      'after'
    );

    // Remove the add page button for a single-page workflow
    cesdk.ui.removeCanvasBarOrderComponent(
      'ly.img.page.add.canvasBar',
      'bottom'
    );

    // Update the export button with custom properties
    // Components that read from payload can be customized this way
    cesdk.ui.updateCanvasBarOrderComponent(
      'ly.img.export.canvasBar',
      {
        label: 'Export PNG',
        icon: '@imgly/Image'
      },
      'bottom'
    );

    // Set a completely custom Canvas Bar order for the bottom position
    // Reference the registered components by their IDs
    // Use spacers on both sides of the theme toggle to center it
    cesdk.ui.setCanvasBarOrder(
      [
        'ly.img.settings.canvasBar',
        'ly.img.separator',
        'ly.img.export.canvasBar',
        'ly.img.spacer',
        'ly.img.themeSwitcher.canvasBar',
        'ly.img.spacer'
      ],
      'bottom'
    );

    // Also customize the top Canvas Bar with undo/redo and zoom controls
    cesdk.ui.setCanvasBarOrder(
      [
        'ly.img.undo.canvasBar',
        'ly.img.redo.canvasBar',
        'ly.img.spacer',
        'ly.img.zoomFit.canvasBar'
      ],
      'top'
    );

    // Configure different Canvas Bar for Text edit mode
    // Reference the registered bold button by its ID
    cesdk.ui.setCanvasBarOrder(
      [
        'ly.img.settings.canvasBar',
        'ly.img.separator',
        'ly.img.boldText.canvasBar',
        'ly.img.spacer',
        'ly.img.export.canvasBar'
      ],
      'bottom',
      { editMode: 'Text' }
    );

    // Using layout helpers: spacers and separators
    const updatedOrder = cesdk.ui.getCanvasBarOrder('bottom');
    console.log('Updated bottom Canvas Bar order:', updatedOrder);

    // Insert a separator before the export button
    cesdk.ui.insertCanvasBarOrderComponent(
      'ly.img.export.canvasBar',
      'ly.img.separator',
      'bottom',
      'before'
    );

    // Log final Canvas Bar configuration
    const finalOrder = cesdk.ui.getCanvasBarOrder('bottom');
    console.log('Final bottom Canvas Bar order:', finalOrder);

    const topOrder = cesdk.ui.getCanvasBarOrder('top');
    console.log('Top Canvas Bar order:', topOrder);

    console.log('Canvas Bar customization example loaded successfully!');
  }
}

export default Example;
