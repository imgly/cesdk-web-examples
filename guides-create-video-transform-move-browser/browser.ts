import CreativeEditorSDK, {
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
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

class Example implements EditorPlugin {
  name = 'guides-create-video-transform-move-browser';

  version = CreativeEditorSDK.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Setup: Load assets and create scene
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');
    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
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
      page: { width: 800, height: 500, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : engine.scene.get();

    // Enable fill and set page fill color to #6686FF
    engine.block.setFillEnabled(page, true);
    engine.block.setColor(engine.block.getFill(page), 'fill/color/value', {
      r: 102 / 255,
      g: 134 / 255,
      b: 255 / 255,
      a: 1
    });

    // Demo 1: Movable Video - Can be freely repositioned by user
    const movableVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      200,
      150
    );
    engine.block.appendChild(page, movableVideo);
    engine.block.setPositionX(movableVideo, 0);
    engine.block.setPositionY(movableVideo, 100);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Movable');
    engine.block.setFloat(text1, 'text/fontSize', 32);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 200);
    engine.block.setPositionX(text1, 0);
    engine.block.setPositionY(text1, 310);
    engine.block.setFillEnabled(text1, true);
    engine.block.setColor(engine.block.getFill(text1), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text1);

    // Add explanatory text below
    const explanation1 = engine.block.create('text');
    engine.block.setString(
      explanation1,
      'text/text',
      'Uses absolute positioning with pixel coordinates'
    );
    engine.block.setFloat(explanation1, 'text/fontSize', 14);
    engine.block.setEnum(explanation1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation1, 200);
    engine.block.setPositionX(explanation1, 0);
    engine.block.setPositionY(explanation1, 345);
    engine.block.setFillEnabled(explanation1, true);
    engine.block.setColor(
      engine.block.getFill(explanation1),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation1);

    // Demo 2: Percentage Positioning - Responsive layout
    const percentVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      200,
      150
    );
    engine.block.appendChild(page, percentVideo);

    // Set position mode to percentage (0.0 to 1.0)
    engine.block.setPositionXMode(percentVideo, 'Percent');
    engine.block.setPositionYMode(percentVideo, 'Percent');

    // Position at 37.5% from left (300px), 30% from top (150px)
    engine.block.setPositionX(percentVideo, 0.375);
    engine.block.setPositionY(percentVideo, 0.3);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Percentage');
    engine.block.setFloat(text2, 'text/fontSize', 32);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 200);
    engine.block.setPositionX(text2, 300);
    engine.block.setPositionY(text2, 310);
    engine.block.setFillEnabled(text2, true);
    engine.block.setColor(engine.block.getFill(text2), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text2);

    // Add explanatory text below
    const explanation2 = engine.block.create('text');
    engine.block.setString(
      explanation2,
      'text/text',
      'Uses percentage values (0.0-1.0) for responsive layouts'
    );
    engine.block.setFloat(explanation2, 'text/fontSize', 14);
    engine.block.setEnum(explanation2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation2, 200);
    engine.block.setPositionX(explanation2, 300);
    engine.block.setPositionY(explanation2, 345);
    engine.block.setFillEnabled(explanation2, true);
    engine.block.setColor(
      engine.block.getFill(explanation2),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation2);

    // Demo 3: Locked Video - Cannot be moved, rotated, or scaled
    const lockedVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      200,
      150
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, 550);
    engine.block.setPositionY(lockedVideo, 150);

    // Lock the transform to prevent user interaction
    engine.block.setBool(lockedVideo, 'transformLocked', true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Locked');
    engine.block.setFloat(text3, 'text/fontSize', 32);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 200);
    engine.block.setPositionX(text3, 550);
    engine.block.setPositionY(text3, 310);
    engine.block.setFillEnabled(text3, true);
    engine.block.setColor(engine.block.getFill(text3), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text3);

    // Add explanatory text below
    const explanation3 = engine.block.create('text');
    engine.block.setString(
      explanation3,
      'text/text',
      'Transform locked - cannot be repositioned'
    );
    engine.block.setFloat(explanation3, 'text/fontSize', 14);
    engine.block.setEnum(explanation3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation3, 200);
    engine.block.setPositionX(explanation3, 550);
    engine.block.setPositionY(explanation3, 345);
    engine.block.setFillEnabled(explanation3, true);
    engine.block.setColor(
      engine.block.getFill(explanation3),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation3);

    // Get current position values
    const currentX = engine.block.getPositionX(movableVideo);
    const currentY = engine.block.getPositionY(movableVideo);
    console.log('Current position:', currentX, currentY);

    // Move relative to current position
    const offsetX = engine.block.getPositionX(movableVideo);
    const offsetY = engine.block.getPositionY(movableVideo);
    engine.block.setPositionX(movableVideo, offsetX + 50);
    engine.block.setPositionY(movableVideo, offsetY + 50);

    // Adjust text positions after relative movement
    engine.block.setPositionX(text1, 50);
    engine.block.setPositionY(text1, 310);
    engine.block.setPositionX(explanation1, 50);
    engine.block.setPositionY(explanation1, 345);

    // Set playhead position to 2 seconds
    engine.block.setPlaybackTime(page, 2);
  }
}

export default Example;
