/**
 * CE.SDK Video Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the video editor.
 * Import and call `initVideoEditor()` to configure a CE.SDK instance for video editing.
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
  TextComponentAssetSource,
  TypefaceAssetSource,
  TextAssetSource,
  VectorShapeAssetSource,
  UploadAssetSources
} from '@cesdk/cesdk-js/plugins';

// Configuration and plugins
import { VideoEditorConfig } from './config/plugin';
import { setupActions } from './config/actions';
import { setupBackgroundRemovalPlugin } from './plugins/background-removal';

// Re-export for external use
export { VideoEditorConfig } from './config/plugin';
export { setupBackgroundRemovalPlugin } from './plugins/background-removal';

/**
 * Initialize the CE.SDK Video Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Video editor UI configuration
 * - Background removal plugin
 * - Asset source plugins (videos, audio, images, effects, etc.)
 * - Custom translations
 * - Export video button in navigation bar
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initVideoEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the video editor configuration plugin
  // This sets up the UI, features, settings, and i18n for video editing
  await cesdk.addPlugin(new VideoEditorConfig());

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

  // Blur presets for blur effects
  await cesdk.addPlugin(new BlurAssetSource());

  // Caption presets for video captions
  await cesdk.addPlugin(new CaptionPresetsAssetSource());

  // Color palettes for design
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images, videos, audio)
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );

  // Demo assets (images, videos, audio, stickers, templates)
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

  // Visual effects (adjustments, vignette, etc.)
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters (LUT, duotone)
  await cesdk.addPlugin(new FiltersAssetSource());

  // Page format presets (social media video sizes)
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

  // Sticker assets
  await cesdk.addPlugin(new StickerAssetSource());

  // Text presets (headlines, body text styles)
  await cesdk.addPlugin(new TextAssetSource());

  // Text components (pre-designed text layouts)
  await cesdk.addPlugin(new TextComponentAssetSource());

  // Typeface/font assets
  await cesdk.addPlugin(new TypefaceAssetSource());

  // Vector shapes (rectangles, circles, arrows, etc.)
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // ============================================================================
  // Localization
  // ============================================================================

  // Add custom translations for UI labels
  cesdk.i18n.setTranslations({
    en: { 'actions.export.video': 'Export Video' }
  });

  // ============================================================================
  // Actions Setup
  // ============================================================================

  // Register custom actions (video export, etc.)
  setupActions(cesdk);

  // ============================================================================
  // Navigation Bar Button
  // ============================================================================

  // Add export video button to navigation bar
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.navigation.bar', position: 'end' },
    {
      id: 'ly.img.action.navigationBar',
      key: 'actions.export.video',
      color: 'accent',
      icon: '@imgly/Video',
      label: 'actions.export.video',
      onClick: async () => {
        await cesdk.actions.run('exportDesign', {
          mimeType: 'video/mp4'
        });
      }
    }
  );

  // ============================================================================
  // Scene Loading
  // ============================================================================

  await cesdk.loadFromArchiveURL(
    'https://cdn.img.ly/packages/imgly/plugin-marketing-asset-source-web/1.0.0/assets/templates/video-fashion-portfolio.zip'
  );
}
