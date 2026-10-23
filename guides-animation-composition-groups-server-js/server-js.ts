import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Composition Groups Guide
 *
 * Demonstrates how a composition group gives its children their own clock:
 * - Turning composition on
 * - Running the children faster with the group speed
 * - Starting the children with the group
 * - A plain group that ignores its speed
 * - The error for a speed below the minimum
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a 6 second page
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.appendChild(scene, page);
    engine.block.setDuration(page, 6);

    // The first lane is a composition group. Its children run on the group's
    // own clock, which starts when the group starts on the page.
    const normal = createLane(engine, page, 150, {
      r: 0.6,
      g: 0.6,
      b: 0.6,
      a: 1
    });
    engine.block.setBool(normal, 'group/composition', true);
    console.log(engine.block.getBool(normal, 'group/composition')); // true

    // At speed 2, the children see 2 seconds for every second of the page
    const fast = createLane(engine, page, 400, {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1
    });
    engine.block.setBool(fast, 'group/composition', true);
    engine.block.setPlaybackSpeed(fast, 2);
    console.log(engine.block.getPlaybackSpeed(fast)); // 2

    // The group starts 1 second into the page, and its children start with it
    const late = createLane(engine, page, 650, {
      r: 0.9,
      g: 0.3,
      b: 0.4,
      a: 1
    });
    engine.block.setBool(late, 'group/composition', true);
    engine.block.setTimeOffset(late, 1);
    engine.block.setDuration(late, 5);

    // Without composition, the speed of a group has no effect
    const plain = createLane(engine, page, 900, {
      r: 0.2,
      g: 0.7,
      b: 0.3,
      a: 1
    });
    engine.block.setPlaybackSpeed(plain, 2);
    console.log(engine.block.getBool(plain, 'group/composition')); // false

    try {
      // A group runs at 0.25 times the page speed or faster
      engine.block.setPlaybackSpeed(normal, 0.1);
    } catch (error) {
      // Engine errors carry a stable catalog id in `code`
      const { code } = error as { code?: string };
      console.log(code); // 'EDITOR.PLAYBACK_SPEED_TOO_LOW'
    }

    // Export the frame at 1.5 seconds
    engine.block.setPlaybackTime(page, 1.5);
    mkdirSync('output', { recursive: true });
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    writeFileSync(
      'output/composition-groups.png',
      Buffer.from(await blob.arrayBuffer())
    );
    console.log('Frame saved to output/composition-groups.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

/**
 * Creates a lane: a group with a line and a ball that crosses the page in
 * 4 seconds of its own time.
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
  // Long enough for every lane clock, so the line stays visible
  engine.block.setDuration(line, 12);

  const ball = engine.block.create('graphic');
  engine.block.setShape(ball, engine.block.createShape('ellipse'));
  const ballFill = engine.block.createFill('color');
  engine.block.setColor(ballFill, 'fill/color/value', color);
  engine.block.setFill(ball, ballFill);
  engine.block.setWidth(ball, 80);
  engine.block.setHeight(ball, 80);
  engine.block.setPositionY(ball, y);
  engine.block.appendChild(page, ball);
  engine.block.setDuration(ball, 4);
  engine.block.setKeyframes(ball, 'position/x', [
    { time: 0, value: { type: 'Float', value: 120 } },
    { time: 1, value: { type: 'Float', value: 1720 } }
  ]);

  const lane = engine.block.group([line, ball]);
  engine.block.setDuration(lane, 6);
  return lane;
}

main().catch(console.error);
