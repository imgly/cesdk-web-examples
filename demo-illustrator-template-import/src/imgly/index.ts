/**
 * CE.SDK Illustrator Template Import Editor - Initialization Module
 *
 * Exports only the init function for the Illustrator template import editor.
 *
 * @see https://img.ly/docs/cesdk/js/features/
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

import { AdvancedEditorConfig } from './config/plugin';

/**
 * Initialize the CE.SDK editor for Illustrator template import workflow.
 *
 * This function configures the editor with:
 * - Illustrator-specific UI configuration
 * - Asset sources for editing
 *
 * @param cesdk - The CreativeEditorSDK instance
 */
export async function initIllustratorTemplateImportEditor(
  cesdk: CreativeEditorSDK
) {
  // Add Illustrator template import configuration plugin
  await cesdk.addPlugin(new AdvancedEditorConfig());

  // Add asset source plugins
  await Promise.all([
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new ImageColorsAssetSource()),
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource()),
    cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    ),
    cesdk.addPlugin(new DemoAssetSources({ include: ['ly.img.image.*'] })),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),

    // Premium templates
    cesdk.addPlugin(
      new PremiumTemplatesAssetSource({
        include: ['ly.img.templates.premium.*']
      })
    )
  ]);
}
