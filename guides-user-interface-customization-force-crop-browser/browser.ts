import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
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

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const page = engine.block.findByType('page')[0];

    // Add an image to demonstrate force crop
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri);
    engine.block.appendChild(page, imageBlock);

    // Position and size the image to fill the page
    engine.block.setWidth(imageBlock, 800);
    engine.block.setHeight(imageBlock, 600);
    engine.block.setPositionX(imageBlock, 0);
    engine.block.setPositionY(imageBlock, 0);

    // Create a custom crop preset with a fixed aspect ratio (4:5 for portrait)
    engine.asset.addAssetToSource('ly.img.crop.presets', {
      id: 'instagram-portrait',
      label: { en: 'Portrait Post (4:5)' },
      payload: {
        transformPreset: {
          type: 'FixedAspectRatio',
          width: 4,
          height: 5,
          designUnit: 'Pixel'
        }
      }
    });

    // Create a custom crop preset with fixed dimensions
    engine.asset.addAssetToSource('ly.img.crop.presets', {
      id: 'profile-photo',
      label: { en: 'Profile Photo (400x400)' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 400,
          height: 400,
          designUnit: 'Pixel'
        }
      }
    });

    // Select the image block to demonstrate force crop
    engine.block.select(imageBlock);

    // Apply force crop with 'ifNeeded' mode
    // This will only enter crop mode if dimensions differ from target
    await cesdk.ui.applyForceCrop(imageBlock, {
      sourceId: 'ly.img.crop.presets',
      presetId: 'instagram-portrait',
      mode: 'ifNeeded'
    });

    // If Needed mode - only enters crop mode when dimensions differ
    // await cesdk.ui.applyForceCrop(imageBlock, {
    //   sourceId: 'ly.img.crop.presets',
    //   presetId: 'instagram-portrait',
    //   mode: 'ifNeeded'
    // });

    // Example of silent mode - applies crop without showing UI
    // await cesdk.ui.applyForceCrop(imageBlock, {
    //   sourceId: 'ly.img.crop.presets',
    //   presetId: 'profile-photo',
    //   mode: 'silent'
    // });

    // Example of always mode - always enters crop mode
    // await cesdk.ui.applyForceCrop(imageBlock, {
    //   sourceId: 'ly.img.crop.presets',
    //   presetId: 'instagram-portrait',
    //   mode: 'always'
    // });

    console.log('Force crop example loaded successfully!');
  }
}

export default Example;
