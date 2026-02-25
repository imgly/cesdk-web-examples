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
  name = 'guides-edit-image-transform-move-browser';

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

    // Demo 1: Movable Image - Can be freely repositioned by user
    const movableImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        size: { width: 200, height: 200 }
      }
    );
    engine.block.appendChild(page, movableImage);
    engine.block.setPositionX(movableImage, 0);
    engine.block.setPositionY(movableImage, 100);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Movable');
    engine.block.setFloat(text1, 'text/fontSize', 32);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 200);
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 360);
    engine.block.appendChild(page, text1);

    // Demo 2: Percentage Positioning - Responsive layout
    const percentImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      {
        size: { width: 200, height: 200 }
      }
    );
    engine.block.appendChild(page, percentImage);

    // Set position mode to percentage (0.0 to 1.0)
    engine.block.setPositionXMode(percentImage, 'Percent');
    engine.block.setPositionYMode(percentImage, 'Percent');

    // Position at 37.5% from left (300px), 30% from top (150px)
    engine.block.setPositionX(percentImage, 0.375);
    engine.block.setPositionY(percentImage, 0.3);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Percentage');
    engine.block.setFloat(text2, 'text/fontSize', 32);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 200);
    engine.block.setPositionX(text2, 300);
    engine.block.setPositionY(text2, 360);
    engine.block.appendChild(page, text2);

    // Demo 3: Locked Image - Cannot be moved, rotated, or scaled
    const lockedImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_6.jpg',
      {
        size: { width: 200, height: 200 }
      }
    );
    engine.block.appendChild(page, lockedImage);
    engine.block.setPositionX(lockedImage, 550);
    engine.block.setPositionY(lockedImage, 150);

    // Lock the transform to prevent user interaction
    engine.block.setBool(lockedImage, 'transformLocked', true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Locked');
    engine.block.setFloat(text3, 'text/fontSize', 32);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 200);
    engine.block.setPositionX(text3, 550);
    engine.block.setPositionY(text3, 360);
    engine.block.appendChild(page, text3);

    // Get current position values
    const currentX = engine.block.getPositionX(movableImage);
    const currentY = engine.block.getPositionY(movableImage);
    console.log('Current position:', currentX, currentY);

    // Move relative to current position
    const offsetX = engine.block.getPositionX(movableImage);
    const offsetY = engine.block.getPositionY(movableImage);
    engine.block.setPositionX(movableImage, offsetX + 50);
    engine.block.setPositionY(movableImage, offsetY + 50);
  }
}

export default Example;
