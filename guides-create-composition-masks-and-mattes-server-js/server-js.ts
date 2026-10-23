import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Masks and Mattes
 *
 * Demonstrates how to cut blocks down with masks and track mattes:
 * - Creating a mask with a shape and attaching it to a block
 * - Mask feather, expansion, opacity and inversion
 * - Combining masks with mask modes
 * - Reading, removing and inserting masks
 * - Masking a block with the luminance of another block
 * - The matte source rules and the SVG export limits
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1500);
    engine.block.setHeight(page, 500);
    engine.block.appendChild(scene, page);

    // A 400 by 400 square graphic at a given x position
    const addSquare = (x: number, fill: number): number => {
      const block = engine.block.create('graphic');
      engine.block.setShape(block, engine.block.createShape('rect'));
      engine.block.setFill(block, fill);
      engine.block.setWidth(block, 400);
      engine.block.setHeight(block, 400);
      engine.block.setPositionX(block, x);
      engine.block.setPositionY(block, 50);
      engine.block.appendChild(page, block);
      return block;
    };

    const purple = engine.block.createFill('color');
    engine.block.setColor(purple, 'fill/color/value', {
      r: 0.5,
      g: 0.2,
      b: 0.9,
      a: 1
    });
    const ringBlock = addSquare(50, purple);

    console.log(engine.block.supportsMasks(ringBlock)); // true
    console.log(engine.block.supportsMasks(page)); // false

    // The ellipse fills the frame of the masked block
    const outerMask = engine.block.createMask();
    engine.block.setShape(outerMask, engine.block.createShape('ellipse'));
    engine.block.appendMask(ringBlock, outerMask);

    // Soften the edge by 20 units and let 80% of the block show through
    engine.block.setFloat(outerMask, 'mask/feather', 20);
    engine.block.setFloat(outerMask, 'mask/opacity', 0.8);

    // Shrink a second ellipse by 100 units and subtract it to cut a ring
    const innerMask = engine.block.createMask();
    engine.block.setShape(innerMask, engine.block.createShape('ellipse'));
    engine.block.setFloat(innerMask, 'mask/expansion', -100);
    engine.block.setEnum(innerMask, 'mask/mode', 'Subtract');
    engine.block.appendMask(ringBlock, innerMask);

    const teal = engine.block.createFill('color');
    engine.block.setColor(teal, 'fill/color/value', {
      r: 0,
      g: 0.6,
      b: 0.6,
      a: 1
    });
    const starBlock = addSquare(550, teal);

    // An inverted mask keeps the area outside its shape: a star-shaped hole
    const starMask = engine.block.createMask();
    engine.block.setShape(starMask, engine.block.createShape('star'));
    engine.block.setBool(starMask, 'mask/inverted', true);
    engine.block.appendMask(starBlock, starMask);

    console.log(engine.block.getMasks(ringBlock)); // [outerMask, innerMask]

    // Removing a mask does not destroy it
    engine.block.removeMask(ringBlock, 1);
    console.log(engine.block.isValid(innerMask)); // true

    // Insert it again after the outer mask
    engine.block.insertMask(ringBlock, innerMask, 1);

    const orange = engine.block.createFill('color');
    engine.block.setColor(orange, 'fill/color/value', {
      r: 1,
      g: 0.5,
      b: 0,
      a: 1
    });
    const target = addSquare(1050, orange);

    // The matte source: a gradient from white at the top to black at the bottom
    const gradient = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradient, 'fill/gradient/colors', [
      { color: { r: 1, g: 1, b: 1, a: 1 }, stop: 0 },
      { color: { r: 0, g: 0, b: 0, a: 1 }, stop: 1 }
    ]);
    const source = addSquare(1050, gradient);

    // The target shows where the source is bright. The source is not drawn.
    engine.block.setMatte(target, source, 'Luma');

    console.log(engine.block.getMatte(target)); // { source, mode: 'Luma' }
    console.log(engine.block.getMatte(ringBlock)); // null

    try {
      // A block cannot use itself as its matte source
      engine.block.setMatte(target, target);
    } catch (error) {
      // Engine errors carry a stable catalog id in `code`
      const { code } = error as { code?: string };
      console.log(code); // 'BLOCK.MATTE_SOURCE_INVALID'
    }

    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const png = await engine.block.export(page, { mimeType: 'image/png' });
    writeFileSync(
      `${outputDir}/masks-and-mattes.png`,
      Buffer.from(await png.arrayBuffer())
    );

    // SVG export ignores the mask opacity and feather, and draws the matted
    // block whole
    const svg = await engine.block.export(page, { mimeType: 'image/svg+xml' });
    writeFileSync(
      `${outputDir}/masks-and-mattes.svg`,
      Buffer.from(await svg.arrayBuffer())
    );

    console.log('Exported output/masks-and-mattes.png and .svg');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
