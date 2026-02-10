/**
 * CE.SDK Advanced Video Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the advanced video editor.
 * Import and call `initAdvancedVideoEditor()` to configure a CE.SDK instance for advanced video editing.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
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
import { AdvancedVideoEditorConfig } from './config/plugin';
import { setupActions } from './config/actions';
import { setupBackgroundRemovalPlugin } from './plugins/background-removal';

// Re-export for external use
export { AdvancedVideoEditorConfig } from './config/plugin';
export { setupBackgroundRemovalPlugin } from './plugins/background-removal';

/**
 * Initialize the CE.SDK Advanced Video Editor with a complete configuration.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initAdvancedVideoEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new AdvancedVideoEditorConfig());

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
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());

  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );

  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );

  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());

  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );

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
        'ly.img.exportVideo.navigationBar',
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
    'https://cdn.img.ly/packages/imgly/plugin-marketing-asset-source-web/1.0.0/assets/templates/animated-beauty-product.zip'
  );
}
