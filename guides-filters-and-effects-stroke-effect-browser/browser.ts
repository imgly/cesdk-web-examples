import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
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
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Stroke Effect Guide
 *
 * Draws three strokes along an ellipse mask:
 * - Over the image
 * - On transparency
 * - Along half of the mask path
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
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
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
      page: { width: 1200, height: 400, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;

    // Adds a 360 x 270 image block to the page at a position
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const addImageBlock = async (x: number, y: number) => {
      const block = await engine.block.addImage(imageUri, {
        size: { width: 360, height: 270 }
      });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, x);
      engine.block.setPositionY(block, y);
      return block;
    };

    const originalBlock = await addImageBlock(30, 65);
    const transparentBlock = await addImageBlock(420, 65);
    const trimmedBlock = await addImageBlock(810, 65);

    // An ellipse mask in the 'None' mode gives the stroke a path
    // and keeps the whole block
    const addEllipseMask = (block: number) => {
      const mask = engine.block.createMask();
      engine.block.setShape(mask, engine.block.createShape('ellipse'));
      engine.block.setEnum(mask, 'mask/mode', 'None');
      engine.block.appendMask(block, mask);
    };

    addEllipseMask(originalBlock);
    addEllipseMask(transparentBlock);
    addEllipseMask(trimmedBlock);

    // A hard yellow brush with a radius of 6 design units, so 12 wide
    const strokeColor = { r: 1, g: 0.8, b: 0.1, a: 1 };
    const stroke = engine.block.createEffect('stroke');
    engine.block.setColor(stroke, 'effect/stroke/color', strokeColor);
    engine.block.setFloat(stroke, 'effect/stroke/brushSize', 6);
    engine.block.setFloat(stroke, 'effect/stroke/hardness', 1);
    engine.block.appendEffect(originalBlock, stroke);

    // Stroke the first mask and draw only the stroke, not the image
    const transparentStroke = engine.block.createEffect('stroke');
    engine.block.setInt(transparentStroke, 'effect/stroke/maskIndex', 0);
    engine.block.setBool(transparentStroke, 'effect/stroke/allMasks', false);
    engine.block.setEnum(
      transparentStroke,
      'effect/stroke/paintStyle',
      'OnTransparent'
    );
    engine.block.setColor(
      transparentStroke,
      'effect/stroke/color',
      strokeColor
    );
    engine.block.setFloat(transparentStroke, 'effect/stroke/brushSize', 6);
    engine.block.appendEffect(transparentBlock, transparentStroke);

    // Draw only the first half of the mask path
    const trimmedStroke = engine.block.createEffect('stroke');
    engine.block.setFloat(trimmedStroke, 'effect/stroke/start', 0);
    engine.block.setFloat(trimmedStroke, 'effect/stroke/end', 0.5);
    engine.block.setColor(trimmedStroke, 'effect/stroke/color', strokeColor);
    engine.block.setFloat(trimmedStroke, 'effect/stroke/brushSize', 6);
    engine.block.appendEffect(trimmedBlock, trimmedStroke);
  }
}

export default Example;
