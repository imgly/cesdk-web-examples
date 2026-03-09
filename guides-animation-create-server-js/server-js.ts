/**
 * CE.SDK Server Guide: Create Animations
 *
 * Demonstrates animation features in CE.SDK:
 * - Creating entrance (In) animations
 * - Creating exit (Out) animations
 * - Creating loop animations
 * - Configuring duration and easing
 * - Text animations with writing styles
 * - Managing animation lifecycle
 * - Saving the scene to a .scene file
 */
import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';

// Load environment variables from .env file
config();

async function main(): Promise<void> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a video scene (required for animations)
    const scene = engine.scene.createVideo();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set page dimensions and duration
    const pageWidth = 1920;
    const pageHeight = 1080;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);
    engine.block.setDuration(page, 5.0);

    // Create gradient background
    if (engine.block.supportsFill(page)) {
      const gradientFill = engine.block.createFill('gradient/linear');
      engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
        { color: { r: 0.4, g: 0.2, b: 0.8, a: 1.0 }, stop: 0 },
        { color: { r: 0.1, g: 0.3, b: 0.6, a: 1.0 }, stop: 0.5 },
        { color: { r: 0.2, g: 0.1, b: 0.4, a: 1.0 }, stop: 1 }
      ]);
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
    const logoBlock = engine.block.create('graphic');
    engine.block.setShape(logoBlock, engine.block.createShape('rect'));
    const logoFill = engine.block.createFill('image');
    engine.block.setString(
      logoFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/imgly_logo.jpg'
    );
    engine.block.setFill(logoBlock, logoFill);
    engine.block.setWidth(logoBlock, 200);
    engine.block.setHeight(logoBlock, 200);
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

    // Save the scene to a .scene file
    mkdirSync('output', { recursive: true });
    const sceneString = await engine.scene.saveToString();
    writeFileSync('output/animated-scene.scene', sceneString);
    console.log('Scene saved to output/animated-scene.scene');

  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
