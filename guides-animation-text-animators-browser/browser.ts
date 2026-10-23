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
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Text Animators Guide
 *
 * Demonstrates how to animate parts of a text with text animators:
 * - Creating a text animator and attaching it to a text block
 * - Glyph properties and the range selector
 * - Keyframes on the range
 * - The order of several animators, and removing one
 * - Keyframes on the text content
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

    // A 5 second headline in the middle of the page
    const text = engine.block.create('text');
    engine.block.replaceText(text, 'Text animators move every letter');
    engine.block.setTextFontSize(text, 120);
    engine.block.setEnum(text, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text, 1600);
    engine.block.setHeightMode(text, 'Auto');
    engine.block.setPositionX(text, 160);
    engine.block.setPositionY(text, 380);
    engine.block.appendChild(page, text);
    engine.block.setDuration(text, 5);

    console.log(engine.block.supportsTextAnimators(text)); // true
    console.log(engine.block.supportsTextAnimators(page)); // false

    // The covered glyphs sit 60 units lower and are hidden
    const reveal = engine.block.createTextAnimator();
    engine.block.setFloat(reveal, 'text_animator/positionY', 60);
    engine.block.setBool(reveal, 'text_animator/opacityEnabled', true);
    engine.block.setFloat(reveal, 'text_animator/opacity', 0);
    engine.block.appendTextAnimator(text, reveal);

    // Move the start of the range from 0 to 1 in the first half of the
    // text's duration. The uncovered glyphs rise and fade in, left to right.
    engine.block.setKeyframes(reveal, 'text_animator/selectorStart', [
      {
        time: 0,
        value: { type: 'Float', value: 0 },
        easing: { type: 'Preset', preset: 'EaseOut' }
      },
      { time: 0.5, value: { type: 'Float', value: 1 } }
    ]);

    // Cover the second word only: words are counted from 0 in index units
    const highlight = engine.block.createTextAnimator();
    engine.block.setEnum(highlight, 'text_animator/selectorBasedOn', 'Words');
    engine.block.setEnum(highlight, 'text_animator/selectorUnits', 'Index');
    engine.block.setFloat(highlight, 'text_animator/selectorStart', 1);
    engine.block.setFloat(highlight, 'text_animator/selectorEnd', 2);

    // Color and scale the covered glyphs
    engine.block.setBool(highlight, 'text_animator/fillColorEnabled', true);
    engine.block.setColor(highlight, 'text_animator/fillColor', {
      r: 1,
      g: 0.5,
      b: 0,
      a: 1
    });
    engine.block.setFloat(highlight, 'text_animator/scaleX', 1.2);
    engine.block.setFloat(highlight, 'text_animator/scaleY', 1.2);

    // Insert the highlight before the reveal
    engine.block.insertTextAnimator(text, highlight, 0);
    console.log(engine.block.getTextAnimators(text)); // [highlight, reveal]

    // A triangle covers a quarter of the characters and peaks in its middle
    const wave = engine.block.createTextAnimator();
    engine.block.setEnum(wave, 'text_animator/selectorShape', 'Triangle');
    engine.block.setFloat(wave, 'text_animator/selectorEnd', 0.25);
    engine.block.setFloat(wave, 'text_animator/positionY', -40);
    engine.block.setFloat(wave, 'text_animator/rotation', -0.2);

    // Move the range across the text over the whole duration
    engine.block.setKeyframes(wave, 'text_animator/selectorOffset', [
      { time: 0, value: { type: 'Float', value: -0.25 } },
      { time: 1, value: { type: 'Float', value: 1 } }
    ]);
    engine.block.appendTextAnimator(text, wave);

    // Remove the highlight at index 0. The animator stays valid.
    engine.block.removeTextAnimator(text, 0);
    console.log(engine.block.isValid(highlight)); // true

    // Append it again so that it applies last
    engine.block.appendTextAnimator(text, highlight);
    console.log(engine.block.getTextAnimators(text)); // [reveal, wave, highlight]

    // A second text block counts down from 3 to 1
    const countdown = engine.block.create('text');
    engine.block.replaceText(countdown, '3');
    engine.block.setTextFontSize(countdown, 160);
    engine.block.setWidthMode(countdown, 'Auto');
    engine.block.setHeightMode(countdown, 'Auto');
    engine.block.setPositionX(countdown, 900);
    engine.block.setPositionY(countdown, 700);
    engine.block.appendChild(page, countdown);
    engine.block.setDuration(countdown, 5);

    engine.block.setKeyframes(countdown, 'text/text', [
      { time: 0, value: { type: 'Discrete', value: '3' } },
      { time: 0.33, value: { type: 'Discrete', value: '2' } },
      { time: 0.67, value: { type: 'Discrete', value: '1' } }
    ]);

    try {
      // The reveal already belongs to the headline
      engine.block.appendTextAnimator(countdown, reveal);
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.TEXT_ANIMATOR_ALREADY_ATTACHED'
      }
    }

    // Show a frame during the reveal
    engine.block.setPlaybackTime(page, 2);
  }
}

export default Example;
