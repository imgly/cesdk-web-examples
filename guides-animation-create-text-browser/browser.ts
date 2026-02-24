import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Text Animations Guide
 *
 * Demonstrates text-specific animation features in CE.SDK:
 * - Creating and applying animations to text blocks
 * - Text animation writing styles (line, word, character)
 * - Segment overlap configuration
 * - Combining with easing and duration properties
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video features for animation playback
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
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    // Set white background color for the page
    // First check if page supports fill, if not or doesn't have one, create one
    if (!engine.block.supportsFill(page) || !engine.block.getFill(page)) {
      const fill = engine.block.createFill('color');
      engine.block.setFill(page, fill);
    }
    engine.block.setColor(engine.block.getFill(page), 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Calculate responsive grid layout for demonstrations
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Create a text block and animation
    // Animations are created separately and then attached to blocks
    const text1 = engine.block.create('text');
    engine.block.setWidth(text1, blockWidth);
    engine.block.setHeight(text1, blockHeight);
    engine.block.appendChild(page, text1);
    const pos1 = getPosition(0);
    engine.block.setPositionX(text1, pos1.x);
    engine.block.setPositionY(text1, pos1.y);
    engine.block.replaceText(text1, 'Creating\nText\nAnimations');
    engine.block.setFloat(text1, 'text/fontSize', 48);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text1, 'text/verticalAlignment', 'Center');

    // Create an animation instance with the 'baseline' type
    const animation1 = engine.block.createAnimation('baseline');

    // Apply the animation to the text block's entrance
    engine.block.setInAnimation(text1, animation1);

    // Set basic animation properties
    engine.block.setDuration(animation1, 2.0);

    // Writing Style: Line-by-line animation
    // Text animates one line at a time from top to bottom
    const text2 = engine.block.create('text');
    engine.block.setWidth(text2, blockWidth);
    engine.block.setHeight(text2, blockHeight);
    engine.block.appendChild(page, text2);
    const pos2 = getPosition(1);
    engine.block.setPositionX(text2, pos2.x);
    engine.block.setPositionY(text2, pos2.y);
    engine.block.replaceText(text2, 'Line by line\nanimation\nfor text');
    engine.block.setFloat(text2, 'text/fontSize', 42);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text2, 'text/verticalAlignment', 'Center');

    const animation2 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text2, animation2);
    engine.block.setDuration(animation2, 2.0);

    // Set writing style to 'Line' for line-by-line animation
    engine.block.setEnum(animation2, 'textAnimationWritingStyle', 'Line');
    engine.block.setEnum(animation2, 'animationEasing', 'EaseOut');

    // Writing Style: Word-by-word animation
    // Text animates one word at a time in reading order
    const text3 = engine.block.create('text');
    engine.block.setWidth(text3, blockWidth);
    engine.block.setHeight(text3, blockHeight);
    engine.block.appendChild(page, text3);
    const pos3 = getPosition(2);
    engine.block.setPositionX(text3, pos3.x);
    engine.block.setPositionY(text3, pos3.y);
    engine.block.replaceText(text3, 'Animate word by word for emphasis');
    engine.block.setFloat(text3, 'text/fontSize', 42);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text3, 'text/verticalAlignment', 'Center');

    const animation3 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text3, animation3);
    engine.block.setDuration(animation3, 2.5);

    // Set writing style to 'Word' for word-by-word animation
    engine.block.setEnum(animation3, 'textAnimationWritingStyle', 'Word');
    engine.block.setEnum(animation3, 'animationEasing', 'EaseOut');

    // Writing Style: Character-by-character animation
    // Text animates one character at a time (typewriter effect)
    const text4 = engine.block.create('text');
    engine.block.setWidth(text4, blockWidth);
    engine.block.setHeight(text4, blockHeight);
    engine.block.appendChild(page, text4);
    const pos4 = getPosition(3);
    engine.block.setPositionX(text4, pos4.x);
    engine.block.setPositionY(text4, pos4.y);
    engine.block.replaceText(
      text4,
      'Character by character for typewriter effect'
    );
    engine.block.setFloat(text4, 'text/fontSize', 38);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text4, 'text/verticalAlignment', 'Center');

    const animation4 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text4, animation4);
    engine.block.setDuration(animation4, 3.0);

    // Set writing style to 'Character' for character-by-character animation
    engine.block.setEnum(animation4, 'textAnimationWritingStyle', 'Character');
    engine.block.setEnum(animation4, 'animationEasing', 'Linear');

    // Segment Overlap: Sequential animation (overlap = 0)
    // Each segment completes before the next begins
    const text5 = engine.block.create('text');
    engine.block.setWidth(text5, blockWidth);
    engine.block.setHeight(text5, blockHeight);
    engine.block.appendChild(page, text5);
    const pos5 = getPosition(4);
    engine.block.setPositionX(text5, pos5.x);
    engine.block.setPositionY(text5, pos5.y);
    engine.block.replaceText(text5, 'Sequential animation with zero overlap');
    engine.block.setFloat(text5, 'text/fontSize', 40);
    engine.block.setEnum(text5, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text5, 'text/verticalAlignment', 'Center');

    const animation5 = engine.block.createAnimation('pan');
    engine.block.setInAnimation(text5, animation5);
    engine.block.setDuration(animation5, 2.0);
    engine.block.setEnum(animation5, 'textAnimationWritingStyle', 'Word');

    // Set overlap to 0 for sequential animation
    engine.block.setFloat(animation5, 'textAnimationOverlap', 0.0);
    engine.block.setEnum(animation5, 'animationEasing', 'EaseOut');

    // Segment Overlap: Cascading animation (overlap = 0.4)
    // Segments overlap partially for smooth flow
    const text6 = engine.block.create('text');
    engine.block.setWidth(text6, blockWidth);
    engine.block.setHeight(text6, blockHeight);
    engine.block.appendChild(page, text6);
    const pos6 = getPosition(5);
    engine.block.setPositionX(text6, pos6.x);
    engine.block.setPositionY(text6, pos6.y);
    engine.block.replaceText(text6, 'Cascading animation with partial overlap');
    engine.block.setFloat(text6, 'text/fontSize', 40);
    engine.block.setEnum(text6, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text6, 'text/verticalAlignment', 'Center');

    const animation6 = engine.block.createAnimation('pan');
    engine.block.setInAnimation(text6, animation6);
    engine.block.setDuration(animation6, 1.5);
    engine.block.setEnum(animation6, 'textAnimationWritingStyle', 'Word');

    // Set overlap to 0.4 for cascading effect
    engine.block.setFloat(animation6, 'textAnimationOverlap', 0.4);
    engine.block.setEnum(animation6, 'animationEasing', 'EaseOut');

    // Combining animation properties: Duration and Easing
    // Duration controls overall timing, easing controls acceleration
    // Query available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    // eslint-disable-next-line no-console
    console.log('Available easing options:', easingOptions);

    // Query available writing style options
    const writingStyleOptions = engine.block.getEnumValues(
      'textAnimationWritingStyle'
    );
    // eslint-disable-next-line no-console
    console.log('Available writing style options:', writingStyleOptions);

    // Start playback to see animations
    engine.block.setPlaying(page, true);
    engine.block.setLooping(page, true);
  }
}

export default Example;
