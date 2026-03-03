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
 * CE.SDK Plugin: Edit Animations Guide
 *
 * Demonstrates how to edit existing animations in CE.SDK:
 * - Retrieving animations from blocks
 * - Reading animation properties (type, duration, easing)
 * - Modifying animation duration and easing
 * - Adjusting animation-specific properties
 * - Replacing and removing animations
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
    const page = pages[0]!;

    // Set white background color
    const pageFill = engine.block.getFill(page);
    if (pageFill) {
      engine.block.setColor(pageFill, 'fill/color/value', {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
      });
    }

    // Calculate grid layout for 6 demonstration blocks
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Helper to create an image block with an initial animation
    const createAnimatedBlock = async (index: number, imageUrl: string) => {
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

      // Add an initial slide animation
      const slideAnim = engine.block.createAnimation('slide');
      engine.block.setInAnimation(graphic, slideAnim);
      engine.block.setDuration(slideAnim, 1.0);

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

    // Block 1: Retrieve animations and check their existence
    const block1 = await createAnimatedBlock(0, imageUrls[0]);

    // Retrieve animations from a block
    const inAnimation = engine.block.getInAnimation(block1);
    const outAnimation = engine.block.getOutAnimation(block1);
    const loopAnimation = engine.block.getLoopAnimation(block1);

    // Check if animations exist (0 means no animation)
    console.log('In animation:', inAnimation !== 0 ? 'exists' : 'none');
    console.log('Out animation:', outAnimation !== 0 ? 'exists' : 'none');
    console.log('Loop animation:', loopAnimation !== 0 ? 'exists' : 'none');

    // Get animation type if it exists
    if (inAnimation !== 0) {
      const animationType = engine.block.getType(inAnimation);
      console.log('Animation type:', animationType);
    }

    // Block 2: Read animation properties
    const block2 = await createAnimatedBlock(1, imageUrls[1]);

    // Read animation properties
    const animation2 = engine.block.getInAnimation(block2);
    if (animation2 !== 0) {
      // Get current duration
      const duration = engine.block.getDuration(animation2);
      console.log('Duration:', duration, 'seconds');

      // Get current easing
      const easing = engine.block.getEnum(animation2, 'animationEasing');
      console.log('Easing:', easing);

      // Discover all available properties
      const allProperties = engine.block.findAllProperties(animation2);
      console.log('Available properties:', allProperties);
    }

    // Block 3: Modify animation duration
    const block3 = await createAnimatedBlock(2, imageUrls[2]);

    // Modify animation duration
    const animation3 = engine.block.getInAnimation(block3);
    if (animation3 !== 0) {
      // Change duration to 1.5 seconds
      engine.block.setDuration(animation3, 1.5);

      // Verify the change
      const newDuration = engine.block.getDuration(animation3);
      console.log('Updated duration:', newDuration, 'seconds');
    }

    // Block 4: Change easing function
    const block4 = await createAnimatedBlock(3, imageUrls[3]);

    // Change animation easing
    const animation4 = engine.block.getInAnimation(block4);
    if (animation4 !== 0) {
      // Query available easing options
      const easingOptions = engine.block.getEnumValues('animationEasing');
      console.log('Available easing options:', easingOptions);

      // Set easing to EaseInOut for smooth acceleration and deceleration
      engine.block.setEnum(animation4, 'animationEasing', 'EaseInOut');
    }

    // Block 5: Adjust animation-specific properties (slide direction)
    const block5 = await createAnimatedBlock(4, imageUrls[4]);

    // Adjust animation-specific properties
    const animation5 = engine.block.getInAnimation(block5);
    if (animation5 !== 0) {
      // Get current direction (for slide animations)
      const currentDirection = engine.block.getFloat(
        animation5,
        'animation/slide/direction'
      );
      console.log('Current direction (radians):', currentDirection);

      // Change direction to slide from top (3*PI/2 radians)
      engine.block.setFloat(
        animation5,
        'animation/slide/direction',
        (3 * Math.PI) / 2
      );
    }

    // Block 6: Replace and remove animations
    const block6 = await createAnimatedBlock(5, imageUrls[5]);

    // Replace an existing animation
    const oldAnimation = engine.block.getInAnimation(block6);
    if (oldAnimation !== 0) {
      // Destroy the old animation to prevent memory leaks
      engine.block.destroy(oldAnimation);
    }

    // Create and set a new animation
    const newAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block6, newAnimation);
    engine.block.setDuration(newAnimation, 1.2);
    engine.block.setEnum(newAnimation, 'animationEasing', 'EaseOut');

    // Add a loop animation to demonstrate removal
    const loopAnim = engine.block.createAnimation('breathing_loop');
    engine.block.setLoopAnimation(block6, loopAnim);
    engine.block.setDuration(loopAnim, 1.0);

    // Remove the loop animation by destroying it
    const currentLoop = engine.block.getLoopAnimation(block6);
    if (currentLoop !== 0) {
      engine.block.destroy(currentLoop);
      // Verify removal - should now return 0
      const verifyLoop = engine.block.getLoopAnimation(block6);
      console.log(
        'Loop animation after removal:',
        verifyLoop === 0 ? 'none' : 'exists'
      );
    }
  }
}

export default Example;
