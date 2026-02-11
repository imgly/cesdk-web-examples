import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Custom Labels Guide
 *
 * Demonstrates customizing UI text labels in CE.SDK:
 * - Overriding specific labels while keeping default locale
 * - Customizing action button labels (Export, Save, Delete, etc.)
 * - Changing navigation labels (Back, Close, Done)
 * - Modifying panel and component labels
 * - Runtime label updates
 * - Common customization scenarios for branding
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable features to demonstrate various UI labels
    cesdk.feature.enable('ly.img.fill');
    cesdk.feature.enable('ly.img.adjustment');
    cesdk.feature.enable('ly.img.layer');
    cesdk.feature.enable('ly.img.settings');

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // ===== Custom Label Translations =====
    // Apply all custom label translations in a single call
    // This demonstrates customizing multiple UI elements at once

    // Example 1: Undo Button Label
    // Visible in the navigation bar
    cesdk.i18n.setTranslations({
      en: {
        'common.undo': 'Revert'
      }
    });

    // Example 2: Elements Dock Button
    // Visible in the dock/library panel
    cesdk.i18n.setTranslations({
      en: {
        'component.library.elements': 'Shapes'
      }
    });

    // Example 3: Image Dock Button
    // Visible in the dock/library panel
    cesdk.i18n.setTranslations({
      en: {
        'libraries.ly.img.image.label': 'Photos'
      }
    });

    // Example 4: Add Page Button
    // Visible in page management controls
    cesdk.i18n.setTranslations({
      en: {
        'action.page.add': 'New Page'
      }
    });

    // Example 5: Preview Button
    // Visible in the navigation bar or view controls
    cesdk.i18n.setTranslations({
      en: {
        'common.mode.preview': 'View Mode'
      }
    });

    // Create a single text block showing all customizations
    const textBlock = engine.block.create('text');
    const labelText = `Custom Labels Applied:

1. "Undo" → "Revert"
2. "Elements" → "Shapes"
3. "Images" → "Photos"
4. "Add Page" → "New Page"
5. "Preview" → "View Mode"

Check the navigation bar, dock, and menus to see these changes!`;

    engine.block.setString(textBlock, 'text/text', labelText);
    engine.block.setWidth(textBlock, pageWidth * 0.8);
    engine.block.setHeight(textBlock, pageHeight * 0.8);
    engine.block.setPositionX(textBlock, pageWidth * 0.1);
    engine.block.setPositionY(textBlock, pageHeight * 0.1);
    engine.block.setFloat(textBlock, 'text/fontSize', 30);
    engine.block.appendChild(page, textBlock);

    // To discover available translation keys:
    // 1. Download en.json from CDN:
    //    https://cdn.img.ly/packages/imgly/cesdk-js/$VERSION$/assets/i18n/en.json
    // 2. Inspect UI with browser DevTools to find key names
    // 3. Check console logs when interacting with UI components

    // Select the text block to show it in the canvas
    engine.block.setSelected(textBlock, true);
  }
}

export default Example;
