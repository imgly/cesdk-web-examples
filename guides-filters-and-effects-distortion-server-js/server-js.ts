import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Server Guide: Distortion Effects
 *
 * Demonstrates applying various distortion effects to image blocks:
 * - Checking effect support
 * - Applying liquid distortion
 * - Applying mirror effect
 * - Applying shifter (chromatic aberration)
 * - Applying radial pixel effect
 * - Applying TV glitch effect
 * - Applying corner pin, bulge, wave warp and displacement map effects
 * - Setting and reading the source of a displacement map
 * - Managing effects (enable/disable/remove)
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Calculate responsive grid layout based on page dimensions
  const layout = calculateGridLayout(pageWidth, pageHeight, 10);
  const { blockWidth, blockHeight, getPosition } = layout;

  // Use a sample image URL
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const blockSize = { width: blockWidth, height: blockHeight };

  // Create a sample block to demonstrate effect support checking
  const sampleBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, sampleBlock);

  // Check if a block supports effects before applying them
  const supportsEffects = engine.block.supportsEffects(sampleBlock);
  console.log('Block supports effects:', supportsEffects);

  // Create an image block for liquid distortion demonstration
  const liquidBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, liquidBlock);

  // Create and apply liquid effect - creates flowing, organic warping
  const liquidEffect = engine.block.createEffect('liquid');
  engine.block.setFloat(liquidEffect, 'effect/liquid/amount', 0.5);
  engine.block.setFloat(liquidEffect, 'effect/liquid/scale', 1.0);
  engine.block.setFloat(liquidEffect, 'effect/liquid/time', 0.0);
  engine.block.appendEffect(liquidBlock, liquidEffect);

  // Create an image block for mirror effect demonstration
  const mirrorBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, mirrorBlock);

  // Create and apply mirror effect - reflects image along a side
  const mirrorEffect = engine.block.createEffect('mirror');
  // Side values: 0 = Left, 1 = Right, 2 = Top, 3 = Bottom
  engine.block.setInt(mirrorEffect, 'effect/mirror/side', 0);
  engine.block.appendEffect(mirrorBlock, mirrorEffect);

  // Create an image block for shifter effect demonstration
  const shifterBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, shifterBlock);

  // Create and apply shifter effect - displaces color channels
  const shifterEffect = engine.block.createEffect('shifter');
  engine.block.setFloat(shifterEffect, 'effect/shifter/amount', 0.3);
  engine.block.setFloat(shifterEffect, 'effect/shifter/angle', 0.785);
  engine.block.appendEffect(shifterBlock, shifterEffect);

  // Create an image block for radial pixel effect demonstration
  const radialPixelBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, radialPixelBlock);

  // Create and apply radial pixel effect - pixelates in circular pattern
  const radialPixelEffect = engine.block.createEffect('radial_pixel');
  engine.block.setFloat(radialPixelEffect, 'effect/radial_pixel/radius', 0.5);
  engine.block.setFloat(radialPixelEffect, 'effect/radial_pixel/segments', 0.5);
  engine.block.appendEffect(radialPixelBlock, radialPixelEffect);

  // Create an image block for TV glitch effect demonstration
  const tvGlitchBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, tvGlitchBlock);

  // Create and apply TV glitch effect - simulates analog TV interference
  const tvGlitchEffect = engine.block.createEffect('tv_glitch');
  engine.block.setFloat(tvGlitchEffect, 'effect/tv_glitch/distortion', 0.4);
  engine.block.setFloat(tvGlitchEffect, 'effect/tv_glitch/distortion2', 0.2);
  engine.block.setFloat(tvGlitchEffect, 'effect/tv_glitch/speed', 0.5);
  engine.block.setFloat(tvGlitchEffect, 'effect/tv_glitch/rollSpeed', 0.1);
  engine.block.appendEffect(tvGlitchBlock, tvGlitchEffect);

  // Create an image block for corner pin demonstration
  const cornerPinBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, cornerPinBlock);

  // Move the two upper corners inward; positions are relative to the block size
  const cornerPinEffect = engine.block.createEffect('corner_pin');
  engine.block.setFloat(cornerPinEffect, 'effect/corner_pin/upperLeftX', 0.25);
  engine.block.setFloat(cornerPinEffect, 'effect/corner_pin/upperLeftY', 0.2);
  engine.block.setFloat(cornerPinEffect, 'effect/corner_pin/upperRightX', 0.75);
  engine.block.setFloat(cornerPinEffect, 'effect/corner_pin/upperRightY', 0.2);
  engine.block.appendEffect(cornerPinBlock, cornerPinEffect);

  // Create an image block for bulge demonstration
  const bulgeBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, bulgeBlock);

  // Magnify an ellipse in the center; the radii are in design units
  const bulgeEffect = engine.block.createEffect('bulge');
  engine.block.setFloat(bulgeEffect, 'effect/bulge/centerX', 0.5);
  engine.block.setFloat(bulgeEffect, 'effect/bulge/centerY', 0.5);
  engine.block.setFloat(
    bulgeEffect,
    'effect/bulge/horizontalRadius',
    blockWidth * 0.4
  );
  engine.block.setFloat(
    bulgeEffect,
    'effect/bulge/verticalRadius',
    blockHeight * 0.4
  );
  engine.block.setFloat(bulgeEffect, 'effect/bulge/height', 1.5);
  engine.block.appendEffect(bulgeBlock, bulgeEffect);

  // Create an image block for wave warp demonstration
  const waveWarpBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, waveWarpBlock);

  // Height and width are in design units, so derive them from the block size
  const waveWarpEffect = engine.block.createEffect('wave_warp');
  engine.block.setEnum(waveWarpEffect, 'effect/wave_warp/waveType', 'Sine');
  engine.block.setFloat(
    waveWarpEffect,
    'effect/wave_warp/height',
    blockHeight * 0.05
  );
  engine.block.setFloat(
    waveWarpEffect,
    'effect/wave_warp/width',
    blockWidth * 0.25
  );
  engine.block.appendEffect(waveWarpBlock, waveWarpEffect);

  // Create an image block for displacement map demonstration
  const displacedBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, displacedBlock);

  // The map is a hidden image block. The effect still reads it.
  const mapBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, mapBlock);
  engine.block.setVisible(mapBlock, false);

  const displacementMapEffect = engine.block.createEffect('displacement_map');
  engine.block.setEnum(
    displacementMapEffect,
    'effect/displacement_map/horizontalChannel',
    'Luminance'
  );
  engine.block.setFloat(
    displacementMapEffect,
    'effect/displacement_map/maxHorizontal',
    blockWidth * 0.08
  );
  engine.block.setEnum(
    displacementMapEffect,
    'effect/displacement_map/verticalChannel',
    'Luminance'
  );
  engine.block.setFloat(
    displacementMapEffect,
    'effect/displacement_map/maxVertical',
    blockHeight * 0.08
  );
  engine.block.setEnum(
    displacementMapEffect,
    'effect/displacement_map/mapBehavior',
    'Stretch'
  );
  engine.block.appendEffect(displacedBlock, displacementMapEffect);

  // Set the map block as the source of the effect
  engine.block.setEffectSource(displacementMapEffect, mapBlock);

  const effectSource = engine.block.getEffectSource(displacementMapEffect);
  console.log('Effect source is the map block:', effectSource === mapBlock);

  try {
    // Only the displacement map effect reads a source
    engine.block.setEffectSource(liquidEffect, mapBlock);
  } catch (error) {
    // Engine errors carry a stable catalog id in `code`
    const { code } = error as { code?: string };
    console.log(code); // 'BLOCK.EFFECT_SOURCE_UNSUPPORTED'
  }

  try {
    // A page cannot be a source
    engine.block.setEffectSource(displacementMapEffect, page);
  } catch (error) {
    const { code } = error as { code?: string };
    console.log(code); // 'BLOCK.EFFECT_SOURCE_INVALID'
  }

  // Get all effects applied to a block
  const effects = engine.block.getEffects(tvGlitchBlock);
  console.log('Applied effects:', effects);

  // Get the type of each effect
  effects.forEach((effect, index) => {
    const effectType = engine.block.getType(effect);
    console.log(`Effect ${index}: ${effectType}`);
  });

  // Check if an effect is enabled
  const isEnabled = engine.block.isEffectEnabled(liquidEffect);
  console.log('Liquid effect enabled:', isEnabled);

  // Disable an effect without removing it
  engine.block.setEffectEnabled(liquidEffect, false);
  console.log(
    'Liquid effect now disabled:',
    !engine.block.isEffectEnabled(liquidEffect)
  );

  // Re-enable the effect
  engine.block.setEffectEnabled(liquidEffect, true);

  // To remove an effect, get its index and use removeEffect
  const shifterEffects = engine.block.getEffects(shifterBlock);
  const effectIndex = shifterEffects.indexOf(shifterEffect);
  if (effectIndex !== -1) {
    // Remove effect at the specified index
    engine.block.removeEffect(shifterBlock, effectIndex);

    // Destroy the removed effect to free memory
    engine.block.destroy(shifterEffect);
  }

  // Re-add the effect for display purposes
  const newShifterEffect = engine.block.createEffect('shifter');
  engine.block.setFloat(newShifterEffect, 'effect/shifter/amount', 0.3);
  engine.block.setFloat(newShifterEffect, 'effect/shifter/angle', 0.785);
  engine.block.appendEffect(shifterBlock, newShifterEffect);

  // Find all available properties for an effect
  const tvGlitchProperties = engine.block.findAllProperties(tvGlitchEffect);
  console.log('TV glitch properties:', tvGlitchProperties);

  // Position all blocks in grid layout
  const blocks = [
    sampleBlock,
    liquidBlock,
    mirrorBlock,
    shifterBlock,
    radialPixelBlock,
    tvGlitchBlock,
    cornerPinBlock,
    bulgeBlock,
    waveWarpBlock,
    displacedBlock
  ];

  blocks.forEach((block, index) => {
    const pos = getPosition(index);
    engine.block.setPositionX(block, pos.x);
    engine.block.setPositionY(block, pos.y);
  });

  // Export the page to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/distortion-effects.png', buffer);
  console.log(
    '✅ Exported distortion effects to output/distortion-effects.png'
  );
} finally {
  engine.dispose();
}
