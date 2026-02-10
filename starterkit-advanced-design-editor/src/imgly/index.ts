/**
 * CE.SDK Advanced Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the advanced editor.
 * Import and call `initAdvancedEditor()` to configure a CE.SDK instance for advanced editing.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration and plugins
import { AdvancedEditorConfig } from './config/plugin';
import { setupActions } from './config/actions';
import { setupBackgroundRemovalPlugin } from './plugins/background-removal';

// Re-export for external use
export { AdvancedEditorConfig } from './config/plugin';
export { setupBackgroundRemovalPlugin } from './plugins/background-removal';

/**
 * Initialize the CE.SDK Advanced Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Advanced editor UI configuration
 * - Background removal plugin
 * - Asset source plugins (templates, images, shapes, text, etc.)
 * - Actions dropdown in navigation bar
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initAdvancedEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new AdvancedEditorConfig());

  // ============================================================================
  // Theme and Locale
  // ============================================================================

  // cesdk.setTheme('dark');
  // cesdk.setLocale('en');

  // ============================================================================
  // Background Removal Plugin
  // ============================================================================

  setupBackgroundRemovalPlugin(cesdk);

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());

  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.blank.*',
        'ly.img.templates.presentation.*',
        'ly.img.templates.print.*',
        'ly.img.templates.social.*',
        'ly.img.image.*'
      ]
    })
  );

  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // ============================================================================
  // Actions Setup
  // ============================================================================

  setupActions(cesdk);

  // ============================================================================
  // Navigation Bar Actions
  // ============================================================================

  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.navigation.bar', position: 'end' },
    {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar',
        'ly.img.exportScene.navigationBar',
        'ly.img.exportArchive.navigationBar',
        'ly.img.importScene.navigationBar',
        'ly.img.importArchive.navigationBar'
      ]
    }
  );

  // ============================================================================
  // Scene Loading
  // ============================================================================

  await cesdk.loadFromArchiveURL(
    'https://cdn.img.ly/packages/imgly/plugin-marketing-asset-source-web/1.0.0/assets/templates/9-16-marketing-ad-fragrance.zip'
  );
}
