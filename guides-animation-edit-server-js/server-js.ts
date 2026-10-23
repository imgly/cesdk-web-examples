import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Edit Animations
 *
 * Demonstrates how to edit existing animations in CE.SDK:
 * - Retrieving animations from blocks
 * - Reading animation properties (type, duration, easing)
 * - Modifying animation duration and easing
 * - Adjusting animation-specific properties
 * - Replacing and removing animations
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.appendChild(scene, page);

    // Sample image URL
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Helper to create an image block with an initial slide animation
    const createAnimatedBlock = async (
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      const graphic = engine.block.create('graphic');
      const imageFill = engine.block.createFill('image');
      engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUri);
      engine.block.setFill(graphic, imageFill);
      engine.block.setShape(graphic, engine.block.createShape('rect'));
      engine.block.setWidth(graphic, width);
      engine.block.setHeight(graphic, height);
      engine.block.setPositionX(graphic, x);
      engine.block.setPositionY(graphic, y);
      engine.block.appendChild(page, graphic);

      // Add an initial slide animation
      const slideAnim = engine.block.createAnimation('slide');
      engine.block.setInAnimation(graphic, slideAnim);
      engine.block.setDuration(slideAnim, 1.0);

      return graphic;
    };

    // Create blocks for demonstration
    const block1 = await createAnimatedBlock(100, 100, 400, 300);

    // Retrieve animations from a block
    const inAnimation = engine.block.getInAnimation(block1);
    const outAnimation = engine.block.getOutAnimation(block1);
    const loopAnimation = engine.block.getLoopAnimation(block1);

    // An empty slot returns an invalid block
    console.log(
      'In animation:',
      engine.block.isValid(inAnimation) ? 'exists' : 'none'
    );
    console.log(
      'Out animation:',
      engine.block.isValid(outAnimation) ? 'exists' : 'none'
    );
    console.log(
      'Loop animation:',
      engine.block.isValid(loopAnimation) ? 'exists' : 'none'
    );

    // Get animation type if it exists
    if (engine.block.isValid(inAnimation)) {
      const animationType = engine.block.getType(inAnimation);
      console.log('Animation type:', animationType);
    }

    // Create second block for reading properties
    const block2 = await createAnimatedBlock(550, 100, 400, 300);

    // Read animation properties
    const animation2 = engine.block.getInAnimation(block2);
    if (engine.block.isValid(animation2)) {
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

    // Create third block for modifying duration
    const block3 = await createAnimatedBlock(1000, 100, 400, 300);

    // Modify animation duration
    const animation3 = engine.block.getInAnimation(block3);
    if (engine.block.isValid(animation3)) {
      // Change duration to 1.5 seconds
      engine.block.setDuration(animation3, 1.5);

      // Verify the change
      const newDuration = engine.block.getDuration(animation3);
      console.log('Updated duration:', newDuration, 'seconds');
    }

    // Create fourth block for changing easing
    const block4 = await createAnimatedBlock(100, 450, 400, 300);

    // Change animation easing
    const animation4 = engine.block.getInAnimation(block4);
    if (engine.block.isValid(animation4)) {
      // Query available easing options
      const easingOptions = engine.block.getEnumValues('animationEasing');
      console.log('Available easing options:', easingOptions);

      // Set easing to EaseInOut for smooth acceleration and deceleration
      engine.block.setEnum(animation4, 'animationEasing', 'EaseInOut');
    }

    // Create fifth block for adjusting animation-specific properties
    const block5 = await createAnimatedBlock(550, 450, 400, 300);

    // Adjust animation-specific properties
    const animation5 = engine.block.getInAnimation(block5);
    if (engine.block.isValid(animation5)) {
      // Get current direction (for slide animations)
      const currentDirection = engine.block.getFloat(
        animation5,
        'animation/slide/direction'
      );
      console.log('Current direction (radians):', currentDirection);

      // Move the block up, so it enters from the bottom (3*PI/2 radians)
      engine.block.setFloat(
        animation5,
        'animation/slide/direction',
        (3 * Math.PI) / 2
      );
    }

    // Create sixth block for replacing and removing animations
    const block6 = await createAnimatedBlock(1000, 450, 400, 300);

    // Replace an existing animation
    const oldAnimation = engine.block.getInAnimation(block6);
    if (engine.block.isValid(oldAnimation)) {
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
    if (engine.block.isValid(currentLoop)) {
      engine.block.destroy(currentLoop);
      // Verify removal: the empty slot returns an invalid block
      const verifyLoop = engine.block.getLoopAnimation(block6);
      console.log(
        'Loop animation after removal:',
        engine.block.isValid(verifyLoop) ? 'exists' : 'none'
      );
    }

    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/edited-animations.png`, buffer);

    console.log('Exported result to output/edited-animations.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
