import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
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
import type CreativeEngine from '@cesdk/engine';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Anchor, Skew and Auto-Orient Guide
 *
 * Demonstrates the transform properties of graphic, text and caption blocks:
 * - The anchor that rotation, scale and skew pivot on
 * - A static and an animated skew
 * - Auto-orient along a motion path
 * - The errors for blocks without these properties
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
      mode: 'Video',
      layout: 'DepthStack',
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;
    engine.block.setDuration(page, 5);

    const cornerSquare = createRect(engine, page, 300, 200, 160, 160, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    const centerSquare = createRect(engine, page, 700, 200, 160, 160, {
      r: 0.9,
      g: 0.3,
      b: 0.4,
      a: 1
    });
    // Without an anchor, a rotation track turns a block about its center, so
    // the left square sets its anchor to its top-left corner
    engine.block.setFloat(cornerSquare, 'transform/anchor/x', 0);
    engine.block.setFloat(cornerSquare, 'transform/anchor/y', 0);
    engine.block.setFloat(centerSquare, 'transform/anchor/x', 80);
    engine.block.setFloat(centerSquare, 'transform/anchor/y', 80);
    for (const square of [cornerSquare, centerSquare]) {
      engine.block.setKeyframes(square, 'rotation', [
        { time: 0, value: { type: 'Float', value: 0 } },
        { time: 1, value: { type: 'Float', value: Math.PI / 2 } }
      ]);
    }
    console.log(engine.block.getFloat(centerSquare, 'transform/anchor/x')); // 80

    // An anchor set to 0 is still an anchor
    console.log(engine.block.hasTransformAnchor(cornerSquare)); // true

    const sign = createRect(engine, page, 1150, 200, 240, 160, {
      r: 0.95,
      g: 0.7,
      b: 0.1,
      a: 1
    });
    engine.block.setFloat(sign, 'transform/skew', 20);
    engine.block.setFloat(sign, 'transform/skewAxis', 0);

    // The anchor sits at the bottom center, so the base of the blade stays put
    const blade = createRect(engine, page, 1600, 600, 40, 300, {
      r: 0.2,
      g: 0.7,
      b: 0.3,
      a: 1
    });
    engine.block.setFloat(blade, 'transform/anchor/x', 20);
    engine.block.setFloat(blade, 'transform/anchor/y', 300);
    engine.block.setKeyframes(blade, 'transform/skew', [
      { time: 0, value: { type: 'Float', value: -20 } },
      { time: 0.5, value: { type: 'Float', value: 20 } },
      { time: 1, value: { type: 'Float', value: -20 } }
    ]);

    const arrow = createRect(engine, page, 300, 800, 160, 40, {
      r: 0.5,
      g: 0.2,
      b: 0.8,
      a: 1
    });
    engine.block.setFloat(arrow, 'transform/anchor/x', 80);
    engine.block.setFloat(arrow, 'transform/anchor/y', 20);
    engine.block.setVec2(arrow, 'position', { x: 300, y: 800 });
    engine.block.setKeyframes(arrow, 'position', [
      {
        time: 0,
        value: { type: 'Vec2', value: { x: 300, y: 800 } },
        spatialOut: { x: 300, y: -300 },
        spatialIn: { x: -300, y: -300 }
      },
      { time: 1, value: { type: 'Vec2', value: { x: 1300, y: 800 } } }
    ]);
    engine.block.setBool(arrow, 'transform/autoOrient', true);
    console.log(engine.block.getBool(arrow, 'transform/autoOrient')); // true

    try {
      // A page has no anchor and no skew
      engine.block.setFloat(page, 'transform/anchor/x', 10);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.TYPE_CANNOT_HAVE_ANCHOR_OR_SKEW'
      }
    }
    try {
      engine.block.setBool(page, 'transform/autoOrient', true);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.TYPE_CANNOT_AUTO_ORIENT'
      }
    }

    // Show the motion at 1.5 seconds, while the arrow climbs its path
    engine.block.setPlaybackTime(page, 1.5);
  }
}

export default Example;

/** Creates a rect graphic with a color fill on the page. */
function createRect(
  engine: CreativeEngine,
  page: number,
  x: number,
  y: number,
  width: number,
  height: number,
  color: { r: number; g: number; b: number; a: number }
): number {
  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('rect'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', color);
  engine.block.setFill(block, fill);
  engine.block.setWidth(block, width);
  engine.block.setHeight(block, height);
  engine.block.setPositionX(block, x);
  engine.block.setPositionY(block, y);
  engine.block.appendChild(page, block);
  engine.block.setDuration(block, 5);
  return block;
}
