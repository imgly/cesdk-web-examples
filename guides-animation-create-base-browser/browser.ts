import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Base Animations Guide
 *
 * Demonstrates animation features for design blocks in CE.SDK:
 * - Creating and applying entrance (In) animations
 * - Creating and applying exit (Out) animations
 * - Creating and applying loop animations
 * - Configuring duration and easing
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

    // Load assets and create a video scene (required for animations)
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    // Set white background color
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

    // Calculate grid layout for 6 demonstration blocks
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
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

    // Block 1: Check animation support and create entrance animation
    const block1 = await createImageBlock(0, imageUrls[0]);

    // Check if block supports animations before applying
    if (engine.block.supportsAnimation(block1)) {
      // Create an entrance animation
      const slideAnimation = engine.block.createAnimation('slide');
      engine.block.setInAnimation(block1, slideAnimation);
      engine.block.setDuration(slideAnimation, 1.0);
    }

    // Block 2: Entrance animation with easing configuration
    const block2 = await createImageBlock(1, imageUrls[1]);

    // Create a fade entrance animation with easing
    const fadeInAnimation = engine.block.createAnimation('fade');
    engine.block.setInAnimation(block2, fadeInAnimation);
    engine.block.setDuration(fadeInAnimation, 1.0);
    engine.block.setEnum(fadeInAnimation, 'animationEasing', 'EaseOut');

    // Block 3: Exit animation
    const block3 = await createImageBlock(2, imageUrls[2]);

    // Create an exit animation
    const zoomInAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block3, zoomInAnimation);
    engine.block.setDuration(zoomInAnimation, 1.0);

    const fadeOutAnimation = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(block3, fadeOutAnimation);
    engine.block.setDuration(fadeOutAnimation, 1.0);
    engine.block.setEnum(fadeOutAnimation, 'animationEasing', 'EaseIn');

    // Block 4: Loop animation
    const block4 = await createImageBlock(3, imageUrls[3]);

    // Create a breathing loop animation
    const breathingLoop = engine.block.createAnimation('breathing_loop');
    engine.block.setLoopAnimation(block4, breathingLoop);
    engine.block.setDuration(breathingLoop, 1.0);

    // Block 5: Animation properties and slide direction
    const block5 = await createImageBlock(4, imageUrls[4]);

    // Create slide animation and configure direction
    const slideFromTop = engine.block.createAnimation('slide');
    engine.block.setInAnimation(block5, slideFromTop);
    engine.block.setDuration(slideFromTop, 1.0);

    // Set slide direction (in radians: 0=right, PI/2=bottom, PI=left, 3*PI/2=top)
    engine.block.setFloat(
      slideFromTop,
      'animation/slide/direction',
      Math.PI / 2
    );
    engine.block.setEnum(slideFromTop, 'animationEasing', 'EaseInOut');

    // Discover all available properties for this animation
    const properties = engine.block.findAllProperties(slideFromTop);
    // eslint-disable-next-line no-console
    console.log('Slide animation properties:', properties);

    // Block 6: Get animations and replace them
    const block6 = await createImageBlock(5, imageUrls[5]);

    // Set initial animations
    const initialIn = engine.block.createAnimation('pan');
    engine.block.setInAnimation(block6, initialIn);
    engine.block.setDuration(initialIn, 1.0);

    const spinLoop = engine.block.createAnimation('spin_loop');
    engine.block.setLoopAnimation(block6, spinLoop);
    engine.block.setDuration(spinLoop, 1.0);

    // Get current animations
    const currentIn = engine.block.getInAnimation(block6);
    const currentLoop = engine.block.getLoopAnimation(block6);
    const currentOut = engine.block.getOutAnimation(block6);

    // eslint-disable-next-line no-console
    console.log(
      'Animation IDs - In:',
      currentIn,
      'Loop:',
      currentLoop,
      'Out:',
      currentOut
    );

    // Replace in animation (destroy old one first to avoid memory leaks)
    if (currentIn !== 0) {
      engine.block.destroy(currentIn);
    }
    const newInAnimation = engine.block.createAnimation('wipe');
    engine.block.setInAnimation(block6, newInAnimation);
    engine.block.setDuration(newInAnimation, 1.0);

    // Query available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    // eslint-disable-next-line no-console
    console.log('Available easing options:', easingOptions);

    // Set initial playback time to 1 second (after entrance animations)
    engine.block.setPlaybackTime(page, 1.0);
  }
}

export default Example;
