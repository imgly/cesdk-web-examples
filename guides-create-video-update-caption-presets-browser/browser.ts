import type {
  AssetStylePreset,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ImageColorsAssetSource,
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
import { VideoEditorConfig } from './video-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Update Caption Presets Guide
 *
 * Demonstrates creating custom caption presets in CE.SDK:
 * - Defining a declarative style preset for a caption look
 * - Registering the preset so it appears in the caption presets panel
 * - Understanding the content.json structure for hosted caption presets
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
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

    await cesdk.actions.run('scene.create', {
      layout: 'DepthStack',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story',
        color: { r: 0, g: 0, b: 0, a: 1 }
      }
    });

    const engine = cesdk.engine;

    // Describe the look as a declarative style preset. The engine reads this
    // object and applies it to a caption block, so there is no styled block to
    // serialize. Colors are RGB(A) objects in the 0-1 range.
    const neonGlowStylePreset: AssetStylePreset = {
      blockType: '//ly.img.ubq/caption',
      // `replace` resets the properties the preset does not list, so switching
      // presets never stacks leftover decorations.
      mode: 'replace',
      typeface: {
        family: 'Monoton',
        weight: 'normal',
        style: 'normal'
      },
      properties: {
        // Keys without a slash are namespaced to the block (caption/*).
        'caption/horizontalAlignment': 'Center',
        'caption/verticalAlignment': 'Center',
        // Bright cyan text fill.
        'fill/enabled': true,
        'fill/solid/color': { r: 0, g: 1, b: 1, a: 1 },
        // Semi-transparent background so captions stay readable over video.
        'backgroundColor/enabled': true,
        'backgroundColor/color': { r: 0, g: 0, b: 0.1, a: 0.7 },
        // A matching glow built from a soft drop shadow.
        'dropShadow/enabled': true,
        'dropShadow/color': { r: 0, g: 1, b: 1, a: 0.8 },
        'dropShadow/clip': false
      },
      // Keep the background rounding and the glow proportional to the font size
      // instead of baking in fixed pixel values. Each entry sets its property to
      // `ratio * fontSize`.
      scaleWithFontSize: [
        { property: 'backgroundColor/cornerRadius', ratio: 0.2 },
        { property: 'dropShadow/blurRadius/x', ratio: 0.8 },
        { property: 'dropShadow/blurRadius/y', ratio: 0.8 }
      ]
    };

    // Add the preset to the existing caption presets source so it shows up in
    // the caption presets panel next to the built-in presets.
    engine.asset.addAssetToSource('ly.img.caption.presets', {
      id: 'ly.img.caption.presets.neon-glow',
      label: { en: 'Neon Glow' },
      meta: {
        thumbUri: '{{base_url}}/ly.img.caption.presets/thumbnails/neon-glow.png'
      },
      groups: ['caption'],
      payload: { stylePreset: neonGlowStylePreset }
    });

    // To host the preset instead of registering it at runtime, add the same
    // entry to your content.json. The style preset lives in payload.stylePreset
    // and meta only needs a thumbUri.
    const contentJsonEntry = {
      id: 'ly.img.caption.presets.neon-glow',
      label: { en: 'Neon Glow' },
      meta: {
        thumbUri: '{{base_url}}/ly.img.caption.presets/thumbnails/neon-glow.png'
      },
      groups: ['caption'],
      payload: { stylePreset: neonGlowStylePreset }
    };

    // eslint-disable-next-line no-console
    console.log('=== content.json Entry ===');
    // eslint-disable-next-line no-console
    console.log('Add this entry to your content.json assets array:');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(contentJsonEntry, null, 2));

    // A complete content.json wraps the preset entries in the assets array.
    const completeContentJson = {
      version: '7.0.0',
      id: 'ly.img.caption.presets',
      assets: [contentJsonEntry]
    };

    // eslint-disable-next-line no-console
    console.log('\n=== Complete content.json Example ===');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(completeContentJson, null, 2));

    // eslint-disable-next-line no-console
    console.log('\n=== Caption Preset Guide ===');
    // eslint-disable-next-line no-console
    console.log(
      'Open the caption presets panel to apply the "Neon Glow" preset to a caption.'
    );
    // eslint-disable-next-line no-console
    console.log('To host this preset:');
    // eslint-disable-next-line no-console
    console.log('1. Add the content.json entry to your assets folder');
    // eslint-disable-next-line no-console
    console.log('2. Create a thumbnail image showing the preset appearance');
    // eslint-disable-next-line no-console
    console.log('3. Configure CE.SDK baseURL to point to your assets location');
  }
}

export default Example;
