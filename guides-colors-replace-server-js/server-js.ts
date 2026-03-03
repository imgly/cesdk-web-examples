import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { calculateGridLayout } from './utils';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Replace Colors
 *
 * Demonstrates color replacement using Recolor and Green Screen effects:
 * - Creating and applying Recolor effects
 * - Creating and applying Green Screen effects
 * - Configuring effect properties
 * - Managing multiple effects
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } },
  });
  const page = engine.block.findByType('page')[0];

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Calculate responsive grid layout for 6 examples
  const layout = calculateGridLayout(pageWidth, pageHeight, 6);
  const { blockWidth, blockHeight, getPosition } = layout;

  // Use sample images for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const blockSize = { width: blockWidth, height: blockHeight };

  // Create a Recolor effect to swap red colors to blue
  const block1 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block1);

  const recolorEffect = engine.block.createEffect('recolor');
  engine.block.setColor(recolorEffect, 'effect/recolor/fromColor', {
    r: 1.0,
    g: 0.0,
    b: 0.0,
    a: 1.0,
  }); // Red source color
  engine.block.setColor(recolorEffect, 'effect/recolor/toColor', {
    r: 0.0,
    g: 0.5,
    b: 1.0,
    a: 1.0,
  }); // Blue target color
  engine.block.appendEffect(block1, recolorEffect);

  // Configure color matching precision for Recolor effect
  const block2 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block2);

  const recolorEffect2 = engine.block.createEffect('recolor');
  engine.block.setColor(recolorEffect2, 'effect/recolor/fromColor', {
    r: 0.8,
    g: 0.6,
    b: 0.4,
    a: 1.0,
  }); // Skin tone source
  engine.block.setColor(recolorEffect2, 'effect/recolor/toColor', {
    r: 0.3,
    g: 0.7,
    b: 0.3,
    a: 1.0,
  }); // Green tint
  // Adjust color match tolerance (0-1, higher = more inclusive)
  engine.block.setFloat(recolorEffect2, 'effect/recolor/colorMatch', 0.3);
  // Adjust brightness match tolerance
  engine.block.setFloat(recolorEffect2, 'effect/recolor/brightnessMatch', 0.2);
  // Adjust edge smoothness
  engine.block.setFloat(recolorEffect2, 'effect/recolor/smoothness', 0.1);
  engine.block.appendEffect(block2, recolorEffect2);

  // Create a Green Screen effect to remove green backgrounds
  const block3 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block3);

  const greenScreenEffect = engine.block.createEffect('green_screen');
  // Specify the color to remove (green)
  engine.block.setColor(greenScreenEffect, 'effect/green_screen/fromColor', {
    r: 0.0,
    g: 1.0,
    b: 0.0,
    a: 1.0,
  });
  engine.block.appendEffect(block3, greenScreenEffect);

  // Fine-tune Green Screen removal parameters
  const block4 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block4);

  const greenScreenEffect2 = engine.block.createEffect('green_screen');
  engine.block.setColor(greenScreenEffect2, 'effect/green_screen/fromColor', {
    r: 0.2,
    g: 0.8,
    b: 0.3,
    a: 1.0,
  }); // Specific green shade
  // Adjust color match tolerance
  engine.block.setFloat(
    greenScreenEffect2,
    'effect/green_screen/colorMatch',
    0.4
  );
  // Adjust edge smoothness for cleaner removal
  engine.block.setFloat(
    greenScreenEffect2,
    'effect/green_screen/smoothness',
    0.2
  );
  // Reduce color spill from green background
  engine.block.setFloat(greenScreenEffect2, 'effect/green_screen/spill', 0.5);
  engine.block.appendEffect(block4, greenScreenEffect2);

  // Demonstrate managing multiple effects on a block
  const block5 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block5);

  // Add multiple effects to the same block
  const recolor1 = engine.block.createEffect('recolor');
  engine.block.setColor(recolor1, 'effect/recolor/fromColor', {
    r: 1.0,
    g: 0.0,
    b: 0.0,
    a: 1.0,
  });
  engine.block.setColor(recolor1, 'effect/recolor/toColor', {
    r: 0.0,
    g: 0.0,
    b: 1.0,
    a: 1.0,
  });
  engine.block.appendEffect(block5, recolor1);

  const recolor2 = engine.block.createEffect('recolor');
  engine.block.setColor(recolor2, 'effect/recolor/fromColor', {
    r: 0.0,
    g: 1.0,
    b: 0.0,
    a: 1.0,
  });
  engine.block.setColor(recolor2, 'effect/recolor/toColor', {
    r: 1.0,
    g: 0.5,
    b: 0.0,
    a: 1.0,
  });
  engine.block.appendEffect(block5, recolor2);

  // Get all effects on the block
  const effects = engine.block.getEffects(block5);
  // eslint-disable-next-line no-console
  console.log('Number of effects:', effects.length); // 2

  // Disable the first effect without removing it
  engine.block.setEffectEnabled(effects[0], false);

  // Check if effect is enabled
  const isEnabled = engine.block.isEffectEnabled(effects[0]);
  // eslint-disable-next-line no-console
  console.log('First effect enabled:', isEnabled); // false

  // Apply consistent color replacement across multiple blocks
  const block6 = await engine.block.addImage(imageUri, { size: blockSize });
  engine.block.appendChild(page, block6);

  // Find all image blocks in the scene
  const allBlocks = engine.block.findByType('//ly.img.ubq/graphic');

  // Apply a consistent recolor effect to each block
  allBlocks.forEach((blockId) => {
    // Skip if block already has effects
    if (engine.block.getEffects(blockId).length > 0) {
      return;
    }

    const batchRecolor = engine.block.createEffect('recolor');
    engine.block.setColor(batchRecolor, 'effect/recolor/fromColor', {
      r: 0.8,
      g: 0.7,
      b: 0.6,
      a: 1.0,
    });
    engine.block.setColor(batchRecolor, 'effect/recolor/toColor', {
      r: 0.6,
      g: 0.7,
      b: 0.9,
      a: 1.0,
    });
    engine.block.setFloat(batchRecolor, 'effect/recolor/colorMatch', 0.25);
    engine.block.appendEffect(blockId, batchRecolor);
  });

  // Position all blocks in a grid layout
  const blocks = [block1, block2, block3, block4, block5, block6];
  blocks.forEach((block, index) => {
    const pos = getPosition(index);
    engine.block.setPositionX(block, pos.x);
    engine.block.setPositionY(block, pos.y);
  });

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/replace-colors-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported result to output/replace-colors-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
