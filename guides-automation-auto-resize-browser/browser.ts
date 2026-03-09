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
 * CE.SDK Plugin: Auto-Resize Guide
 *
 * Demonstrates block sizing modes and responsive layout patterns:
 * - Setting width and height modes (Absolute, Percent, Auto)
 * - Reading computed frame dimensions after layout
 * - Centering text blocks based on computed dimensions
 * - Creating responsive layouts with percentage-based sizing
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


    // Create a text block with Auto sizing mode
    // Auto mode makes the block expand to fit its content
    const titleBlock = engine.block.create('text');
    engine.block.replaceText(titleBlock, 'Auto-Resize Demo');
    engine.block.setFloat(titleBlock, 'text/fontSize', 64);

    // Set width and height modes to Auto
    // The block will automatically size to fit the text content
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);

    // Read computed frame dimensions after layout
    // getFrameWidth/getFrameHeight return the actual rendered size
    const titleWidth = engine.block.getFrameWidth(titleBlock);
    const titleHeight = engine.block.getFrameHeight(titleBlock);

    console.log(
      `Title dimensions: ${titleWidth.toFixed(0)}x${titleHeight.toFixed(
        0
      )} pixels`
    );

    // Calculate centered position using frame dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const centerX = (pageWidth - titleWidth) / 2;
    const centerY = (pageHeight - titleHeight) / 2 - 100; // Offset up for layout

    // Position the title at center
    engine.block.setPositionX(titleBlock, centerX);
    engine.block.setPositionY(titleBlock, centerY);

    // Create a block using Percent mode for responsive sizing
    // Percent mode sizes the block relative to its parent
    const backgroundBlock = engine.block.create('graphic');
    engine.block.setShape(backgroundBlock, engine.block.createShape('rect'));
    const fill = engine.block.createFill('color');
    engine.block.setColor(fill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 0.3
    });
    engine.block.setFill(backgroundBlock, fill);

    // Set to Percent mode - values are normalized (0-1)
    engine.block.setWidthMode(backgroundBlock, 'Percent');
    engine.block.setHeightMode(backgroundBlock, 'Percent');
    engine.block.setWidth(backgroundBlock, 0.8); // 80% of parent width
    engine.block.setHeight(backgroundBlock, 0.3); // 30% of parent height

    // Center the background block
    engine.block.setPositionX(backgroundBlock, pageWidth * 0.1); // 10% margin
    engine.block.setPositionY(backgroundBlock, pageHeight * 0.6);
    engine.block.appendChild(page, backgroundBlock);

    // Create a subtitle with Auto mode
    const subtitleBlock = engine.block.create('text');
    engine.block.replaceText(
      subtitleBlock,
      'Text automatically sizes to fit content'
    );
    engine.block.setFloat(subtitleBlock, 'text/fontSize', 32);
    engine.block.setWidthMode(subtitleBlock, 'Auto');
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.appendChild(page, subtitleBlock);

    // Read computed dimensions and center
    const subtitleWidth = engine.block.getFrameWidth(subtitleBlock);
    const subtitleCenterX = (pageWidth - subtitleWidth) / 2;
    engine.block.setPositionX(subtitleBlock, subtitleCenterX);
    engine.block.setPositionY(subtitleBlock, pageHeight * 0.7);

    // Verify sizing modes
    const titleWidthMode = engine.block.getWidthMode(titleBlock);
    const titleHeightMode = engine.block.getHeightMode(titleBlock);
    const bgWidthMode = engine.block.getWidthMode(backgroundBlock);
    const bgHeightMode = engine.block.getHeightMode(backgroundBlock);

    console.log(
      `Title modes: width=${titleWidthMode}, height=${titleHeightMode}`
    );
    console.log(
      `Background modes: width=${bgWidthMode}, height=${bgHeightMode}`
    );

    // Select the title block to show the auto-sized result
    engine.block.select(titleBlock);

    console.log(
      'Auto-resize guide initialized. Try changing text content to see auto-sizing in action.'
    );
  }
}

export default Example;
