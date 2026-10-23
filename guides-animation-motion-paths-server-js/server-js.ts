import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Motion Paths Guide
 *
 * Demonstrates how a block moves along a motion path:
 * - A curved path through vec2 position keyframes with spatial tangents
 * - A straight path without tangents
 * - Reading the keyframes and the static position back
 * - A single-axis track that overrides one axis of the path
 * - The errors for wrong value kinds and tangents
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a 5 second page
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.appendChild(scene, page);
    engine.block.setDuration(page, 5);

    // Both tangents of a segment sit on its first keyframe. `spatialOut` is
    // relative to this keyframe's value, `spatialIn` to the next one's.
    const ball = createCircle(engine, page, 80, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    engine.block.setVec2(ball, 'position', { x: 200, y: 800 });
    engine.block.setKeyframes(ball, 'position', [
      {
        time: 0,
        value: { type: 'Vec2', value: { x: 200, y: 800 } },
        spatialOut: { x: 0, y: -400 },
        spatialIn: { x: -400, y: 0 }
      },
      {
        time: 0.5,
        value: { type: 'Vec2', value: { x: 920, y: 300 } },
        spatialOut: { x: 400, y: 0 },
        spatialIn: { x: 0, y: -400 }
      },
      { time: 1, value: { type: 'Vec2', value: { x: 1640, y: 800 } } }
    ]);
    console.log(engine.block.getVec2(ball, 'position')); // { x: 200, y: 800 }

    const dot = createCircle(engine, page, 40, {
      r: 0.9,
      g: 0.3,
      b: 0.4,
      a: 1
    });
    engine.block.setVec2(dot, 'position', { x: 200, y: 980 });
    engine.block.setKeyframes(dot, 'position', [
      { time: 0, value: { type: 'Vec2', value: { x: 200, y: 980 } } },
      { time: 1, value: { type: 'Vec2', value: { x: 1680, y: 980 } } }
    ]);

    const keyframes = engine.block.getKeyframes(ball, 'position');
    console.log(keyframes.length, keyframes[0].spatialOut); // 3 { x: 0, y: -400 }

    // The `position/y` track replaces the y-axis of the `position` track
    const hopper = createCircle(engine, page, 60, {
      r: 0.2,
      g: 0.7,
      b: 0.3,
      a: 1
    });
    engine.block.setKeyframes(hopper, 'position', [
      { time: 0, value: { type: 'Vec2', value: { x: 200, y: 100 } } },
      { time: 1, value: { type: 'Vec2', value: { x: 1660, y: 100 } } }
    ]);
    engine.block.setKeyframes(hopper, 'position/y', [
      { time: 0, value: { type: 'Float', value: 160 } },
      { time: 0.25, value: { type: 'Float', value: 40 } },
      { time: 0.5, value: { type: 'Float', value: 160 } },
      { time: 0.75, value: { type: 'Float', value: 40 } },
      { time: 1, value: { type: 'Float', value: 160 } }
    ]);

    try {
      // A motion path takes 'Vec2' values only
      engine.block.setKeyframes(ball, 'position', [
        { time: 0, value: { type: 'Float', value: 0 } }
      ]);
    } catch (error) {
      // Engine errors carry a stable catalog id in `code`
      const { code } = error as { code?: string };
      console.log(code); // 'BLOCK.KEYFRAMES_VALUE_KIND_MISMATCH'
    }
    try {
      // A single axis takes no spatial tangents
      engine.block.setKeyframes(ball, 'position/x', [
        {
          time: 0,
          value: { type: 'Float', value: 0 },
          spatialOut: { x: 10, y: 0 }
        }
      ]);
    } catch (error) {
      const { code } = error as { code?: string };
      console.log(code); // 'BLOCK.KEYFRAMES_SPATIAL_TANGENT_UNSUPPORTED'
    }

    // Export the frame at 1.25 seconds, while the ball climbs its path
    engine.block.setPlaybackTime(page, 1.25);
    mkdirSync('output', { recursive: true });
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    writeFileSync(
      'output/motion-paths.png',
      Buffer.from(await blob.arrayBuffer())
    );
    console.log('Frame saved to output/motion-paths.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

/** Creates a circle graphic of the given size and color on the page. */
function createCircle(
  engine: CreativeEngine,
  page: number,
  size: number,
  color: { r: number; g: number; b: number; a: number }
): number {
  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('ellipse'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', color);
  engine.block.setFill(block, fill);
  engine.block.setWidth(block, size);
  engine.block.setHeight(block, size);
  engine.block.appendChild(page, block);
  engine.block.setDuration(block, 5);
  return block;
}

main().catch(console.error);
