import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a video scene (required for animations)
    engine.scene.createVideo({
      page: { size: { width: 1920, height: 1080 } }
    });
    const page = engine.block.findByType('page')[0];

    // Helper to create an image block
    const createImageBlock = (
      x: number,
      y: number,
      width: number,
      height: number,
      imageUrl: string
    ) => {
      const graphic = engine.block.create('graphic');
      const imageFill = engine.block.createFill('image');
      engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUrl);
      engine.block.setFill(graphic, imageFill);
      engine.block.setShape(graphic, engine.block.createShape('rect'));
      engine.block.setWidth(graphic, width);
      engine.block.setHeight(graphic, height);
      engine.block.setPositionX(graphic, x);
      engine.block.setPositionY(graphic, y);
      engine.block.appendChild(page, graphic);
      return graphic;
    };

    // Layout configuration
    const margin = 100;
    const spacing = 50;
    const blockWidth = 500;
    const blockHeight = 350;

    // Sample images
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      'https://img.ly/static/ubq_samples/sample_6.jpg'
    ];

    // Block 1: Check animation support and create entrance animation
    const block1 = createImageBlock(
      margin,
      margin,
      blockWidth,
      blockHeight,
      imageUrls[0]
    );

    // Check if block supports animations before applying
    if (engine.block.supportsAnimation(block1)) {
      // Create an entrance animation
      const slideAnimation = engine.block.createAnimation('slide');
      engine.block.setInAnimation(block1, slideAnimation);
      engine.block.setDuration(slideAnimation, 1.0);
    }

    // Block 2: Entrance animation with easing configuration
    const block2 = createImageBlock(
      margin + blockWidth + spacing,
      margin,
      blockWidth,
      blockHeight,
      imageUrls[1]
    );

    // Create a fade entrance animation with easing
    const fadeInAnimation = engine.block.createAnimation('fade');
    engine.block.setInAnimation(block2, fadeInAnimation);
    engine.block.setDuration(fadeInAnimation, 1.0);
    engine.block.setEnum(fadeInAnimation, 'animationEasing', 'EaseOut');

    // Block 3: Exit animation
    const block3 = createImageBlock(
      margin + 2 * (blockWidth + spacing),
      margin,
      blockWidth,
      blockHeight,
      imageUrls[2]
    );

    // Create both entrance and exit animations
    const zoomInAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block3, zoomInAnimation);
    engine.block.setDuration(zoomInAnimation, 1.0);

    const fadeOutAnimation = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(block3, fadeOutAnimation);
    engine.block.setDuration(fadeOutAnimation, 1.0);
    engine.block.setEnum(fadeOutAnimation, 'animationEasing', 'EaseIn');

    // Block 4: Loop animation
    const block4 = createImageBlock(
      margin,
      margin + blockHeight + spacing,
      blockWidth,
      blockHeight,
      imageUrls[3]
    );

    // Create a breathing loop animation
    const breathingLoop = engine.block.createAnimation('breathing_loop');
    engine.block.setLoopAnimation(block4, breathingLoop);
    engine.block.setDuration(breathingLoop, 1.0);

    // Block 5: Animation properties and slide direction
    const block5 = createImageBlock(
      margin + blockWidth + spacing,
      margin + blockHeight + spacing,
      blockWidth,
      blockHeight,
      imageUrls[4]
    );

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
    console.log('Slide animation properties:', properties);

    // Block 6: Get animations and replace them
    const block6 = createImageBlock(
      margin + 2 * (blockWidth + spacing),
      margin + blockHeight + spacing,
      blockWidth,
      blockHeight,
      imageUrls[5]
    );

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
    console.log('Available easing options:', easingOptions);

    // Save the scene with all animations to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const sceneString = await engine.scene.saveToString();
    writeFileSync(`${outputDir}/base-animations.scene`, sceneString);
    console.log('Saved scene to output/base-animations.scene');

    console.log('Base Animations example completed successfully');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
