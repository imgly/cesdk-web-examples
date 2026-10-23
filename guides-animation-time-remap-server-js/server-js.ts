import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Time Remap Guide
 *
 * Demonstrates how a composition group remaps the clock of its children:
 * - Freezing the children with a static remap
 * - Playing them in reverse with a remap track
 * - Playing them forward and back with an eased track
 * - Reading the remap back and the error for blocks without a remap
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

    const normal = createLane(engine, page, 150, {
      r: 0.6,
      g: 0.6,
      b: 0.6,
      a: 1
    });
    const frozen = createLane(engine, page, 400, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    const reversed = createLane(engine, page, 650, {
      r: 0.9,
      g: 0.3,
      b: 0.4,
      a: 1
    });
    const pingPong = createLane(engine, page, 900, {
      r: 0.2,
      g: 0.7,
      b: 0.3,
      a: 1
    });
    console.log(engine.block.getBool(normal, 'playback/timeRemapEnabled')); // false

    // A static remap holds the children at 2.5 seconds of their own time
    engine.block.setBool(frozen, 'playback/timeRemapEnabled', true);
    engine.block.setFloat(frozen, 'playback/timeRemap', 2.5);

    // The track values are times on the children's clock, in seconds. They
    // stay below 5, because a clock at a child's end hides the child.
    engine.block.setBool(reversed, 'playback/timeRemapEnabled', true);
    engine.block.setKeyframes(reversed, 'playback/timeRemap', [
      { time: 0, value: { type: 'Float', value: 4.99 } },
      { time: 1, value: { type: 'Float', value: 0 } }
    ]);

    engine.block.setBool(pingPong, 'playback/timeRemapEnabled', true);
    engine.block.setKeyframes(pingPong, 'playback/timeRemap', [
      {
        time: 0,
        value: { type: 'Float', value: 0 },
        easing: { type: 'Preset', preset: 'EaseInOut' }
      },
      {
        time: 0.5,
        value: { type: 'Float', value: 4.99 },
        easing: { type: 'Preset', preset: 'EaseInOut' }
      },
      { time: 1, value: { type: 'Float', value: 0 } }
    ]);

    // The track leaves the static remap unchanged
    console.log(engine.block.getFloat(reversed, 'playback/timeRemap')); // 0
    console.log(
      engine.block.isPropertyAnimatable(reversed, 'playback/timeRemap')
    ); // true

    try {
      // Only a group has a time remap
      const ball = engine.block.getChildren(normal)[1];
      engine.block.setFloat(ball, 'playback/timeRemap', 1);
    } catch (error) {
      // Engine errors carry a stable catalog id in `code`
      const { code } = error as { code?: string };
      console.log(code); // 'EDITOR.BLOCK_NO_TIME_REMAP_SUPPORT'
    }

    // Export the frame at 1.5 seconds
    engine.block.setPlaybackTime(page, 1.5);
    mkdirSync('output', { recursive: true });
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    writeFileSync(
      'output/time-remap.png',
      Buffer.from(await blob.arrayBuffer())
    );
    console.log('Frame saved to output/time-remap.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

/**
 * Creates a lane: a composition group with a line and a ball that crosses
 * the page in 5 seconds of the group's own clock.
 */
function createLane(
  engine: CreativeEngine,
  page: number,
  y: number,
  color: { r: number; g: number; b: number; a: number }
): number {
  const line = engine.block.create('graphic');
  engine.block.setShape(line, engine.block.createShape('rect'));
  const lineFill = engine.block.createFill('color');
  engine.block.setColor(lineFill, 'fill/color/value', {
    r: 0.85,
    g: 0.85,
    b: 0.85,
    a: 1
  });
  engine.block.setFill(line, lineFill);
  engine.block.setWidth(line, 1680);
  engine.block.setHeight(line, 6);
  engine.block.setPositionX(line, 120);
  engine.block.setPositionY(line, y + 37);
  engine.block.appendChild(page, line);
  engine.block.setDuration(line, 5);

  const ball = engine.block.create('graphic');
  engine.block.setShape(ball, engine.block.createShape('ellipse'));
  const ballFill = engine.block.createFill('color');
  engine.block.setColor(ballFill, 'fill/color/value', color);
  engine.block.setFill(ball, ballFill);
  engine.block.setWidth(ball, 80);
  engine.block.setHeight(ball, 80);
  engine.block.setPositionY(ball, y);
  engine.block.appendChild(page, ball);
  engine.block.setDuration(ball, 5);
  engine.block.setKeyframes(ball, 'position/x', [
    { time: 0, value: { type: 'Float', value: 120 } },
    { time: 1, value: { type: 'Float', value: 1720 } }
  ]);

  const lane = engine.block.group([line, ball]);
  engine.block.setDuration(lane, 5);
  // A composition group gives its children their own clock
  engine.block.setBool(lane, 'group/composition', true);
  return lane;
}

main().catch(console.error);
