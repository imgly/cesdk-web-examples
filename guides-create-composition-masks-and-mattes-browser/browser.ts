import type {
  DesignBlockId,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import { isEngineError } from '@cesdk/cesdk-js';

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
 * CE.SDK Plugin: Masks and Mattes Guide
 *
 * Demonstrates how to cut blocks down with masks and track mattes:
 * - Creating a mask with a shape and attaching it to a block
 * - Mask feather, expansion, opacity and inversion
 * - Combining masks with mask modes
 * - Reading, removing and inserting masks
 * - Masking a block with the luminance of another block
 * - The matte source rules
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
      page: { width: 1500, height: 500, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;

    // A 400 by 400 square graphic at a given x position
    const addSquare = (x: number, fill: DesignBlockId): DesignBlockId => {
      const block = engine.block.create('graphic');
      engine.block.setShape(block, engine.block.createShape('rect'));
      engine.block.setFill(block, fill);
      engine.block.setWidth(block, 400);
      engine.block.setHeight(block, 400);
      engine.block.setPositionX(block, x);
      engine.block.setPositionY(block, 50);
      engine.block.appendChild(page, block);
      return block;
    };

    const purple = engine.block.createFill('color');
    engine.block.setColor(purple, 'fill/color/value', {
      r: 0.5,
      g: 0.2,
      b: 0.9,
      a: 1
    });
    const ringBlock = addSquare(50, purple);

    console.log(engine.block.supportsMasks(ringBlock)); // true
    console.log(engine.block.supportsMasks(page)); // false

    // The ellipse fills the frame of the masked block
    const outerMask = engine.block.createMask();
    engine.block.setShape(outerMask, engine.block.createShape('ellipse'));
    engine.block.appendMask(ringBlock, outerMask);

    // Soften the edge by 20 units and let 80% of the block show through
    engine.block.setFloat(outerMask, 'mask/feather', 20);
    engine.block.setFloat(outerMask, 'mask/opacity', 0.8);

    // Shrink a second ellipse by 100 units and subtract it to cut a ring
    const innerMask = engine.block.createMask();
    engine.block.setShape(innerMask, engine.block.createShape('ellipse'));
    engine.block.setFloat(innerMask, 'mask/expansion', -100);
    engine.block.setEnum(innerMask, 'mask/mode', 'Subtract');
    engine.block.appendMask(ringBlock, innerMask);

    const teal = engine.block.createFill('color');
    engine.block.setColor(teal, 'fill/color/value', {
      r: 0,
      g: 0.6,
      b: 0.6,
      a: 1
    });
    const starBlock = addSquare(550, teal);

    // An inverted mask keeps the area outside its shape: a star-shaped hole
    const starMask = engine.block.createMask();
    engine.block.setShape(starMask, engine.block.createShape('star'));
    engine.block.setBool(starMask, 'mask/inverted', true);
    engine.block.appendMask(starBlock, starMask);

    console.log(engine.block.getMasks(ringBlock)); // [outerMask, innerMask]

    // Removing a mask does not destroy it
    engine.block.removeMask(ringBlock, 1);
    console.log(engine.block.isValid(innerMask)); // true

    // Insert it again after the outer mask
    engine.block.insertMask(ringBlock, innerMask, 1);

    const orange = engine.block.createFill('color');
    engine.block.setColor(orange, 'fill/color/value', {
      r: 1,
      g: 0.5,
      b: 0,
      a: 1
    });
    const target = addSquare(1050, orange);

    // The matte source: a gradient from white at the top to black at the bottom
    const gradient = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradient, 'fill/gradient/colors', [
      { color: { r: 1, g: 1, b: 1, a: 1 }, stop: 0 },
      { color: { r: 0, g: 0, b: 0, a: 1 }, stop: 1 }
    ]);
    const source = addSquare(1050, gradient);

    // The target shows where the source is bright. The source is not drawn.
    engine.block.setMatte(target, source, 'Luma');

    console.log(engine.block.getMatte(target)); // { source, mode: 'Luma' }
    console.log(engine.block.getMatte(ringBlock)); // null

    try {
      // A block cannot use itself as its matte source
      engine.block.setMatte(target, target);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.MATTE_SOURCE_INVALID'
      }
    }

    // Zoom to fit the composition
    await engine.scene.zoomToBlock(page, {
      padding: { left: 40, top: 40, right: 40, bottom: 40 }
    });
  }
}

export default Example;
