import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  ImageColorsAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { VideoEditorConfig } from './video-editor/plugin';
import { LottieImporter } from '@imgly/lottie-importer';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Import Lottie Animations Guide
 *
 * Demonstrates how to import Lottie animations as editable blocks with
 * `@imgly/lottie-importer`:
 * - Importing the text of a Lottie `.json` file
 * - Reading the fallback layers and the slots of the import
 * - Changing a slot through its variable
 * - Reading the markers that the import adds to the scene
 * - Importing a `.lottie` archive from a URL
 * - Saving the scene to a string, which needs the data: scheme
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
        include: ['ly.img.page.presets.video.*']
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    // The import adds its blocks to the current page.
    await cesdk.actions.run('scene.create', {
      layout: 'DepthStack',
      page: { width: 1280, height: 720, unit: 'Pixel' }
    });
    const engine = cesdk.engine;

    // fromJSON() takes the text of a Lottie .json file.
    const jsonUrl = new URL('./badge.json', window.location.href).href;
    const json = await (await fetch(jsonUrl)).text();
    const badge = await LottieImporter.fromJSON(engine, json);

    // The group holds one block per layer, named after the layer.
    const layerNames = engine.block
      .getChildren(badge.block)
      .map((child) => engine.block.getName(child));
    console.log('Imported layers:', layerNames);

    // Layers without a native mapping play back from a video fill.
    for (const layer of badge.fallbackLayers) {
      console.log(
        `Layer ${layer.layerIndex} "${layer.name}" falls back: ${layer.reason}`
      );
    }

    // Each slot becomes a variable named after the slot id.
    for (const slot of badge.slots) {
      console.log(
        `Slot "${slot.id}" -> variables [${slot.variables.join(', ')}]`,
        slot.reason
      );
    }
    const brandSlot = badge.slots.find((slot) => slot.id === 'brand');
    const brandVariable = brandSlot?.variables[0];
    if (brandVariable !== undefined) {
      // Setting the variable recolors every fill that uses the slot.
      engine.variable.setColor(brandVariable, {
        r: 0.13,
        g: 0.55,
        b: 0.45,
        a: 1
      });
    }

    // Lottie markers become scene markers, in seconds.
    for (const marker of engine.scene.getMarkers()) {
      console.log(
        `Marker "${marker.name}" at ${marker.time}s for ${marker.duration}s`
      );
    }

    // fromURL() fetches a .json or .lottie file from an absolute URL.
    const dotLottieUrl = new URL('./badge.lottie', window.location.href).href;
    const archive = await LottieImporter.fromURL(engine, dotLottieUrl);
    console.log('Imported animation:', archive.animationId);
    console.log('Ignored archive entries:', archive.ignoredArchiveEntries);

    // The imported group is a regular block. Move it next to the first one.
    engine.block.setPositionX(
      archive.block,
      engine.block.getPositionX(archive.block) + 640
    );

    // Fallback layers play Lottie documents from data: URIs. saveToString()
    // keeps them only when 'data' is in the allowed resource schemes.
    const sceneString = await engine.scene.saveToString({
      allowedResourceSchemes: [
        'blob',
        'bundle',
        'data',
        'file',
        'http',
        'https',
        'opfs'
      ]
    });
    console.log('Saved scene string:', sceneString.length, 'characters');
  }
}

export default Example;
