import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Supported Animation Types Guide
 *
 * Demonstrates how to use different animation types in CE.SDK:
 * - Entrance animations (slide, fade, zoom, spin)
 * - Exit animations with timing and easing
 * - Loop animations for continuous motion
 * - Animation property configuration
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

    // Load assets and create a video scene (required for animations)
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;

    const scene = engine.scene.get()!;
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    // Set page dimensions
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);

    // Set white background color
    if (!engine.block.supportsFill(page) || !engine.block.getFill(page)) {
      const fill = engine.block.createFill('color');
      engine.block.setFill(page, fill);
    }
    const pageFill = engine.block.getFill(page)!;
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Calculate grid layout for 6 demonstration blocks
    const pageWidth = engine.block.getWidth(page)!;
    const pageHeight = engine.block.getHeight(page)!;
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Helper to create an image block
    const createImageBlock = async (index: number, imageUrl: string) => {
      const graphic = engine.block.create('graphic');
      const imageFill = engine.block.createFill('image');
      engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUrl);
      engine.block.setFill(graphic, imageFill);
      engine.block.setShape(graphic, engine.block.createShape('rect'));
      engine.block.setWidth(graphic, blockWidth);
      engine.block.setHeight(graphic, blockHeight);
      const pos = getPosition(index);
      engine.block.setPositionX(graphic, pos.x);
      engine.block.setPositionY(graphic, pos.y);
      engine.block.appendChild(page, graphic);
      return graphic;
    };

    // Sample images for demonstration
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      'https://img.ly/static/ubq_samples/sample_6.jpg'
    ];

    // Block 1: Slide entrance animation with direction
    const block1 = await createImageBlock(0, imageUrls[0]);

    // Create a slide animation that enters from the left
    const slideAnimation = engine.block.createAnimation('slide');
    engine.block.setInAnimation(block1, slideAnimation);
    engine.block.setDuration(slideAnimation, 1.0);
    // Direction in radians: 0=right, PI/2=bottom, PI=left, 3*PI/2=top
    engine.block.setFloat(slideAnimation, 'animation/slide/direction', Math.PI);
    engine.block.setEnum(slideAnimation, 'animationEasing', 'EaseOut');

    // Block 2: Fade animation with easing
    const block2 = await createImageBlock(1, imageUrls[1]);

    // Create a fade entrance animation
    const fadeAnimation = engine.block.createAnimation('fade');
    engine.block.setInAnimation(block2, fadeAnimation);
    engine.block.setDuration(fadeAnimation, 1.0);
    engine.block.setEnum(fadeAnimation, 'animationEasing', 'EaseInOut');

    // Block 3: Zoom animation
    const block3 = await createImageBlock(2, imageUrls[2]);

    // Create a zoom animation with fade effect
    const zoomAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block3, zoomAnimation);
    engine.block.setDuration(zoomAnimation, 1.0);
    engine.block.setBool(zoomAnimation, 'animation/zoom/fade', true);

    // Block 4: Exit animation
    const block4 = await createImageBlock(3, imageUrls[3]);

    // Create entrance and exit animations
    const wipeIn = engine.block.createAnimation('wipe');
    engine.block.setInAnimation(block4, wipeIn);
    engine.block.setDuration(wipeIn, 1.0);
    engine.block.setEnum(wipeIn, 'animation/wipe/direction', 'Right');

    // Exit animation plays before block disappears
    const fadeOut = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(block4, fadeOut);
    engine.block.setDuration(fadeOut, 1.0);
    engine.block.setEnum(fadeOut, 'animationEasing', 'EaseIn');

    // Block 5: Loop animation
    const block5 = await createImageBlock(4, imageUrls[4]);

    // Create a breathing loop animation
    const breathingLoop = engine.block.createAnimation('breathing_loop');
    engine.block.setLoopAnimation(block5, breathingLoop);
    engine.block.setDuration(breathingLoop, 2.0);
    // Intensity: 0 = 1.25x max scale, 1 = 2.5x max scale
    engine.block.setFloat(
      breathingLoop,
      'animation/breathing_loop/intensity',
      0.3
    );

    // Block 6: Combined animations
    const block6 = await createImageBlock(5, imageUrls[5]);

    // Apply entrance, exit, and loop animations together
    const spinIn = engine.block.createAnimation('spin');
    engine.block.setInAnimation(block6, spinIn);
    engine.block.setDuration(spinIn, 1.0);
    engine.block.setEnum(spinIn, 'animation/spin/direction', 'Clockwise');
    engine.block.setFloat(spinIn, 'animation/spin/intensity', 0.5);

    const blurOut = engine.block.createAnimation('blur');
    engine.block.setOutAnimation(block6, blurOut);
    engine.block.setDuration(blurOut, 1.0);

    const swayLoop = engine.block.createAnimation('sway_loop');
    engine.block.setLoopAnimation(block6, swayLoop);
    engine.block.setDuration(swayLoop, 1.5);

    // Discover available properties for any animation
    const properties = engine.block.findAllProperties(slideAnimation);
    // eslint-disable-next-line no-console
    console.log('Slide animation properties:', properties);

    // Query available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    // eslint-disable-next-line no-console
    console.log('Available easing options:', easingOptions);

    // Set initial playback time to see animations
    engine.block.setPlaybackTime(page, 1.9);
  }
}

export default Example;
