import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
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
 * CE.SDK Plugin: Compound Shapes Guide
 *
 * Demonstrates how to build one outline from several shapes:
 * - Creating a compound shape and adding subshapes
 * - Placing, sizing and rotating a subshape
 * - Combining subshapes with a mode and a fill rule
 * - Inserting, reading and removing subshapes
 * - Animating a subshape
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
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;

    // A graphic block draws the outline of its compound shape with its fill
    const badge = engine.block.create('graphic');
    const badgeFill = engine.block.createFill('color');
    engine.block.setColor(badgeFill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    engine.block.setFill(badge, badgeFill);
    engine.block.setWidth(badge, 300);
    engine.block.setHeight(badge, 300);
    engine.block.setPositionX(badge, 75);
    engine.block.setPositionY(badge, 150);
    engine.block.appendChild(page, badge);

    const compound = engine.block.createShape('compound');
    engine.block.setShape(badge, compound);

    // The first subshape is the base. A new subshape fills the reference box.
    const circle = engine.block.createShape('ellipse');
    engine.block.appendSubshape(compound, circle);

    const diamond = engine.block.createShape('rect');
    engine.block.appendSubshape(compound, diamond);

    // A 40 by 40 square, centered in the 100 by 100 reference box and turned
    // into a diamond. Rotation turns the box about its anchor.
    engine.block.setFloat(diamond, 'shape/width', 40);
    engine.block.setFloat(diamond, 'shape/height', 40);
    engine.block.setFloat(diamond, 'shape/anchor/x', 20);
    engine.block.setFloat(diamond, 'shape/anchor/y', 20);
    engine.block.setFloat(diamond, 'shape/position/x', 50);
    engine.block.setFloat(diamond, 'shape/position/y', 50);
    engine.block.setFloat(diamond, 'shape/rotation', 45);

    // Cut every later subshape out of the base circle
    engine.block.setEnum(compound, 'shape/compound/mode', 'Subtract');

    // Insert a small dot between the circle and the diamond
    const dot = engine.block.createShape('ellipse');
    engine.block.setFloat(dot, 'shape/width', 16);
    engine.block.setFloat(dot, 'shape/height', 16);
    engine.block.setFloat(dot, 'shape/position/x', 42);
    engine.block.setFloat(dot, 'shape/position/y', 8);
    engine.block.insertSubshape(compound, dot, 1);
    console.log(engine.block.getSubshapes(compound)); // [circle, dot, diamond]

    // Removing a subshape does not destroy it
    engine.block.removeSubshape(compound, 1);
    console.log(engine.block.isValid(dot)); // true
    engine.block.destroy(dot);

    // Two overlapping squares in Merge mode. EvenOdd makes the overlap a hole.
    const squares = engine.block.create('graphic');
    const squaresFill = engine.block.createFill('color');
    engine.block.setColor(squaresFill, 'fill/color/value', {
      r: 0.95,
      g: 0.5,
      b: 0.1,
      a: 1
    });
    engine.block.setFill(squares, squaresFill);
    engine.block.setWidth(squares, 300);
    engine.block.setHeight(squares, 300);
    engine.block.setPositionX(squares, 425);
    engine.block.setPositionY(squares, 150);
    engine.block.appendChild(page, squares);

    const squaresCompound = engine.block.createShape('compound');
    engine.block.setShape(squares, squaresCompound);

    const firstSquare = engine.block.createShape('rect');
    engine.block.setFloat(firstSquare, 'shape/width', 60);
    engine.block.setFloat(firstSquare, 'shape/height', 60);
    engine.block.appendSubshape(squaresCompound, firstSquare);

    const secondSquare = engine.block.createShape('rect');
    engine.block.setFloat(secondSquare, 'shape/width', 60);
    engine.block.setFloat(secondSquare, 'shape/height', 60);
    engine.block.setFloat(secondSquare, 'shape/position/x', 40);
    engine.block.setFloat(secondSquare, 'shape/position/y', 40);
    engine.block.appendSubshape(squaresCompound, secondSquare);

    engine.block.setEnum(squaresCompound, 'shape/compound/fillRule', 'EvenOdd');

    // Slide the second square to the top left corner and back over the
    // duration of the graphic block
    engine.block.setKeyframes(secondSquare, 'shape/position', [
      { time: 0, value: { type: 'Vec2', value: { x: 40, y: 40 } } },
      { time: 0.5, value: { type: 'Vec2', value: { x: 0, y: 0 } } },
      { time: 1, value: { type: 'Vec2', value: { x: 40, y: 40 } } }
    ]);

    const line = engine.block.createShape('line');
    try {
      engine.block.appendSubshape(compound, line);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.SUBSHAPE_TYPE_UNSUPPORTED'
      }
    }
    engine.block.destroy(line);

    await engine.scene.zoomToBlock(page, { padding: 40 });
  }
}

export default Example;
