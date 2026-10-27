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
 * CE.SDK Plugin: Motion Paths Guide
 *
 * Demonstrates how a block moves along a motion path:
 * - A curved path through vec2 position keyframes with spatial tangents
 * - A straight path without tangents
 * - Reading the keyframes and the static position back
 * - A single-axis track that overrides one axis of the path
 * - The errors for wrong value kinds and tangents
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

    // Both tangents of a segment sit on its first keyframe. `spatialOut` is
    // relative to this keyframe's value, `spatialIn` to the next one's.
    const ball = createCircle(engine, page, 80, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    engine.block.setVec2(ball, 'position', { x: 200, y: 800 });
    engine.block.setKeyframes(ball, 'position', [
      {
        time: 0,
        value: { type: 'Vec2', value: { x: 200, y: 800 } },
        spatialOut: { x: 0, y: -400 },
        spatialIn: { x: -400, y: 0 }
      },
      {
        time: 0.5,
        value: { type: 'Vec2', value: { x: 920, y: 300 } },
        spatialOut: { x: 400, y: 0 },
        spatialIn: { x: 0, y: -400 }
      },
      { time: 1, value: { type: 'Vec2', value: { x: 1640, y: 800 } } }
    ]);
    console.log(engine.block.getVec2(ball, 'position')); // { x: 200, y: 800 }

    const dot = createCircle(engine, page, 40, {
      r: 0.9,
      g: 0.3,
      b: 0.4,
      a: 1
    });
    engine.block.setVec2(dot, 'position', { x: 200, y: 980 });
    engine.block.setKeyframes(dot, 'position', [
      { time: 0, value: { type: 'Vec2', value: { x: 200, y: 980 } } },
      { time: 1, value: { type: 'Vec2', value: { x: 1680, y: 980 } } }
    ]);

    const keyframes = engine.block.getKeyframes(ball, 'position');
    console.log(keyframes.length, keyframes[0].spatialOut); // 3 { x: 0, y: -400 }

    // The `position/y` track replaces the y-axis of the `position` track
    const hopper = createCircle(engine, page, 60, {
      r: 0.2,
      g: 0.7,
      b: 0.3,
      a: 1
    });
    engine.block.setKeyframes(hopper, 'position', [
      { time: 0, value: { type: 'Vec2', value: { x: 200, y: 100 } } },
      { time: 1, value: { type: 'Vec2', value: { x: 1660, y: 100 } } }
    ]);
    engine.block.setKeyframes(hopper, 'position/y', [
      { time: 0, value: { type: 'Float', value: 160 } },
      { time: 0.25, value: { type: 'Float', value: 40 } },
      { time: 0.5, value: { type: 'Float', value: 160 } },
      { time: 0.75, value: { type: 'Float', value: 40 } },
      { time: 1, value: { type: 'Float', value: 160 } }
    ]);

    try {
      // A motion path takes 'Vec2' values only
      engine.block.setKeyframes(ball, 'position', [
        { time: 0, value: { type: 'Float', value: 0 } }
      ]);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.KEYFRAMES_VALUE_KIND_MISMATCH'
      }
    }
    try {
      // A single axis takes no spatial tangents
      engine.block.setKeyframes(ball, 'position/x', [
        {
          time: 0,
          value: { type: 'Float', value: 0 },
          spatialOut: { x: 10, y: 0 }
        }
      ]);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.KEYFRAMES_SPATIAL_TANGENT_UNSUPPORTED'
      }
    }

    // Show the motion at 1.25 seconds, while the ball climbs its path
    engine.block.setPlaybackTime(page, 1.25);
  }
}

export default Example;

/** Creates a circle graphic of the given size and color on the page. */
function createCircle(
  engine: CreativeEngine,
  page: number,
  size: number,
  color: { r: number; g: number; b: number; a: number }
): number {
  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('ellipse'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', color);
  engine.block.setFill(block, fill);
  engine.block.setWidth(block, size);
  engine.block.setHeight(block, size);
  engine.block.appendChild(page, block);
  engine.block.setDuration(block, 5);
  return block;
}
