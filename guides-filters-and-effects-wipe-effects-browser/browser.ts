import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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
 * CE.SDK Plugin: Wipe Effects Guide
 *
 * Wipes three copies of one image in three ways:
 * - A linear wipe
 * - A radial wipe
 * - Venetian blinds
 * Then reveals a fourth copy over two seconds with keyframes.
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

    // Adds a 720 x 405 image block to the page at a position
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const addImageBlock = async (x: number, y: number) => {
      const block = await engine.block.addImage(imageUri, {
        size: { width: 720, height: 405 }
      });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, x);
      engine.block.setPositionY(block, y);
      return block;
    };

    const linearBlock = await addImageBlock(180, 90);
    const radialBlock = await addImageBlock(1020, 90);
    const blindsBlock = await addImageBlock(180, 585);
    const revealBlock = await addImageBlock(1020, 585);

    // Hide the left half of the block with a soft edge of 40 design units
    const linearWipe = engine.block.createEffect('linear_wipe');
    engine.block.setFloat(linearWipe, 'effect/linear_wipe/angle', 90);
    engine.block.setFloat(linearWipe, 'effect/linear_wipe/completion', 0.5);
    engine.block.setFloat(linearWipe, 'effect/linear_wipe/feather', 40);
    engine.block.appendEffect(linearBlock, linearWipe);

    // Sweep clockwise from 12 o'clock and hide 60% of the circle
    const radialWipe = engine.block.createEffect('radial_wipe');
    engine.block.setFloat(radialWipe, 'effect/radial_wipe/completion', 0.6);
    engine.block.setFloat(radialWipe, 'effect/radial_wipe/startAngle', 0);
    engine.block.setFloat(radialWipe, 'effect/radial_wipe/centerX', 0.5);
    engine.block.setFloat(radialWipe, 'effect/radial_wipe/centerY', 0.5);
    engine.block.setEnum(
      radialWipe,
      'effect/radial_wipe/direction',
      'Clockwise'
    );
    engine.block.setFloat(radialWipe, 'effect/radial_wipe/feather', 20);
    engine.block.appendEffect(radialBlock, radialWipe);

    // Diagonal stripes 60 design units wide, each half hidden
    const blinds = engine.block.createEffect('venetian_blinds');
    engine.block.setFloat(blinds, 'effect/venetian_blinds/completion', 0.5);
    engine.block.setFloat(blinds, 'effect/venetian_blinds/direction', 45);
    engine.block.setFloat(blinds, 'effect/venetian_blinds/width', 60);
    engine.block.setFloat(blinds, 'effect/venetian_blinds/feather', 2);
    engine.block.appendEffect(blindsBlock, blinds);

    // Reveal the block from the right during its 2 seconds
    engine.block.setDuration(revealBlock, 2);
    const reveal = engine.block.createEffect('linear_wipe');
    engine.block.setFloat(reveal, 'effect/linear_wipe/angle', 90);
    engine.block.appendEffect(revealBlock, reveal);

    // Keyframe times are relative to the block's duration, from 0 to 1
    engine.block.setKeyframes(reveal, 'effect/linear_wipe/completion', [
      {
        time: 0,
        value: { type: 'Float', value: 1 },
        easing: { type: 'Preset', preset: 'EaseOut' }
      },
      { time: 1, value: { type: 'Float', value: 0 } }
    ]);
    console.log(
      engine.block.getKeyframes(reveal, 'effect/linear_wipe/completion').length
    ); // 2

    // Show the reveal halfway through
    engine.block.setPlaybackTime(page, 1);
  }
}

export default Example;
