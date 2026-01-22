import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * Dock Customization Example
 *
 * This example demonstrates how to use CE.SDK's Dock Order API to:
 * - Configure dock appearance (icon size, labels)
 * - Retrieve the current dock order
 * - Remove dock components (hide libraries)
 * - Update existing dock components
 * - Insert new dock components
 * - Use separators and spacers for visual organization
 * - Add custom components to the dock
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

    // Configure dock appearance with large icons
    cesdk.engine.editor.setSetting('dock/iconSize', 'large');
    cesdk.engine.editor.setSetting('dock/hideLabels', false);

    // Get the current dock order to see all default components
    const currentOrder = cesdk.ui.getDockOrder();
    console.log(
      'Default dock order:',
      currentOrder.map((c) => c.key ?? c.id)
    );

    // Remove stickers library from the dock
    cesdk.ui.removeDockOrderComponent({ key: 'ly.img.sticker' });

    // Update the image library with a custom label
    cesdk.ui.updateDockOrderComponent(
      { key: 'ly.img.image' },
      { label: 'Photos' }
    );

    // Insert a custom featured library after images
    cesdk.ui.insertDockOrderComponent(
      { key: 'ly.img.image' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'custom.featured',
        label: 'Featured',
        icon: '@imgly/ShapeStar',
        entries: ['ly.img.sticker']
      },
      'after'
    );

    // Insert a separator before the upload library
    cesdk.ui.insertDockOrderComponent(
      { key: 'ly.img.upload' },
      { id: 'ly.img.separator' },
      'before'
    );

    // Register a custom theme toggle component
    cesdk.ui.registerComponent('custom.themeToggle', ({ builder }) => {
      const currentTheme = cesdk.ui.getTheme();
      builder.Button('theme-toggle', {
        label: currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode',
        icon: '@imgly/Appearance',
        onClick: () => {
          cesdk.ui.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        }
      });
    });

    // Add a spacer and the theme toggle at the bottom of the dock
    cesdk.ui.insertDockOrderComponent('last', { id: 'ly.img.spacer' }, 'after');
    cesdk.ui.insertDockOrderComponent(
      'last',
      { id: 'custom.themeToggle' },
      'after'
    );

    // Log the updated dock order
    const updatedOrder = cesdk.ui.getDockOrder();
    console.log(
      'Updated dock order:',
      updatedOrder.map((c) => c.key ?? c.id)
    );
  }
}

export default Example;
