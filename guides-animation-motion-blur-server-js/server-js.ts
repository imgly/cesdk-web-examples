import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Motion Blur
 *
 * Demonstrates how to set up motion blur for video export:
 * - Turning motion blur on for a block
 * - Tuning the shutter angle, the shutter phase and the samples of the scene
 * - The scene frame rate that sets the length of one frame
 * - Saving the scene for a video export on another platform
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a 2 second page
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.appendChild(scene, page);
    engine.block.setDuration(page, 2);

    // A square that crosses the page in one second. Motion blur needs motion.
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    const fill = engine.block.createFill('color');
    engine.block.setColor(fill, 'fill/color/value', {
      r: 0.9,
      g: 0.2,
      b: 0.4,
      a: 1
    });
    engine.block.setFill(block, fill);
    engine.block.setWidth(block, 300);
    engine.block.setHeight(block, 300);
    engine.block.setPositionY(block, 390);
    engine.block.appendChild(page, block);
    engine.block.setDuration(block, 2);

    engine.block.setKeyframes(block, 'position/x', [
      { time: 0, value: { type: 'Float', value: 100 } },
      { time: 0.5, value: { type: 'Float', value: 1520 } },
      { time: 1, value: { type: 'Float', value: 100 } }
    ]);

    // Blur the block while it moves
    engine.block.setBool(block, 'motionBlur/enabled', true);
    console.log(engine.block.getBool(block, 'motionBlur/enabled')); // true

    // Graphic, text and caption blocks have the property. Pages do not.
    const blockProperties = engine.block.findAllProperties(block);
    console.log(blockProperties.includes('motionBlur/enabled')); // true
    const pageProperties = engine.block.findAllProperties(page);
    console.log(pageProperties.includes('motionBlur/enabled')); // false

    // The scene holds the shutter for all blocks with motion blur.
    // 360 degrees keeps the shutter open for one full frame.
    engine.block.setFloat(scene, 'motionBlur/shutterAngle', 360);
    // -180 degrees, half the angle, centers the shutter on the frame time
    engine.block.setFloat(scene, 'motionBlur/shutterPhase', -180);

    // More samples give a smoother trail and take longer to render
    engine.block.setInt(scene, 'motionBlur/samples', 32);
    console.log(engine.block.getInt(scene, 'motionBlur/samples')); // 32

    // One frame of the scene frame rate is the span the shutter angle refers to
    engine.block.setFloat(scene, 'scene/frameRate', 30);

    try {
      engine.block.setInt(scene, 'motionBlur/samples', 100);
    } catch (error) {
      // Engine errors carry a stable catalog id in `code`
      const { code } = error as { code?: string };
      console.log(code); // 'BLOCK.MOTION_BLUR_VALUE_OUT_OF_RANGE'
    }

    // The scene keeps the block flag and the shutter settings.
    // A video export of this scene in the browser, on mobile or with the
    // CE.SDK Renderer draws the motion blur.
    mkdirSync('output', { recursive: true });
    const sceneString = await engine.scene.saveToString();
    writeFileSync('output/motion-blur.scene', sceneString);
    console.log('Scene saved to output/motion-blur.scene');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
