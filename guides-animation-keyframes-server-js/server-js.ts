import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Keyframes
 *
 * Demonstrates how to animate block properties with keyframes:
 * - Checking which properties accept keyframes
 * - Number, color and discrete keyframe values
 * - Preset, bezier and hold easing
 * - Absolute and relative tracks
 * - Motion paths and scale
 * - Anchor, skew, auto-orient and transform parents
 * - Reading tracks back and removing them
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

    // A 5 second rectangle with a color fill and a rect shape
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    engine.block.setFill(block, engine.block.createFill('color'));
    engine.block.setWidth(block, 600);
    engine.block.setHeight(block, 400);
    engine.block.setPositionX(block, 360);
    engine.block.setPositionY(block, 340);
    engine.block.appendChild(page, block);
    engine.block.setDuration(block, 5);

    // The fill and the shape own their properties and their keyframes
    const fill = engine.block.getFill(block);
    const shape = engine.block.getShape(block);

    console.log(engine.block.isPropertyAnimatable(block, 'opacity')); // true
    console.log(engine.block.isPropertyAnimatable(fill, 'fill/color/value')); // true
    console.log(engine.block.isPropertyAnimatable(block, 'visible')); // false

    // Fade in during the first 40% of the block's duration (2 seconds)
    engine.block.setKeyframes(block, 'opacity', [
      {
        time: 0,
        value: { type: 'Float', value: 0 },
        easing: { type: 'Preset', preset: 'EaseOut' }
      },
      { time: 0.4, value: { type: 'Float', value: 1 } }
    ]);

    // Orange, then a hold on purple, then a fade to teal
    engine.block.setKeyframes(fill, 'fill/color/value', [
      {
        time: 0,
        value: { type: 'Color', value: { r: 1, g: 0.5, b: 0, a: 1 } }
      },
      {
        time: 0.5,
        value: { type: 'Color', value: { r: 0.5, g: 0.2, b: 0.9, a: 1 } },
        easing: { type: 'Hold' }
      },
      {
        time: 0.75,
        value: { type: 'Color', value: { r: 0.4, g: 0.8, b: 0.8, a: 1 } }
      },
      {
        time: 1,
        value: { type: 'Color', value: { r: 0, g: 0.6, b: 0.6, a: 1 } }
      }
    ]);

    // Grow every corner radius with a CSS-style cubic bezier
    const corners = ['TL', 'TR', 'BL', 'BR'];
    for (const corner of corners) {
      engine.block.setKeyframes(shape, `shape/rect/cornerRadius${corner}`, [
        {
          time: 0,
          value: { type: 'Float', value: 0 },
          easing: {
            type: 'Bezier',
            out: { x: 0.7, y: 0 },
            in: { x: 0.3, y: 1 }
          }
        },
        { time: 1, value: { type: 'Float', value: 200 } }
      ]);
    }

    // Slide 600 units to the right of the block's static x position
    engine.block.setKeyframes(
      block,
      'position/x',
      [
        { time: 0, value: { type: 'Float', value: 0 } },
        { time: 1, value: { type: 'Float', value: 600 } }
      ],
      'Relative'
    );

    // Switch the stroke on halfway; discrete values never interpolate
    engine.block.setStrokeWidth(block, 12);
    engine.block.setStrokeColor(block, { r: 0, g: 0, b: 0, a: 1 });
    engine.block.setKeyframes(block, 'stroke/enabled', [
      { time: 0, value: { type: 'Discrete', value: false } },
      { time: 0.5, value: { type: 'Discrete', value: true } }
    ]);

    // A dot follows a curved path. Vec2 keyframes animate `position/x` and
    // `position/y` together, and the tangents bend the path upward.
    const dot = engine.block.create('graphic');
    engine.block.setShape(dot, engine.block.createShape('ellipse'));
    const dotFill = engine.block.createFill('color');
    engine.block.setColor(dotFill, 'fill/color/value', {
      r: 0.9,
      g: 0.2,
      b: 0.4,
      a: 1
    });
    engine.block.setFill(dot, dotFill);
    engine.block.setWidth(dot, 120);
    engine.block.setHeight(dot, 120);
    engine.block.appendChild(page, dot);
    engine.block.setDuration(dot, 5);
    // The static position is the start of the path.
    engine.block.setVec2(dot, 'position', { x: 200, y: 900 });

    engine.block.setKeyframes(dot, 'position', [
      {
        time: 0,
        value: { type: 'Vec2', value: { x: 200, y: 900 } },
        spatialOut: { x: 300, y: -600 },
        spatialIn: { x: -300, y: -600 }
      },
      { time: 1, value: { type: 'Vec2', value: { x: 1600, y: 900 } } }
    ]);

    // Pulse the dot to 1.5 times its size and back. Its frame does not change.
    for (const axis of ['x', 'y']) {
      engine.block.setKeyframes(dot, `transform/scale/${axis}`, [
        { time: 0, value: { type: 'Float', value: 1 } },
        { time: 0.5, value: { type: 'Float', value: 1.5 } },
        { time: 1, value: { type: 'Float', value: 1 } }
      ]);
    }

    // A bar that leans by 20 degrees and turns half a turn about its centre.
    // The anchor is in design units from the top-left corner of the frame.
    const bar = engine.block.create('graphic');
    engine.block.setShape(bar, engine.block.createShape('rect'));
    engine.block.setFill(bar, engine.block.createFill('color'));
    engine.block.setWidth(bar, 320);
    engine.block.setHeight(bar, 80);
    engine.block.setPositionX(bar, 120);
    engine.block.setPositionY(bar, 120);
    engine.block.appendChild(page, bar);
    engine.block.setDuration(bar, 5);
    engine.block.setFloat(bar, 'transform/anchor/x', 160);
    engine.block.setFloat(bar, 'transform/anchor/y', 40);
    engine.block.setFloat(bar, 'transform/skew', 20);
    engine.block.setKeyframes(bar, 'rotation', [
      { time: 0, value: { type: 'Float', value: 0 } },
      { time: 1, value: { type: 'Float', value: Math.PI } }
    ]);

    // The bar has an anchor, so its rotation track turns it about the anchor.
    // A graphic or text without an anchor turns about its frame centre.
    console.log(engine.block.hasTransformAnchor(bar)); // true

    // A bar on a wavy path turns to follow the direction of its motion
    const arrow = engine.block.create('graphic');
    engine.block.setShape(arrow, engine.block.createShape('rect'));
    const arrowFill = engine.block.createFill('color');
    engine.block.setColor(arrowFill, 'fill/color/value', {
      r: 0.1,
      g: 0.6,
      b: 0.3,
      a: 1
    });
    engine.block.setFill(arrow, arrowFill);
    engine.block.setWidth(arrow, 160);
    engine.block.setHeight(arrow, 40);
    engine.block.appendChild(page, arrow);
    engine.block.setDuration(arrow, 5);
    engine.block.setFloat(arrow, 'transform/anchor/x', 80);
    engine.block.setFloat(arrow, 'transform/anchor/y', 20);
    engine.block.setVec2(arrow, 'position', { x: 700, y: 140 });
    engine.block.setKeyframes(arrow, 'position', [
      {
        time: 0,
        value: { type: 'Vec2', value: { x: 700, y: 140 } },
        spatialOut: { x: 300, y: 150 },
        spatialIn: { x: -300, y: -150 }
      },
      { time: 1, value: { type: 'Vec2', value: { x: 1600, y: 140 } } }
    ]);
    engine.block.setBool(arrow, 'transform/autoOrient', true);

    // A square rides in front of the arrow. Its position is read in the
    // arrow's local space, so it moves and turns with the arrow.
    const rider = engine.block.create('graphic');
    engine.block.setShape(rider, engine.block.createShape('rect'));
    const riderFill = engine.block.createFill('color');
    engine.block.setColor(riderFill, 'fill/color/value', {
      r: 0.95,
      g: 0.7,
      b: 0.1,
      a: 1
    });
    engine.block.setFill(rider, riderFill);
    engine.block.setWidth(rider, 40);
    engine.block.setHeight(rider, 40);
    engine.block.setPositionX(rider, 170);
    engine.block.setPositionY(rider, 0);
    engine.block.appendChild(page, rider);
    engine.block.setTransformParent(rider, arrow);
    console.log(engine.block.getTransformParent(rider) === arrow); // true

    try {
      // The arrow cannot follow a block that follows the arrow
      engine.block.setTransformParent(arrow, rider);
    } catch (error) {
      const { code } = error as { code?: string };
      console.log(code); // 'BLOCK.TRANSFORM_PARENT_CYCLE'
    }

    console.log(engine.block.getAnimatedProperties(block));
    // ['opacity', 'position/x', 'stroke/enabled']

    const opacityKeyframes = engine.block.getKeyframes(block, 'opacity');
    console.log(opacityKeyframes[1].easing);
    // { type: 'Preset', preset: 'Linear' }, the default

    console.log(engine.block.getKeyframeMode(block, 'position/x')); // 'Relative'

    // Changes the static value only. The absolute opacity track still replaces it.
    engine.block.setOpacity(block, 0.5);
    console.log(engine.block.getKeyframes(block, 'opacity').length); // 2

    // The bottom corners return to their static radius of 0
    engine.block.removeKeyframes(shape, 'shape/rect/cornerRadiusBL');
    engine.block.removeKeyframes(shape, 'shape/rect/cornerRadiusBR');
    console.log(engine.block.getAnimatedProperties(shape));
    // ['shape/rect/cornerRadiusTL', 'shape/rect/cornerRadiusTR']

    try {
      engine.block.setKeyframes(block, 'visible', [
        { time: 0, value: { type: 'Discrete', value: true } }
      ]);
    } catch (error) {
      // Engine errors carry a stable catalog id in `code`
      const { code } = error as { code?: string };
      console.log(code); // 'BLOCK.KEYFRAMES_PROPERTY_NOT_ANIMATABLE'
    }

    // Export the frame at 2.5 seconds, halfway through the animation
    engine.block.setPlaybackTime(page, 2.5);

    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/keyframes.png`, buffer);

    console.log('Exported result to output/keyframes.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
