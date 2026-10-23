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
 * CE.SDK Plugin: Composition Groups Guide
 *
 * Demonstrates how a composition group gives its children their own clock:
 * - Turning composition on
 * - Running the children faster with the group speed
 * - Starting the children with the group
 * - A plain group that ignores its speed
 * - The error for a speed below the minimum
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
    engine.block.setDuration(page, 6);

    // The first lane is a composition group. Its children run on the group's
    // own clock, which starts when the group starts on the page.
    const normal = createLane(engine, page, 150, {
      r: 0.6,
      g: 0.6,
      b: 0.6,
      a: 1
    });
    engine.block.setBool(normal, 'group/composition', true);
    console.log(engine.block.getBool(normal, 'group/composition')); // true

    // At speed 2, the children see 2 seconds for every second of the page
    const fast = createLane(engine, page, 400, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    engine.block.setBool(fast, 'group/composition', true);
    engine.block.setPlaybackSpeed(fast, 2);
    console.log(engine.block.getPlaybackSpeed(fast)); // 2

    // The group starts 1 second into the page, and its children start with it
    const late = createLane(engine, page, 650, {
      r: 0.9,
      g: 0.3,
      b: 0.4,
      a: 1
    });
    engine.block.setBool(late, 'group/composition', true);
    engine.block.setTimeOffset(late, 1);
    engine.block.setDuration(late, 5);

    // Without composition, the speed of a group has no effect
    const plain = createLane(engine, page, 900, {
      r: 0.2,
      g: 0.7,
      b: 0.3,
      a: 1
    });
    engine.block.setPlaybackSpeed(plain, 2);
    console.log(engine.block.getBool(plain, 'group/composition')); // false

    try {
      // A group runs at 0.25 times the page speed or faster
      engine.block.setPlaybackSpeed(normal, 0.1);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'EDITOR.PLAYBACK_SPEED_TOO_LOW'
      }
    }

    // Show the lanes at 1.5 seconds
    engine.block.setPlaybackTime(page, 1.5);
  }
}

export default Example;

/**
 * Creates a lane: a group with a line and a ball that crosses the page in
 * 4 seconds of its own time.
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
  // Long enough for every lane clock, so the line stays visible
  engine.block.setDuration(line, 12);

  const ball = engine.block.create('graphic');
  engine.block.setShape(ball, engine.block.createShape('ellipse'));
  const ballFill = engine.block.createFill('color');
  engine.block.setColor(ballFill, 'fill/color/value', color);
  engine.block.setFill(ball, ballFill);
  engine.block.setWidth(ball, 80);
  engine.block.setHeight(ball, 80);
  engine.block.setPositionY(ball, y);
  engine.block.appendChild(page, ball);
  engine.block.setDuration(ball, 4);
  engine.block.setKeyframes(ball, 'position/x', [
    { time: 0, value: { type: 'Float', value: 120 } },
    { time: 1, value: { type: 'Float', value: 1720 } }
  ]);

  const lane = engine.block.group([line, ball]);
  engine.block.setDuration(lane, 6);
  return lane;
}
