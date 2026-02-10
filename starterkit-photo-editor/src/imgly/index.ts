/**
 * CE.SDK Photo Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the photo editor.
 * Import and call `initPhotoEditor()` to configure a CE.SDK instance for photo editing.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration and plugins
import { PhotoEditorConfig } from './config/plugin';
import { setupBackgroundRemovalPlugin } from './plugins/background-removal';

// Re-export for external use
export { PhotoEditorConfig } from './config/plugin';
export { setupBackgroundRemovalPlugin } from './plugins/background-removal';

/**
 * Initialize the CE.SDK Photo Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Photo editor UI configuration
 * - Background removal plugin
 * - Asset source plugins (filters, stickers, shapes, etc.)
 * - Custom translations
 * - Export action button in navigation bar
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initPhotoEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the photo editor configuration plugin
  // This sets up the UI, features, settings, and i18n for photo editing
  await cesdk.addPlugin(new PhotoEditorConfig());

  // ============================================================================
  // Theme and Locale
  // ============================================================================

  // Configure appearance: 'light' | 'dark' | 'system'
  // cesdk.setTheme('dark');
  // cesdk.setLocale('en');

  // ============================================================================
  // Background Removal Plugin
  // ============================================================================

  // Setup AI-powered background removal
  // Requires: npm install @imgly/background-removal onnxruntime-web
  setupBackgroundRemovalPlugin(cesdk);

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Asset source plugins provide built-in asset libraries
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // ============================================================================
  // Localization
  // ============================================================================

  // Add custom translations for UI labels
  cesdk.i18n.setTranslations({
    en: { 'actions.export.image': 'Export Image' }
  });

  // ============================================================================
  // Navigation Bar Button
  // ============================================================================

  // Add export image button to navigation bar
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.navigation.bar', position: 'end' },
    {
      id: 'ly.img.action.navigationBar',
      key: 'actions.export.image',
      color: 'accent',
      icon: '@imgly/Image',
      label: 'actions.export.image',
      onClick: async () => {
        await cesdk.actions.run('exportDesign', {
          mimeType: 'image/png'
        });
      }
    }
  );

  // ============================================================================
  // Scene Loading
  // ============================================================================

  await cesdk.loadFromArchiveURL(
    'https://cdn.img.ly/packages/imgly/plugin-marketing-asset-source-web/1.0.0/assets/templates/16-9-fashion-ad.zip'
  );
}
