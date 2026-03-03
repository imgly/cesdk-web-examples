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

    const engine = cesdk.engine;

    // Get the page from the scene
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Add an image using the convenience API
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: 300, height: 200 }
    });
    engine.block.appendChild(page, imageBlock);
    engine.block.setPositionX(imageBlock, 50);
    engine.block.setPositionY(imageBlock, 50);

    // Verify the block supports cropping before applying crop operations
    const supportsCrop = engine.block.supportsCrop(imageBlock);
    console.log('Block supports crop:', supportsCrop);

    // Check if the block supports content fill modes
    const supportsFillMode = engine.block.supportsContentFillMode(imageBlock);
    console.log('Supports content fill mode:', supportsFillMode);

    // Get the current content fill mode
    const currentMode = engine.block.getContentFillMode(imageBlock);
    console.log('Current fill mode:', currentMode);

    // Set content fill mode - options are 'Crop', 'Cover', 'Contain'
    // 'Cover' automatically scales and positions to fill the entire frame
    engine.block.setContentFillMode(imageBlock, 'Cover');

    // Create another image block to demonstrate crop scaling
    const scaleBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 200 }
    });
    engine.block.appendChild(page, scaleBlock);
    engine.block.setPositionX(scaleBlock, 400);
    engine.block.setPositionY(scaleBlock, 50);

    // Set content fill mode to 'Crop' for manual control
    engine.block.setContentFillMode(scaleBlock, 'Crop');

    // Scale the content within the crop frame
    // Values > 1 zoom in, values < 1 zoom out
    engine.block.setCropScaleX(scaleBlock, 1.5);
    engine.block.setCropScaleY(scaleBlock, 1.5);

    // Or use uniform scaling from center
    engine.block.setCropScaleRatio(scaleBlock, 1.2);

    // Get the current scale values
    const scaleX = engine.block.getCropScaleX(scaleBlock);
    const scaleY = engine.block.getCropScaleY(scaleBlock);
    const scaleRatio = engine.block.getCropScaleRatio(scaleBlock);
    console.log('Crop scale:', { scaleX, scaleY, scaleRatio });

    // Pan the content within the crop frame using translation
    // Values are in percentage of the crop frame dimensions
    engine.block.setCropTranslationX(scaleBlock, 0.1); // Move 10% right
    engine.block.setCropTranslationY(scaleBlock, -0.1); // Move 10% up

    // Get the current translation values
    const translationX = engine.block.getCropTranslationX(scaleBlock);
    const translationY = engine.block.getCropTranslationY(scaleBlock);
    console.log('Crop translation:', { translationX, translationY });

    // Ensure content covers the entire frame without gaps
    // The minScaleRatio parameter sets the minimum scale allowed
    const adjustedRatio = engine.block.adjustCropToFillFrame(scaleBlock, 1.0);
    console.log('Adjusted scale ratio:', adjustedRatio);

    // Create an image block to demonstrate crop rotation
    const rotateBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 200 }
    });
    engine.block.appendChild(page, rotateBlock);
    engine.block.setPositionX(rotateBlock, 50);
    engine.block.setPositionY(rotateBlock, 300);
    engine.block.setContentFillMode(rotateBlock, 'Crop');

    // Rotate the content within the crop frame (in radians)
    // Math.PI / 4 = 45 degrees
    engine.block.setCropRotation(rotateBlock, Math.PI / 12);

    // Get the current rotation
    const rotation = engine.block.getCropRotation(rotateBlock);
    console.log('Crop rotation (radians):', rotation);

    // Ensure content still fills the frame after rotation
    engine.block.adjustCropToFillFrame(rotateBlock, 1.0);

    // Create an image block to demonstrate flipping
    const flipBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 200 }
    });
    engine.block.appendChild(page, flipBlock);
    engine.block.setPositionX(flipBlock, 300);
    engine.block.setPositionY(flipBlock, 300);
    engine.block.setContentFillMode(flipBlock, 'Crop');

    // Flip the content horizontally
    engine.block.flipCropHorizontal(flipBlock);

    // Create an image block to demonstrate aspect ratio locking
    const lockBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 200 }
    });
    engine.block.appendChild(page, lockBlock);
    engine.block.setPositionX(lockBlock, 550);
    engine.block.setPositionY(lockBlock, 300);
    engine.block.setContentFillMode(lockBlock, 'Crop');

    // Lock the crop aspect ratio - when locked, crop handles maintain
    // the current aspect ratio during resize operations
    engine.block.setCropAspectRatioLocked(lockBlock, true);

    // Check if aspect ratio is locked
    const isLocked = engine.block.isCropAspectRatioLocked(lockBlock);
    console.log('Aspect ratio locked:', isLocked);

    // Reset crop to default state (sets content fill mode to 'Cover')
    engine.block.resetCrop(lockBlock);

    // Select the first image block to show it in the UI
    engine.block.select(imageBlock);

    // Zoom to page for better visibility
    cesdk.engine.scene.zoomToBlock(page, 0.5, 0.5, 0.9);
  }
}

export default Example;
