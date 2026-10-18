/**
 * CE.SDK Premium Templates Editor - Initialization Module
 *
 * This module demonstrates how to add premium templates in the design editor
 * using the PremiumTemplatesAssetSource plugin.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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

  await Promise.all([
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource()),

    cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    ),

    // Include demo templates so premium templates can be added alongside them
    cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    ),

    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),

    // ============================================================================
    // Premium Templates
    // ============================================================================

    // Add premium templates
    cesdk.addPlugin(
      new PremiumTemplatesAssetSource({
        include: ['ly.img.templates.premium.*']
      })
    )
  ]);

  // Note: Scene loading is handled by the gallery - templates are loaded via
  // engine.scene.load() when the user selects a template
}
