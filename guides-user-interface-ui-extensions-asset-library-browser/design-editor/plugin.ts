/**
 * Design Editor Plugin - Complete Design Editing Configuration for CE.SDK
 *
 * This plugin provides a production-ready design editor configuration with
 * templates, elements, asset libraries, and comprehensive editing capabilities.
 *
 * @example Basic usage
 * ```typescript
 * import CreativeEditorSDK from '@cesdk/cesdk-js';
 * import { DesignEditorConfig } from './plugin';
 *
 * const cesdk = await CreativeEditorSDK.create('#editor', config);
 * await cesdk.addPlugin(new DesignEditorConfig());
 * await cesdk.actions.run('scene.create');
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/disable-or-enable-f058e2/
 * @see https://img.ly/docs/cesdk/js/configuration-2c1c3d/
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import { setupActions } from './actions';
import { setupFeatures } from './features';
import { setupTranslations } from './i18n';
import { setupSettings } from './settings';
import { setupUI } from './ui';

/**
 * Design Editor configuration plugin.
 *
 * Provides a complete design editing experience optimized for creating
 * graphics, templates, marketing materials, and multi-page documents.
 *
 * @public
 */
export class DesignEditorConfig implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   * Used to identify the plugin in the CE.SDK plugin registry.
   */
  name = 'cesdk-design-editor';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Initialize the design editor configuration.
   *
   * This method is called when the plugin is added to CE.SDK via addPlugin().
   * It sets up all features, UI components, translations, and settings.
   *
   * @param ctx - The editor plugin context containing cesdk and engine instances
   */
  async initialize({ cesdk, engine }: EditorPluginContext) {
    if (cesdk) {
      // #region Editor Reset
      // Reset editor to clear any previous configuration
      // This ensures a clean slate when applying the design editor config
      cesdk.resetEditor();
      // #endregion

      // #region Feature Configuration
      // Configure which features are available in the editor
      // See features.ts for all available feature options
      setupFeatures(cesdk);
      // #endregion

      // #region UI Configuration
      // Configure the UI layout (navigation bar, dock, inspector, canvas, panels)
      // See ui/ folder for all UI configuration options
      setupUI(cesdk);
      // #endregion

      // #region Actions Configuration
      // Configure export, save, and share actions
      // See actions.ts for action configuration
      setupActions(cesdk);
      // #endregion

      // #region Translation Configuration
      // Set custom translations and labels for the UI
      // See i18n.ts for translation configuration
      setupTranslations(cesdk);
      // #endregion

      // #region Engine Settings
      // Configure engine settings (interactions, colors, snapping, etc.)
      // See settings.ts for all available settings
      setupSettings(engine);
      // #endregion

      // Re-applies deprecated configuration options (e.g. callbacks,
      // ui.elements.*, locale, i18n) that were cleared by resetEditor() above.
      // If you have already migrated to the respective API calls, you can
      // safely remove this line.
      cesdk.reapplyLegacyUserConfiguration();
    }
  }
}
