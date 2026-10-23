import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Stroke Effect
 *
 * Draws three strokes along an ellipse mask:
 * - Over the image
 * - On transparency
 * - Along half of the mask path
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 1200, height: 400 } }
    });

    const page = engine.block.findByType('page')[0];

    // Adds a 360 x 270 image block to the page at a position
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const addImageBlock = async (x: number, y: number) => {
      const block = await engine.block.addImage(imageUri, {
        size: { width: 360, height: 270 }
      });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, x);
      engine.block.setPositionY(block, y);
      return block;
    };

    const originalBlock = await addImageBlock(30, 65);
    const transparentBlock = await addImageBlock(420, 65);
    const trimmedBlock = await addImageBlock(810, 65);

    // An ellipse mask in the 'None' mode gives the stroke a path
    // and keeps the whole block
    const addEllipseMask = (block: number) => {
      const mask = engine.block.createMask();
      engine.block.setShape(mask, engine.block.createShape('ellipse'));
      engine.block.setEnum(mask, 'mask/mode', 'None');
      engine.block.appendMask(block, mask);
    };

    addEllipseMask(originalBlock);
    addEllipseMask(transparentBlock);
    addEllipseMask(trimmedBlock);

    // A hard yellow brush with a radius of 6 design units, so 12 wide
    const strokeColor = { r: 1, g: 0.8, b: 0.1, a: 1 };
    const stroke = engine.block.createEffect('stroke');
    engine.block.setColor(stroke, 'effect/stroke/color', strokeColor);
    engine.block.setFloat(stroke, 'effect/stroke/brushSize', 6);
    engine.block.setFloat(stroke, 'effect/stroke/hardness', 1);
    engine.block.appendEffect(originalBlock, stroke);

    // Stroke the first mask and draw only the stroke, not the image
    const transparentStroke = engine.block.createEffect('stroke');
    engine.block.setInt(transparentStroke, 'effect/stroke/maskIndex', 0);
    engine.block.setBool(transparentStroke, 'effect/stroke/allMasks', false);
    engine.block.setEnum(
      transparentStroke,
      'effect/stroke/paintStyle',
      'OnTransparent'
    );
    engine.block.setColor(
      transparentStroke,
      'effect/stroke/color',
      strokeColor
    );
    engine.block.setFloat(transparentStroke, 'effect/stroke/brushSize', 6);
    engine.block.appendEffect(transparentBlock, transparentStroke);

    // Draw only the first half of the mask path
    const trimmedStroke = engine.block.createEffect('stroke');
    engine.block.setFloat(trimmedStroke, 'effect/stroke/start', 0);
    engine.block.setFloat(trimmedStroke, 'effect/stroke/end', 0.5);
    engine.block.setColor(trimmedStroke, 'effect/stroke/color', strokeColor);
    engine.block.setFloat(trimmedStroke, 'effect/stroke/brushSize', 6);
    engine.block.appendEffect(trimmedBlock, trimmedStroke);

    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/stroke-effect.png`, buffer);

    console.log('Exported result to output/stroke-effect.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
