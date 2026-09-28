/**
 * Static / Video Mode Switch Demo - Editor Initialization
 *
 * Mirrors the pattern used by the CE.SDK dev deployment's
 * ConfigSwitcher: on every mode switch, reset the editor and install
 * the target config plugin (DesignEditorConfig or VideoEditorConfig)
 * on the same editor instance. No remount, no scene reload.
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

import { DesignEditorConfig } from './config/design/plugin';
import { VideoEditorConfig } from './config/video/plugin';
import type { EditorMode } from './modeSwitch';

export {
  MODE_SWITCH_ID,
  registerModeSwitch,
  type EditorMode,
  type ModeSwitchController
} from './modeSwitch';

// Shared asset sources — identical between Static and Video modes.
// Built lazily per switch; each call returns a fresh set of instances.
function sharedAssetPlugins() {
  return [
    new ColorPaletteAssetSource(),
    new TypefaceAssetSource(),
    new TextAssetSource(),
    new TextComponentAssetSource(),
    new VectorShapeAssetSource(),
    new StickerAssetSource(),
    new EffectsAssetSource(),
    new FiltersAssetSource(),
    new BlurAssetSource(),
    new CropPresetsAssetSource()
  ];
}

export async function initDesignEditor(
  cesdk: CreativeEditorSDK
): Promise<void> {
  cesdk.resetEditor();

  // The config plugin must initialize first so its resetEditor call
  // happens before we re-register asset sources.
  await cesdk.addPlugin(new DesignEditorConfig());

  // Asset source plugins are independent — register in parallel so
  // each initialize() doesn't block the next.
  await Promise.all([
    ...sharedAssetPlugins().map((p) => cesdk.addPlugin(p)),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    ),
    cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    )
  ]);
}

export async function initVideoEditor(cesdk: CreativeEditorSDK): Promise<void> {
  cesdk.resetEditor();

  await cesdk.addPlugin(new VideoEditorConfig());

  await Promise.all([
    ...sharedAssetPlugins().map((p) => cesdk.addPlugin(p)),
    cesdk.addPlugin(new CaptionPresetsAssetSource()),
    cesdk.addPlugin(
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
    ),
    cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
      })
    ),
    cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    )
  ]);
}

export async function applyMode(
  cesdk: CreativeEditorSDK,
  mode: EditorMode
): Promise<void> {
  if (mode === 'Video') {
    await initVideoEditor(cesdk);
  } else {
    await initDesignEditor(cesdk);
  }
}
