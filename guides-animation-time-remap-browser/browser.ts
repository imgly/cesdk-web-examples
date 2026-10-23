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
 * CE.SDK Plugin: Time Remap Guide
 *
 * Demonstrates how a composition group remaps the clock of its children:
 * - Freezing the children with a static remap
 * - Playing them in reverse with a remap track
 * - Playing them forward and back with an eased track
 * - Reading the remap back and the error for blocks without a remap
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

    const normal = createLane(engine, page, 150, {
      r: 0.6,
      g: 0.6,
      b: 0.6,
      a: 1
    });
    const frozen = createLane(engine, page, 400, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    const reversed = createLane(engine, page, 650, {
      r: 0.9,
      g: 0.3,
      b: 0.4,
      a: 1
    });
    const pingPong = createLane(engine, page, 900, {
      r: 0.2,
      g: 0.7,
      b: 0.3,
      a: 1
    });
    console.log(engine.block.getBool(normal, 'playback/timeRemapEnabled')); // false

    // A static remap holds the children at 2.5 seconds of their own time
    engine.block.setBool(frozen, 'playback/timeRemapEnabled', true);
    engine.block.setFloat(frozen, 'playback/timeRemap', 2.5);

    // The track values are times on the children's clock, in seconds. They
    // stay below 5, because a clock at a child's end hides the child.
    engine.block.setBool(reversed, 'playback/timeRemapEnabled', true);
    engine.block.setKeyframes(reversed, 'playback/timeRemap', [
      { time: 0, value: { type: 'Float', value: 4.99 } },
      { time: 1, value: { type: 'Float', value: 0 } }
    ]);

    engine.block.setBool(pingPong, 'playback/timeRemapEnabled', true);
    engine.block.setKeyframes(pingPong, 'playback/timeRemap', [
      {
        time: 0,
        value: { type: 'Float', value: 0 },
        easing: { type: 'Preset', preset: 'EaseInOut' }
      },
      {
        time: 0.5,
        value: { type: 'Float', value: 4.99 },
        easing: { type: 'Preset', preset: 'EaseInOut' }
      },
      { time: 1, value: { type: 'Float', value: 0 } }
    ]);

    // The track leaves the static remap unchanged
    console.log(engine.block.getFloat(reversed, 'playback/timeRemap')); // 0
    console.log(
      engine.block.isPropertyAnimatable(reversed, 'playback/timeRemap')
    ); // true

    try {
      // Only a group has a time remap
      const ball = engine.block.getChildren(normal)[1];
      engine.block.setFloat(ball, 'playback/timeRemap', 1);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'EDITOR.BLOCK_NO_TIME_REMAP_SUPPORT'
      }
    }

    // Show the lanes at 1.5 seconds
    engine.block.setPlaybackTime(page, 1.5);
  }
}

export default Example;

/**
 * Creates a lane: a composition group with a line and a ball that crosses
 * the page in 5 seconds of the group's own clock.
 */
function createLane(
  engine: CreativeEngine,
  page: number,
  y: number,
  color: { r: number; g: number; b: number; a: number }
): number {
  const line = engine.block.create('graphic');
  engine.block.setShape(line, engine.block.createShape('rect'));
  const lineFill = engine.block.createFill('color');
  engine.block.setColor(lineFill, 'fill/color/value', {
    r: 0.85,
    g: 0.85,
    b: 0.85,
    a: 1
  });
  engine.block.setFill(line, lineFill);
  engine.block.setWidth(line, 1680);
  engine.block.setHeight(line, 6);
  engine.block.setPositionX(line, 120);
  engine.block.setPositionY(line, y + 37);
  engine.block.appendChild(page, line);
  engine.block.setDuration(line, 5);

  const ball = engine.block.create('graphic');
  engine.block.setShape(ball, engine.block.createShape('ellipse'));
  const ballFill = engine.block.createFill('color');
  engine.block.setColor(ballFill, 'fill/color/value', color);
  engine.block.setFill(ball, ballFill);
  engine.block.setWidth(ball, 80);
  engine.block.setHeight(ball, 80);
  engine.block.setPositionY(ball, y);
  engine.block.appendChild(page, ball);
  engine.block.setDuration(ball, 5);
  engine.block.setKeyframes(ball, 'position/x', [
    { time: 0, value: { type: 'Float', value: 120 } },
    { time: 1, value: { type: 'Float', value: 1720 } }
  ]);

  const lane = engine.block.group([line, ball]);
  engine.block.setDuration(lane, 5);
  // A composition group gives its children their own clock
  engine.block.setBool(lane, 'group/composition', true);
  return lane;
}
