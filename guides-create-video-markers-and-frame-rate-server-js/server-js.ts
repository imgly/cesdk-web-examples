import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Markers and Frame Rate Guide
 *
 * Demonstrates the timeline settings of a scene:
 * - Reading and setting the frame rate
 * - Adding, reading and removing markers
 * - Seeking to a marker
 * - The errors for invalid values
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a 10 second page
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.appendChild(scene, page);
    engine.block.setDuration(page, 10);

    // A ball crosses the page over the 10 seconds of the page
    createBall(engine, page);

    // 30 frames per second by default
    console.log(engine.block.getFloat(scene, 'scene/frameRate')); // 30
    engine.block.setFloat(scene, 'scene/frameRate', 25);

    // A marker has a name, a start time and a duration in seconds.
    // A duration of 0 marks a point.
    engine.scene.addMarker('intro', 0, 2.5);
    engine.scene.addMarker('beat', 4);
    engine.scene.addMarker('beat', 6);
    engine.scene.addMarker('outro', 8, 2);

    const markers = engine.scene.getMarkers();
    console.log(markers.map((marker) => marker.name)); // ['intro', 'beat', 'beat', 'outro']

    // Jump to the first marker named 'beat'
    const beat = markers.find((marker) => marker.name === 'beat');
    if (beat) {
      engine.block.setPlaybackTime(page, beat.time);
    }
    console.log(engine.block.getPlaybackTime(page)); // 4

    // Remove the second 'beat' by its index in the list
    engine.scene.removeMarker(2);
    console.log(engine.scene.getMarkers().length); // 3

    try {
      // A frame rate is greater than 0 and at most 240
      engine.block.setFloat(scene, 'scene/frameRate', 0);
    } catch (error) {
      // Engine errors carry a stable catalog id in `code`
      const { code } = error as { code?: string };
      console.log(code); // 'SCENE.FRAME_RATE_OUT_OF_RANGE'
    }
    try {
      engine.scene.addMarker('before', -1);
    } catch (error) {
      const { code } = error as { code?: string };
      console.log(code); // 'SCENE.MARKER_INVALID_TIME'
    }
    try {
      engine.scene.removeMarker(10);
    } catch (error) {
      const { code } = error as { code?: string };
      console.log(code); // 'SCENE.MARKER_INDEX_OUT_OF_RANGE'
    }

    // The playback time is at the 'beat' marker, 4 seconds into the page
    mkdirSync('output', { recursive: true });
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    writeFileSync(
      'output/markers-and-frame-rate.png',
      Buffer.from(await blob.arrayBuffer())
    );
    console.log('Frame saved to output/markers-and-frame-rate.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

/** Creates a ball that crosses the page in 10 seconds. */
function createBall(engine: CreativeEngine, page: number): void {
  const ball = engine.block.create('graphic');
  engine.block.setShape(ball, engine.block.createShape('ellipse'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.9,
    a: 1
  });
  engine.block.setFill(ball, fill);
  engine.block.setWidth(ball, 160);
  engine.block.setHeight(ball, 160);
  engine.block.setPositionY(ball, 460);
  engine.block.appendChild(page, ball);
  engine.block.setDuration(ball, 10);
  engine.block.setKeyframes(ball, 'position/x', [
    { time: 0, value: { type: 'Float', value: 100 } },
    { time: 1, value: { type: 'Float', value: 1660 } }
  ]);
}

main().catch(console.error);
