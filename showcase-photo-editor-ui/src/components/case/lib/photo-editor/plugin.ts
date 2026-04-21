/**
 * Photo Editor Plugin - Complete Photo Editing Configuration for CE.SDK
 *
 * This plugin provides a production-ready photo editor configuration optimized
 * for single-image editing with crop, adjustments, filters, and effects.
 *
 * @example Basic usage
 * ```typescript
 * import CreativeEditorSDK from '@cesdk/cesdk-js';
 * import { PhotoEditorConfig } from './plugin';
 *
 * const cesdk = await CreativeEditorSDK.create('#editor', config);
 * await cesdk.addPlugin(new PhotoEditorConfig());
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
 * Photo Editor configuration plugin.
 *
 * Provides a complete photo editing experience optimized for single-image
 * editing with crop, adjustments, filters, effects, and text overlays.
 *
 * @public
 */
export class PhotoEditorConfig implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   * Used to identify the plugin in the CE.SDK plugin registry.
   */
  name = 'cesdk-photo-editor';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Initialize the photo editor configuration.
   *
   * This method is called when the plugin is added to CE.SDK via addPlugin().
   * It sets up all features, UI components, translations, settings, and event handlers.
   *
   * @param ctx - The editor plugin context containing cesdk and engine instances
   */
  async initialize(ctx: EditorPluginContext) {
    const subscriptions: (() => void)[] = [];
    const { cesdk, engine } = ctx;
    if (cesdk) {
      // #region Editor Reset
      // Reset editor to clear any previous configuration
      // This ensures a clean slate when applying the photo editor config
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

      // #region Cleanup Handler
      // Setup cleanup handler for subscriptions on reset to prevent memory leaks
      setupOnReset(cesdk, subscriptions);
      // #endregion

      // #region Engine Settings
      // Configure engine settings (interactions, page behavior, etc.)
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

/**
 * Setup cleanup handler for when the editor is reset.
 * Ensures all subscriptions are properly unsubscribed to prevent memory leaks.
 *
 * @param cesdk - The CreativeEditorSDK instance
 * @param subscriptions - Array of cleanup functions to call on reset
 */
function setupOnReset(
  cesdk: CreativeEditorSDK,
  subscriptions: (() => void)[]
): void {
  cesdk.onReset(() => {
    subscriptions.forEach((unsubscribe) => {
      unsubscribe();
    });
    subscriptions.length = 0;
  });
}
