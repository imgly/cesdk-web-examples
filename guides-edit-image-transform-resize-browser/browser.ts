import CreativeEditorSDK, {
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

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

class Example implements EditorPlugin {
  name = 'guides-edit-image-transform-resize-browser';

  version = CreativeEditorSDK.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

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
      page: { width: 800, height: 500, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Demo 1: Absolute Sizing - Fixed dimensions
    const absoluteImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 180, height: 180 }
      }
    );
    engine.block.appendChild(page, absoluteImage);
    engine.block.setPositionX(absoluteImage, 20);
    engine.block.setPositionY(absoluteImage, 80);

    // Set explicit dimensions using setSize
    engine.block.setSize(absoluteImage, 180, 180, {
      sizeMode: 'Absolute'
    });

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Absolute');
    engine.block.setFloat(text1, 'text/fontSize', 28);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 180);
    engine.block.setPositionX(text1, 20);
    engine.block.setPositionY(text1, 280);
    engine.block.appendChild(page, text1);

    // Demo 2: Percentage Sizing - Responsive layout
    const percentImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 180, height: 180 }
      }
    );
    engine.block.appendChild(page, percentImage);
    engine.block.setPositionX(percentImage, 220);
    engine.block.setPositionY(percentImage, 80);

    // Set size mode to percentage for responsive sizing
    engine.block.setWidthMode(percentImage, 'Percent');
    engine.block.setHeightMode(percentImage, 'Percent');
    // Values 0.0 to 1.0 represent percentage of parent
    engine.block.setWidth(percentImage, 0.225);
    engine.block.setHeight(percentImage, 0.36);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Percentage');
    engine.block.setFloat(text2, 'text/fontSize', 28);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 180);
    engine.block.setPositionX(text2, 220);
    engine.block.setPositionY(text2, 280);
    engine.block.appendChild(page, text2);

    // Demo 3: Resized with maintainCrop
    const cropImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: { width: 180, height: 180 }
      }
    );
    engine.block.appendChild(page, cropImage);
    engine.block.setPositionX(cropImage, 420);
    engine.block.setPositionY(cropImage, 80);

    // Resize while preserving crop settings
    engine.block.setWidth(cropImage, 180, true);
    engine.block.setHeight(cropImage, 180, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Maintain Crop');
    engine.block.setFloat(text3, 'text/fontSize', 28);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 180);
    engine.block.setPositionX(text3, 420);
    engine.block.setPositionY(text3, 280);
    engine.block.appendChild(page, text3);

    // Get current dimensions
    const currentWidth = engine.block.getWidth(absoluteImage);
    const currentHeight = engine.block.getHeight(absoluteImage);
    const widthMode = engine.block.getWidthMode(absoluteImage);
    const heightMode = engine.block.getHeightMode(absoluteImage);
    console.log('Current dimensions:', currentWidth, 'x', currentHeight);
    console.log('Size modes:', widthMode, heightMode);

    // Get calculated frame dimensions after layout
    const frameWidth = engine.block.getFrameWidth(absoluteImage);
    const frameHeight = engine.block.getFrameHeight(absoluteImage);
    console.log('Frame dimensions:', frameWidth, 'x', frameHeight);

    // Title text at top
    const titleText = engine.block.create('text');
    engine.block.setString(titleText, 'text/text', 'Image Resize Examples');
    engine.block.setFloat(titleText, 'text/fontSize', 36);
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleText, 800);
    engine.block.setPositionX(titleText, 0);
    engine.block.setPositionY(titleText, 20);
    engine.block.appendChild(page, titleText);
  }
}

export default Example;
