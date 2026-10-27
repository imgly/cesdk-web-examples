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
 * CE.SDK Plugin: Markers and Frame Rate Guide
 *
 * Demonstrates the timeline settings of a scene:
 * - Reading and setting the frame rate
 * - Adding, reading and removing markers
 * - Seeking to a marker
 * - The errors for invalid values
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
    engine.block.setDuration(page, 10);

    // A ball crosses the page over the 10 seconds of the page
    createBall(engine, page);

    const scene = engine.scene.get()!;
    // 30 frames per second by default
    console.log(engine.block.getFloat(scene, 'scene/frameRate')); // 30
    engine.block.setFloat(scene, 'scene/frameRate', 25);

    // A marker has a name, a start time and a duration in seconds.
    // A duration of 0 marks a point.
    engine.scene.addMarker('intro', 0, 2.5);
    engine.scene.addMarker('beat', 4);
    engine.scene.addMarker('beat', 6);
    engine.scene.addMarker('outro', 8, 2);

    const markers = engine.scene.getMarkers();
    console.log(markers.map((marker) => marker.name)); // ['intro', 'beat', 'beat', 'outro']

    // Jump to the first marker named 'beat'
    const beat = markers.find((marker) => marker.name === 'beat');
    if (beat) {
      engine.block.setPlaybackTime(page, beat.time);
    }
    console.log(engine.block.getPlaybackTime(page)); // 4

    // Remove the second 'beat' by its index in the list
    engine.scene.removeMarker(2);
    console.log(engine.scene.getMarkers().length); // 3

    try {
      // A frame rate is greater than 0 and at most 240
      engine.block.setFloat(scene, 'scene/frameRate', 0);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'SCENE.FRAME_RATE_OUT_OF_RANGE'
      }
    }
    try {
      engine.scene.addMarker('before', -1);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'SCENE.MARKER_INVALID_TIME'
      }
    }
    try {
      engine.scene.removeMarker(10);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'SCENE.MARKER_INDEX_OUT_OF_RANGE'
      }
    }
  }
}

export default Example;

/** Creates a ball that crosses the page in 10 seconds. */
function createBall(engine: CreativeEngine, page: number): void {
  const ball = engine.block.create('graphic');
  engine.block.setShape(ball, engine.block.createShape('ellipse'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.9,
    a: 1
  });
  engine.block.setFill(ball, fill);
  engine.block.setWidth(ball, 160);
  engine.block.setHeight(ball, 160);
  engine.block.setPositionY(ball, 460);
  engine.block.appendChild(page, ball);
  engine.block.setDuration(ball, 10);
  engine.block.setKeyframes(ball, 'position/x', [
    { time: 0, value: { type: 'Float', value: 100 } },
    { time: 1, value: { type: 'Float', value: 1660 } }
  ]);
}
