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
    // Create a video scene - required for animations
    const scene = engine.scene.createVideo();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.setDuration(page, 10);

    // Set white background
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
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const margin = 40;
    const spacing = 20;
    const cols = 3;
    const rows = 2;
    const blockWidth = (pageWidth - 2 * margin - (cols - 1) * spacing) / cols;
    const blockHeight = (pageHeight - 2 * margin - (rows - 1) * spacing) / rows;

    // Helper to create an image block
    const createImageBlock = (index: number, imageUrl: string) => {
      const graphic = engine.block.create('graphic');
      const imageFill = engine.block.createFill('image');
      engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUrl);
      engine.block.setFill(graphic, imageFill);
      engine.block.setShape(graphic, engine.block.createShape('rect'));
      engine.block.setWidth(graphic, blockWidth);
      engine.block.setHeight(graphic, blockHeight);

      const col = index % cols;
      const row = Math.floor(index / cols);
      engine.block.setPositionX(graphic, margin + col * (blockWidth + spacing));
      engine.block.setPositionY(
        graphic,
        margin + row * (blockHeight + spacing)
      );
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
    const block1 = createImageBlock(0, imageUrls[0]);

    // Create a slide animation that enters from the left
    const slideAnimation = engine.block.createAnimation('slide');
    engine.block.setInAnimation(block1, slideAnimation);
    engine.block.setDuration(slideAnimation, 1.0);
    // Direction in radians: 0=right, PI/2=bottom, PI=left, 3*PI/2=top
    engine.block.setFloat(slideAnimation, 'animation/slide/direction', Math.PI);
    engine.block.setEnum(slideAnimation, 'animationEasing', 'EaseOut');

    // Block 2: Fade animation with easing
    const block2 = createImageBlock(1, imageUrls[1]);

    // Create a fade entrance animation
    const fadeAnimation = engine.block.createAnimation('fade');
    engine.block.setInAnimation(block2, fadeAnimation);
    engine.block.setDuration(fadeAnimation, 1.0);
    engine.block.setEnum(fadeAnimation, 'animationEasing', 'EaseInOut');

    // Block 3: Zoom animation
    const block3 = createImageBlock(2, imageUrls[2]);

    // Create a zoom animation with fade effect
    const zoomAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block3, zoomAnimation);
    engine.block.setDuration(zoomAnimation, 1.0);
    engine.block.setBool(zoomAnimation, 'animation/zoom/fade', true);

    // Block 4: Exit animation
    const block4 = createImageBlock(3, imageUrls[3]);

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
    const block5 = createImageBlock(4, imageUrls[4]);

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
    const block6 = createImageBlock(5, imageUrls[5]);

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
    console.log('Slide animation properties:', properties);

    // Query available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    console.log('Available easing options:', easingOptions);

    // Export the scene to a .scene file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Save as scene file - preserves all animation data
    const sceneData = await engine.scene.saveToString();
    writeFileSync(`${outputDir}/animation-types.scene`, sceneData);
    console.log('Exported to output/animation-types.scene');

    console.log('Animation Types example completed successfully');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
