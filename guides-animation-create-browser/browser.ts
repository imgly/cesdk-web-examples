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

/**
 * CE.SDK Plugin: Create Animations Guide
 *
 * Demonstrates animation features in CE.SDK:
 * - Creating entrance (In) animations
 * - Creating exit (Out) animations
 * - Creating loop animations
 * - Configuring duration and easing
 * - Text animations with writing styles
 * - Managing animation lifecycle
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
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Set page dimensions and duration
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    engine.block.setDuration(page, 5.0);

    // Create gradient background
    if (engine.block.supportsFill(page)) {
      const gradientFill = engine.block.createFill('gradient/linear');
      engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
        { color: { r: 0.4, g: 0.2, b: 0.8, a: 1.0 }, stop: 0 },
        { color: { r: 0.1, g: 0.3, b: 0.6, a: 1.0 }, stop: 0.5 },
        { color: { r: 0.2, g: 0.1, b: 0.4, a: 1.0 }, stop: 1 }
      ]);
      // Diagonal gradient from top-left to bottom-right
      engine.block.setFloat(
        gradientFill,
        'fill/gradient/linear/startPointX',
        0
      );
      engine.block.setFloat(
        gradientFill,
        'fill/gradient/linear/startPointY',
        0
      );
      engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
      engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
      engine.block.setFill(page, gradientFill);
    }

    // ===== Title: "Create Animations" with entrance animation =====
    const titleBlock = engine.block.create('text');
    engine.block.replaceText(titleBlock, 'Create Animations');
    engine.block.setTextFontSize(titleBlock, 120);
    engine.block.setTextColor(titleBlock, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
    engine.block.setEnum(titleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);
    engine.block.setDuration(titleBlock, 5.0);

    // Check if block supports animations before applying
    if (engine.block.supportsAnimation(titleBlock)) {
      // Create an entrance animation
      const slideIn = engine.block.createAnimation('slide');
      engine.block.setInAnimation(titleBlock, slideIn);
      engine.block.setDuration(slideIn, 1.2);
      engine.block.setFloat(
        slideIn,
        'animation/slide/direction',
        (3 * Math.PI) / 2
      );
      engine.block.setEnum(slideIn, 'animationEasing', 'EaseOut');
    }

    // Center title horizontally and position in upper third
    const titleWidth = engine.block.getFrameWidth(titleBlock);
    const titleHeight = engine.block.getFrameHeight(titleBlock);
    engine.block.setPositionX(titleBlock, (pageWidth - titleWidth) / 2);
    engine.block.setPositionY(titleBlock, pageHeight * 0.25);

    // ===== IMG.LY Logo with pulsating loop animation =====
    const logoBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/imgly_logo.jpg',
      { size: { width: 200, height: 200 } }
    );
    engine.block.appendChild(page, logoBlock);
    engine.block.setDuration(logoBlock, 5.0);
    // Contain the image within the block frame
    engine.block.setEnum(logoBlock, 'contentFill/mode', 'Contain');

    // Create a pulsating loop animation
    const pulsating = engine.block.createAnimation('pulsating_loop');
    engine.block.setLoopAnimation(logoBlock, pulsating);
    engine.block.setDuration(pulsating, 1.5);

    // Add fade entrance for the logo
    const logoFadeIn = engine.block.createAnimation('fade');
    engine.block.setInAnimation(logoBlock, logoFadeIn);
    engine.block.setDuration(logoFadeIn, 0.8);
    engine.block.setEnum(logoFadeIn, 'animationEasing', 'EaseOut');

    // Position logo below title, centered
    const logoWidth = engine.block.getFrameWidth(logoBlock);
    engine.block.setPositionX(logoBlock, (pageWidth - logoWidth) / 2);
    engine.block.setPositionY(logoBlock, pageHeight * 0.25 + titleHeight + 40);

    // ===== Subtitle with text animation =====
    const subtitleBlock = engine.block.create('text');
    engine.block.replaceText(subtitleBlock, 'Entrance • Exit • Loop');
    engine.block.setTextFontSize(subtitleBlock, 48);
    engine.block.setTextColor(subtitleBlock, {
      r: 0.9,
      g: 0.9,
      b: 1.0,
      a: 0.9
    });
    engine.block.setEnum(subtitleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidthMode(subtitleBlock, 'Auto');
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.appendChild(page, subtitleBlock);
    engine.block.setDuration(subtitleBlock, 5.0);

    // Create text animation with word-by-word reveal
    const textAnim = engine.block.createAnimation('fade');
    engine.block.setInAnimation(subtitleBlock, textAnim);
    engine.block.setDuration(textAnim, 1.5);

    // Configure text animation writing style (Line, Word, or Character)
    engine.block.setEnum(textAnim, 'textAnimationWritingStyle', 'Word');
    // Set overlap for cascading effect (0 = sequential, 0-1 = cascading)
    engine.block.setFloat(textAnim, 'textAnimationOverlap', 0.3);

    // Position subtitle below logo
    const subtitleWidth = engine.block.getFrameWidth(subtitleBlock);
    engine.block.setPositionX(subtitleBlock, (pageWidth - subtitleWidth) / 2);
    engine.block.setPositionY(subtitleBlock, pageHeight * 0.65);

    // ===== Bottom right text with exit animation =====
    const footerBlock = engine.block.create('text');
    engine.block.replaceText(footerBlock, 'Powered by CE.SDK');
    engine.block.setTextFontSize(footerBlock, 32);
    engine.block.setTextColor(footerBlock, { r: 1.0, g: 1.0, b: 1.0, a: 0.7 });
    engine.block.setEnum(footerBlock, 'text/horizontalAlignment', 'Right');
    engine.block.setWidthMode(footerBlock, 'Auto');
    engine.block.setHeightMode(footerBlock, 'Auto');
    engine.block.appendChild(page, footerBlock);

    // Footer appears at start and fades out at the end
    engine.block.setTimeOffset(footerBlock, 0);
    engine.block.setDuration(footerBlock, 5.0);

    // Create exit animation that plays at the end of the block's duration
    const fadeOut = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(footerBlock, fadeOut);
    engine.block.setDuration(fadeOut, 1.0);
    engine.block.setEnum(fadeOut, 'animationEasing', 'EaseIn');

    // Position footer at bottom right with padding
    const footerWidth = engine.block.getFrameWidth(footerBlock);
    const footerHeight = engine.block.getFrameHeight(footerBlock);
    engine.block.setPositionX(footerBlock, pageWidth - footerWidth - 60);
    engine.block.setPositionY(footerBlock, pageHeight - footerHeight - 40);

    // ===== Animation Properties Demo =====
    // Create slide animation and configure direction for title
    const titleInAnim = engine.block.getInAnimation(titleBlock);
    if (titleInAnim !== 0) {
      // Discover all available properties for this animation
      const properties = engine.block.findAllProperties(titleInAnim);
      console.log('Slide animation properties:', properties);
    }

    // Example: Retrieve animations to verify they're attached
    const currentTitleIn = engine.block.getInAnimation(titleBlock);
    const currentLogoLoop = engine.block.getLoopAnimation(logoBlock);
    const currentFooterOut = engine.block.getOutAnimation(footerBlock);

    console.log(
      'Animation IDs - Title In:',
      currentTitleIn,
      'Logo Loop:',
      currentLogoLoop,
      'Footer Out:',
      currentFooterOut
    );

    // Get available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    console.log('Available easing options:', easingOptions);

    // Set initial playback time to show the scene after animations start
    engine.block.setPlaybackTime(page, 2.0);
  }
}

export default Example;
