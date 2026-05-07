/**
 * CE.SDK Premium Templates Editor - Initialization Module
 *
 * This module demonstrates how to add premium templates in the design editor
 * using the PremiumTemplatesAssetSource plugin.
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
  PremiumTemplatesAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration
import { DesignEditorConfig } from './config/plugin';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';

// ============================================================================
// Main Initialization
// ============================================================================

/**
 * Initialize the CE.SDK Premium Templates Editor.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - Premium templates asset source
 * - Standard asset source plugins
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initPremiumTemplatesEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the design editor configuration plugin
  await cesdk.addPlugin(new DesignEditorConfig());

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

  // Include demo templates so premium templates can be added alongside them
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
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
  // Premium Templates
  // ============================================================================

  // Add premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );

  // Note: Scene loading is handled by the gallery - templates are loaded via
  // engine.scene.loadFromArchiveURL() when the user selects a template
}
