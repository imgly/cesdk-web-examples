import type {
  EditorPlugin,
  EditorPluginContext,
  RGBAColor
} from '@cesdk/cesdk-js';
import { isEngineError } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
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
import { VideoEditorConfig } from './video-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Shape Modifiers Guide
 *
 * Demonstrates how to change the path of a shape with modifiers:
 * - Creating a modifier and attaching it to a shape
 * - Trimming an outline and animating the trim
 * - Repeating a shape with a repeater
 * - Rounding, zig zag, pucker and bloat, twist and offset
 * - Controlling the modifier order
 * - Reading, finding, removing and destroying modifiers
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(
      new PagePresetsAssetSource({
        include: [
          'ly.img.page.presets.instagram.*',
          'ly.img.page.presets.facebook.*',
          'ly.img.page.presets.x.*',
          'ly.img.page.presets.linkedin.*',
          'ly.img.page.presets.pinterest.*',
          'ly.img.page.presets.tiktok.*',
          'ly.img.page.presets.youtube.*',
          'ly.img.page.presets.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      layout: 'DepthStack',
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;

    // Adds a 5 second graphic with a shape and a color fill to the page
    const addGraphic = (
      shapeType: 'star' | 'rect',
      x: number,
      y: number,
      width: number,
      height: number,
      color: RGBAColor
    ) => {
      const graphic = engine.block.create('graphic');
      engine.block.setShape(graphic, engine.block.createShape(shapeType));
      const fill = engine.block.createFill('color');
      engine.block.setColor(fill, 'fill/color/value', color);
      engine.block.setFill(graphic, fill);
      engine.block.setWidth(graphic, width);
      engine.block.setHeight(graphic, height);
      engine.block.setPositionX(graphic, x);
      engine.block.setPositionY(graphic, y);
      engine.block.setDuration(graphic, 5);
      engine.block.appendChild(page, graphic);
      return graphic;
    };

    const orange = { r: 1, g: 0.5, b: 0, a: 1 };
    const outline = addGraphic('star', 120, 360, 360, 360, orange);

    // Modifiers belong to the shape block, not to the graphic block
    const outlineShape = engine.block.getShape(outline);
    console.log(engine.block.supportsModifiers(outlineShape)); // true
    console.log(engine.block.supportsModifiers(outline)); // false

    const trim = engine.block.createModifier('trim');
    engine.block.appendModifier(outlineShape, trim);

    // Draw the outline only: no fill and a thick stroke
    engine.block.setFillEnabled(outline, false);
    engine.block.setStrokeEnabled(outline, true);
    engine.block.setStrokeWidth(outline, 16);
    engine.block.setStrokeColor(outline, orange);

    // Keep the first 75% of the path, moved by an eighth of the path length
    engine.block.setFloat(trim, 'modifier/trim/start', 0);
    engine.block.setFloat(trim, 'modifier/trim/end', 0.75);
    engine.block.setFloat(trim, 'modifier/trim/offset', 0.125);
    // 'Simultaneous' trims each contour on its own, 'Individual' trims all contours as one path
    engine.block.setEnum(trim, 'modifier/trim/mode', 'Simultaneous');

    // Draw the whole outline during the first 3 seconds of the 5 second block
    engine.block.setKeyframes(trim, 'modifier/trim/end', [
      {
        time: 0,
        value: { type: 'Float', value: 0 },
        easing: { type: 'Preset', preset: 'EaseInOut' }
      },
      { time: 0.6, value: { type: 'Float', value: 1 } }
    ]);

    // A 40 x 140 bar, repeated around a point 220 units below its top edge
    const bar = addGraphic('rect', 720, 320, 40, 140, {
      r: 0.2,
      g: 0.5,
      b: 1,
      a: 1
    });
    const repeater = engine.block.createModifier('repeater');
    engine.block.setFloat(repeater, 'modifier/repeater/copies', 12);
    // Each copy turns 30 degrees further about the anchor and does not move
    engine.block.setFloat(repeater, 'modifier/repeater/anchorX', 20);
    engine.block.setFloat(repeater, 'modifier/repeater/anchorY', 220);
    engine.block.setFloat(repeater, 'modifier/repeater/rotation', 30);
    engine.block.setFloat(repeater, 'modifier/repeater/positionX', 0);
    engine.block.setFloat(repeater, 'modifier/repeater/positionY', 0);
    // The copies fade from full opacity towards 10%
    engine.block.setFloat(repeater, 'modifier/repeater/startOpacity', 1);
    engine.block.setFloat(repeater, 'modifier/repeater/endOpacity', 0.1);
    // 'Above' draws each copy on top of the copy before it
    engine.block.setEnum(repeater, 'modifier/repeater/composite', 'Above');
    engine.block.appendModifier(engine.block.getShape(bar), repeater);

    // Grow the ring from 1 to 12 bars
    engine.block.setKeyframes(repeater, 'modifier/repeater/copies', [
      { time: 0, value: { type: 'Float', value: 1 } },
      { time: 0.8, value: { type: 'Float', value: 12 } }
    ]);

    const badge = addGraphic('rect', 1000, 360, 360, 360, {
      r: 0.5,
      g: 0.2,
      b: 0.9,
      a: 1
    });
    const badgeShape = engine.block.getShape(badge);

    // Smooth peaks and valleys, 6 per side, 12 units from the path
    const zigzag = engine.block.createModifier('zigzag');
    engine.block.setFloat(zigzag, 'modifier/zigzag/size', 12);
    engine.block.setFloat(zigzag, 'modifier/zigzag/ridges', 6);
    engine.block.setEnum(zigzag, 'modifier/zigzag/pointType', 'Smooth');
    engine.block.appendModifier(badgeShape, zigzag);

    // Insert the rounding at index 0, so it applies before the zig zag
    const roundCorners = engine.block.createModifier('round_corners');
    engine.block.setFloat(roundCorners, 'modifier/round_corners/radius', 60);
    engine.block.insertModifier(badgeShape, roundCorners, 0);

    const flower = addGraphic('star', 1440, 360, 360, 360, {
      r: 0,
      g: 0.6,
      b: 0.6,
      a: 1
    });
    const flowerShape = engine.block.getShape(flower);

    // A negative amount bloats: it pushes the vertices away from the center
    const puckerBloat = engine.block.createModifier('pucker_bloat');
    engine.block.setFloat(puckerBloat, 'modifier/pucker_bloat/amount', -0.3);
    engine.block.appendModifier(flowerShape, puckerBloat);

    // Turn the path 45 degrees at the center of the block, less towards the edge
    const twist = engine.block.createModifier('twist');
    engine.block.setFloat(twist, 'modifier/twist/angle', 45);
    engine.block.setFloat(twist, 'modifier/twist/centerX', 180);
    engine.block.setFloat(twist, 'modifier/twist/centerY', 180);
    engine.block.appendModifier(flowerShape, twist);

    // Grow the result by 12 units with round corners
    const offset = engine.block.createModifier('offset');
    engine.block.setFloat(offset, 'modifier/offset/amount', 12);
    engine.block.setEnum(offset, 'modifier/offset/join', 'Round');
    engine.block.appendModifier(flowerShape, offset);

    const badgeModifiers = engine.block.getModifiers(badgeShape);
    console.log(
      badgeModifiers.map((modifier) => engine.block.getType(modifier))
    );
    // ['//ly.img.ubq/modifier/round_corners', '//ly.img.ubq/modifier/zigzag']

    // Find every trim modifier in the scene
    console.log(engine.block.findByType('//ly.img.ubq/modifier/trim')); // [trim]

    // Remove the zig zag at index 1. The modifier block still exists.
    engine.block.removeModifier(badgeShape, 1);
    console.log(engine.block.isValid(zigzag)); // true

    // Destroy it when no shape uses it any more
    engine.block.destroy(zigzag);

    try {
      // A graphic block has no modifiers. Pass its shape instead.
      engine.block.getModifiers(outline);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.MODIFIERS_UNSUPPORTED'
      }
    }

    // Show a frame in the middle of the animation
    engine.block.setPlaybackTime(page, 2.5);
  }
}

export default Example;
