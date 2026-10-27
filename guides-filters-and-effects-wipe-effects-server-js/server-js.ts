import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Wipe Effects
 *
 * Wipes three copies of one image in three ways:
 * - A linear wipe
 * - A radial wipe
 * - Venetian blinds
 * Then reveals a fourth copy over two seconds with keyframes.
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a timeline, as the Keyframes guide does
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.appendChild(scene, page);

    // Adds a 720 x 405 image block to the page at a position
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const addImageBlock = async (x: number, y: number) => {
      const block = await engine.block.addImage(imageUri, {
        size: { width: 720, height: 405 }
      });
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, x);
      engine.block.setPositionY(block, y);
      return block;
    };

    const linearBlock = await addImageBlock(180, 90);
    const radialBlock = await addImageBlock(1020, 90);
    const blindsBlock = await addImageBlock(180, 585);
    const revealBlock = await addImageBlock(1020, 585);

    // Hide the left half of the block with a soft edge of 40 design units
    const linearWipe = engine.block.createEffect('linear_wipe');
    engine.block.setFloat(linearWipe, 'effect/linear_wipe/angle', 90);
    engine.block.setFloat(linearWipe, 'effect/linear_wipe/completion', 0.5);
    engine.block.setFloat(linearWipe, 'effect/linear_wipe/feather', 40);
    engine.block.appendEffect(linearBlock, linearWipe);

    // Sweep clockwise from 12 o'clock and hide 60% of the circle
    const radialWipe = engine.block.createEffect('radial_wipe');
    engine.block.setFloat(radialWipe, 'effect/radial_wipe/completion', 0.6);
    engine.block.setFloat(radialWipe, 'effect/radial_wipe/startAngle', 0);
    engine.block.setFloat(radialWipe, 'effect/radial_wipe/centerX', 0.5);
    engine.block.setFloat(radialWipe, 'effect/radial_wipe/centerY', 0.5);
    engine.block.setEnum(
      radialWipe,
      'effect/radial_wipe/direction',
      'Clockwise'
    );
    engine.block.setFloat(radialWipe, 'effect/radial_wipe/feather', 20);
    engine.block.appendEffect(radialBlock, radialWipe);

    // Diagonal stripes 60 design units wide, each half hidden
    const blinds = engine.block.createEffect('venetian_blinds');
    engine.block.setFloat(blinds, 'effect/venetian_blinds/completion', 0.5);
    engine.block.setFloat(blinds, 'effect/venetian_blinds/direction', 45);
    engine.block.setFloat(blinds, 'effect/venetian_blinds/width', 60);
    engine.block.setFloat(blinds, 'effect/venetian_blinds/feather', 2);
    engine.block.appendEffect(blindsBlock, blinds);

    // Reveal the block from the right during its 2 seconds
    engine.block.setDuration(revealBlock, 2);
    const reveal = engine.block.createEffect('linear_wipe');
    engine.block.setFloat(reveal, 'effect/linear_wipe/angle', 90);
    engine.block.appendEffect(revealBlock, reveal);

    // Keyframe times are relative to the block's duration, from 0 to 1
    engine.block.setKeyframes(reveal, 'effect/linear_wipe/completion', [
      {
        time: 0,
        value: { type: 'Float', value: 1 },
        easing: { type: 'Preset', preset: 'EaseOut' }
      },
      { time: 1, value: { type: 'Float', value: 0 } }
    ]);
    console.log(
      engine.block.getKeyframes(reveal, 'effect/linear_wipe/completion').length
    ); // 2

    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Export two frames of the reveal: early, and near the end
    for (const time of [0.5, 1.5]) {
      engine.block.setPlaybackTime(page, time);
      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      const buffer = Buffer.from(await blob.arrayBuffer());
      writeFileSync(`${outputDir}/wipe-effects-${time}s.png`, buffer);
      console.log(`Exported result to output/wipe-effects-${time}s.png`);
    }
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
