import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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
 * CE.SDK Plugin: Color Effects Guide
 *
 * Applies color effects to four copies of one image:
 * - A stack of levels and tritone
 * - A tint
 * - A threshold
 * - Shifted channels
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
      page: { width: 1000, height: 800, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;

    // Adds a 440 x 330 image block to the page at a position
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const addImageBlock = async (x: number, y: number) => {
      const block = await engine.block.addImage(imageUri, {
        size: { width: 440, height: 330 }
      });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, x);
      engine.block.setPositionY(block, y);
      return block;
    };

    const stackBlock = await addImageBlock(40, 47);
    const tintBlock = await addImageBlock(520, 47);
    const thresholdBlock = await addImageBlock(40, 423);
    const shiftBlock = await addImageBlock(520, 423);

    // Levels runs first and stretches the input range 0.1 to 0.9
    const levels = engine.block.createEffect('levels');
    engine.block.setFloat(levels, 'effect/levels/rgbInBlack', 0.1);
    engine.block.setFloat(levels, 'effect/levels/rgbInWhite', 0.9);
    engine.block.appendEffect(stackBlock, levels);

    // Tritone runs second and maps black, mid gray and white to three colors
    const tritone = engine.block.createEffect('tritone');
    engine.block.setColor(tritone, 'effect/tritone/shadows', {
      r: 0.1,
      g: 0.1,
      b: 0.3,
      a: 1
    });
    engine.block.setColor(tritone, 'effect/tritone/midtones', {
      r: 0.8,
      g: 0.3,
      b: 0.4,
      a: 1
    });
    engine.block.setColor(tritone, 'effect/tritone/highlights', {
      r: 1,
      g: 0.9,
      b: 0.7,
      a: 1
    });
    engine.block.appendEffect(stackBlock, tritone);

    // Map black to a dark blue and white to a warm yellow, at 80% strength
    const tint = engine.block.createEffect('tint');
    engine.block.setColor(tint, 'effect/tint/mapBlackTo', {
      r: 0.05,
      g: 0.1,
      b: 0.35,
      a: 1
    });
    engine.block.setColor(tint, 'effect/tint/mapWhiteTo', {
      r: 1,
      g: 0.85,
      b: 0.4,
      a: 1
    });
    engine.block.setFloat(tint, 'effect/tint/amount', 0.8);
    engine.block.appendEffect(tintBlock, tint);

    // Pixels with a luminance of 0.45 or more turn white, the others black
    const threshold = engine.block.createEffect('threshold');
    engine.block.setFloat(threshold, 'effect/threshold/level', 0.45);
    engine.block.appendEffect(thresholdBlock, threshold);

    // Swap the red and the blue channel
    const shiftChannels = engine.block.createEffect('shift_channels');
    engine.block.setEnum(
      shiftChannels,
      'effect/shift_channels/takeRedFrom',
      'Blue'
    );
    engine.block.setEnum(
      shiftChannels,
      'effect/shift_channels/takeBlueFrom',
      'Red'
    );
    engine.block.appendEffect(shiftBlock, shiftChannels);
  }
}

export default Example;
