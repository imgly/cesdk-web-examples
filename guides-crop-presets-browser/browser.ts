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

/**
 * CE.SDK Plugin: Custom Crop Presets
 *
 * Demonstrates how to create and configure custom crop presets:
 * - Creating a local asset source for crop presets
 * - Adding free aspect ratio, fixed aspect ratio, and fixed size presets
 * - Configuring the UI to use custom crop presets
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    );

    const engine = cesdk.engine;

    // Add a custom crop preset asset source.
    engine.asset.addLocalSource('my-custom-crop-presets');

    engine.asset.addAssetToSource(
      'my-custom-crop-presets',
      {
        id: 'aspect-ratio-free',
        label: {
          en: 'Free'
        },
        meta: {
          width: 80,
          height: 120,
          thumbUri: `${window.location.protocol}//${window.location.host}/ratio-free.png`
        },
        payload: {
          transformPreset: {
            type: 'FreeAspectRatio'
          }
        }
      }
    );

    engine.asset.addAssetToSource(
      'my-custom-crop-presets',
      {
        id: 'aspect-ratio-16-9',
        label: {
          en: '16:9'
        },
        meta: {
          width: 80,
          height: 120,
          thumbUri: `${window.location.protocol}//${window.location.host}/ratio-16-9.png`
        },
        payload: {
          transformPreset: {
            type: 'FixedAspectRatio',
            width: 16,
            height: 9
          }
        }
      }
    );

    engine.asset.addAssetToSource(
      'my-custom-crop-presets',
      {
        id: 'din-a1-portrait',
        label: {
          en: 'DIN A1 Portrait'
        },
        meta: {
          width: 80,
          height: 120,
          thumbUri: `${window.location.protocol}//${window.location.host}/din-a1-portrait.png`
        },
        payload: {
          transformPreset: {
            type: 'FixedSize',
            width: 594,
            height: 841,
            designUnit: 'Millimeter'
          }
        }
      }
    );

    // Update crop presets library entry
    cesdk.ui.updateAssetLibraryEntry('ly.img.cropPresets', {
      sourceIds: [
        // 'ly.img.crop.presets',
        'my-custom-crop-presets'
      ]
    });

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    // Add an image and enable crop mode to show the presets
    const page = engine.scene.getCurrentPage();
    if (page == null) return;

    // Get page dimensions for relative sizing
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create an image block at ~50% of page size
    const imageBlock = engine.block.create('graphic');
    engine.block.appendChild(page, imageBlock);

    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    const imageWidth = pageWidth * 0.5;
    const imageHeight = pageHeight * 0.5;
    engine.block.setWidth(imageBlock, imageWidth);
    engine.block.setHeight(imageBlock, imageHeight);

    // Center the image on the page
    engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
    engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    // Select the image and enter crop mode
    engine.block.select(imageBlock);
    engine.editor.setEditMode('Crop');
  }
}

export default Example;
