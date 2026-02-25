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
 * CE.SDK Plugin: Insert Images Guide
 *
 * Demonstrates inserting images into a scene programmatically:
 * - Using the convenience API (addImage)
 * - Manual construction with graphic blocks and image fills
 * - Configuring image sizing, positioning, and content fill mode
 * - Applying corner radius for rounded images
 * - Working with multiple images
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
    const page = engine.block.findByType('page')[0];


    // Sample image URL for demonstrations
    const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Add an image using the convenience API
    // This automatically creates a graphic block with rect shape and image fill
    const imageBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 50,
      y: 50
    });
    engine.block.appendChild(page, imageBlock);
    console.log('✓ Added image using convenience API');

    // Manually construct an image block for more control
    const manualBlock = engine.block.create('graphic');

    // Create and attach a rectangular shape
    const shape = engine.block.createShape('rect');
    engine.block.setShape(manualBlock, shape);

    // Create and configure the image fill
    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', imageUrl);
    engine.block.setFill(manualBlock, fill);

    // Set dimensions and position
    engine.block.setWidth(manualBlock, 200);
    engine.block.setHeight(manualBlock, 150);
    engine.block.setPositionX(manualBlock, 300);
    engine.block.setPositionY(manualBlock, 50);
    engine.block.appendChild(page, manualBlock);
    console.log('✓ Added image using manual construction');

    // Set content fill mode to control how images scale within bounds
    // 'Contain' preserves aspect ratio and fits within bounds
    // 'Cover' preserves aspect ratio and fills bounds
    const containBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 550,
      y: 50
    });
    engine.block.appendChild(page, containBlock);

    if (engine.block.supportsContentFillMode(containBlock)) {
      engine.block.setContentFillMode(containBlock, 'Contain');
      console.log('✓ Applied Contain fill mode');
    }

    // Apply corner radius to create rounded corners on an image
    const roundedBlock = await engine.block.addImage(imageUrl, {
      size: { width: 200, height: 150 },
      x: 50,
      y: 250,
      cornerRadius: 20
    });
    engine.block.appendChild(page, roundedBlock);
    console.log('✓ Added image with rounded corners');

    // Insert multiple images with calculated positioning
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg'
    ];

    for (let i = 0; i < imageUrls.length; i++) {
      const block = await engine.block.addImage(imageUrls[i], {
        size: { width: 150, height: 100 },
        x: 300 + i * 160,
        y: 250
      });
      engine.block.appendChild(page, block);
    }
    console.log('✓ Added multiple images');

    // Select the first image block to show it in the inspector
    engine.block.setSelected(imageBlock, true);

    // Zoom to show all content
    cesdk.engine.scene.zoomToBlock(page, {
      padding: {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40
      }
    });
  }
}

export default Example;
