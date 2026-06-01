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
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({ include: ['ly.img.image.upload'] })
  );
  await cesdk.addPlugin(new DemoAssetSources({ include: ['ly.img.image.*'] }));
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );
}
