import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Apply Filters and Effects
 *
 * Demonstrates applying various filters and effects to image blocks:
 * - Checking effect support
 * - Applying basic effects (blur)
 * - Configuring effect parameters (adjustments)
 * - Applying LUT filters
 * - Applying duotone filters
 * - Combining multiple effects
 * - Managing effect stacks
 * - Batch processing
 * - Exporting results
 */

/**
 * Convert hex color string to RGBA values (0-1 range)
 */
function hexToRgba(hex: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
        a: 1.0
      }
    : { r: 0, g: 0, b: 0, a: 1.0 };
}

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

  // Sample image URL for demonstrations
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

  // Block size for grid layout (will be positioned at the end)
  const blockSize = { width: 200, height: 150 };

  // Create an image block to check effect support
  const sampleBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, sampleBlock);

  // Check if a block supports effects - graphic blocks with image fills support effects
  const supportsEffects = engine.block.supportsEffects(sampleBlock);
  console.log('Block supports effects:', supportsEffects); // true

  // Page blocks support effects when they have fills applied
  const pageSupportsEffects = engine.block.supportsEffects(page);
  console.log('Page supports effects:', pageSupportsEffects);

  // Create a separate image block for blur demonstration
  const blurImageBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, blurImageBlock);

  // Create and apply a blur effect
  const blurEffect = engine.block.createEffect('extrude_blur');
  engine.block.appendEffect(blurImageBlock, blurEffect);

  // Adjust blur intensity (0.0 to 1.0)
  engine.block.setFloat(blurEffect, 'effect/extrude_blur/amount', 0.5);

  // Create a separate image block for adjustments demonstration
  const adjustmentsImageBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, adjustmentsImageBlock);

  // Create adjustments effect for brightness and contrast
  const adjustmentsEffect = engine.block.createEffect('adjustments');
  engine.block.appendEffect(adjustmentsImageBlock, adjustmentsEffect);

  // Set brightness, contrast, and saturation
  engine.block.setFloat(
    adjustmentsEffect,
    'effect/adjustments/brightness',
    0.2
  );
  engine.block.setFloat(adjustmentsEffect, 'effect/adjustments/contrast', 0.15);
  engine.block.setFloat(
    adjustmentsEffect,
    'effect/adjustments/saturation',
    0.1
  );

  // Find all available properties for this effect
  const adjustmentProperties =
    engine.block.findAllProperties(adjustmentsEffect);
  console.log('Available adjustment properties:', adjustmentProperties);

  // Demonstrate LUT filters by applying 2 different presets (Grid positions 3-4)
  // LUT configurations with different color grading styles
  const lutConfigs = [
    {
      uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
      horizontalTileCount: 5,
      verticalTileCount: 5
    },
    {
      uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_bw_5_5_128.png',
      horizontalTileCount: 5,
      verticalTileCount: 5
    }
  ];

  const lutImageBlocks = [];
  for (const lutConfig of lutConfigs) {
    const lutImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 150 }
    });
    engine.block.appendChild(page, lutImageBlock);
    lutImageBlocks.push(lutImageBlock);

    // Create LUT filter effect
    const lutEffect = engine.block.createEffect(
      '//ly.img.ubq/effect/lut_filter'
    );

    // Configure LUT with preset filter settings
    engine.block.setString(
      lutEffect,
      'effect/lut_filter/lutFileURI',
      lutConfig.uri
    );
    engine.block.setInt(
      lutEffect,
      'effect/lut_filter/horizontalTileCount',
      lutConfig.horizontalTileCount
    );
    engine.block.setInt(
      lutEffect,
      'effect/lut_filter/verticalTileCount',
      lutConfig.verticalTileCount
    );
    engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.85);

    engine.block.appendEffect(lutImageBlock, lutEffect);
  }

  // Demonstrate Duotone filters by applying 2 different color combinations (Grid positions 5-6)
  // Duotone configurations with different color schemes
  const duotoneConfigs = [
    { darkColor: '#0b3d5b', lightColor: '#f8bc60' }, // Blue/Orange
    { darkColor: '#2d1e3e', lightColor: '#e8d5b7' } // Purple/Cream
  ];

  const duotoneImageBlocks = [];
  for (const duotoneConfig of duotoneConfigs) {
    const duotoneImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 150 }
    });
    engine.block.appendChild(page, duotoneImageBlock);
    duotoneImageBlocks.push(duotoneImageBlock);

    // Create duotone filter effect
    const duotoneEffect = engine.block.createEffect(
      '//ly.img.ubq/effect/duotone_filter'
    );

    // Configure duotone colors using hex to RGBA conversion
    const darkColor = hexToRgba(duotoneConfig.darkColor);
    engine.block.setColor(
      duotoneEffect,
      'effect/duotone_filter/darkColor',
      darkColor
    );

    const lightColor = hexToRgba(duotoneConfig.lightColor);
    engine.block.setColor(
      duotoneEffect,
      'effect/duotone_filter/lightColor',
      lightColor
    );

    engine.block.setFloat(
      duotoneEffect,
      'effect/duotone_filter/intensity',
      0.8
    );
    engine.block.appendEffect(duotoneImageBlock, duotoneEffect);
  }

  // Create an image block to demonstrate combining multiple effects (Grid position 7)
  const combinedImageBlock = await engine.block.addImage(imageUri, {
    size: { width: 200, height: 150 }
  });
  engine.block.appendChild(page, combinedImageBlock);

  // Apply effects in order - the stack will contain:
  // 1. adjustments (brightness/contrast) - applied first
  // 2. blur - applied second
  // 3. duotone (color tinting) - applied third
  // 4. pixelize - applied last

  const combinedAdjustments = engine.block.createEffect('adjustments');
  engine.block.appendEffect(combinedImageBlock, combinedAdjustments);
  engine.block.setFloat(
    combinedAdjustments,
    'effect/adjustments/brightness',
    0.2
  );
  engine.block.setFloat(
    combinedAdjustments,
    'effect/adjustments/contrast',
    0.15
  );

  const combinedBlur = engine.block.createEffect('extrude_blur');
  engine.block.appendEffect(combinedImageBlock, combinedBlur);
  engine.block.setFloat(combinedBlur, 'effect/extrude_blur/amount', 0.3);

  const combinedDuotone = engine.block.createEffect('duotone_filter');
  engine.block.appendEffect(combinedImageBlock, combinedDuotone);
  engine.block.setColor(combinedDuotone, 'duotone_filter/darkColor', {
    r: 0.1,
    g: 0.2,
    b: 0.4,
    a: 1.0
  });
  engine.block.setColor(combinedDuotone, 'duotone_filter/lightColor', {
    r: 0.9,
    g: 0.8,
    b: 0.6,
    a: 1.0
  });
  engine.block.setFloat(combinedDuotone, 'duotone_filter/intensity', 0.6);

  const pixelizeEffect = engine.block.createEffect('pixelize');
  engine.block.appendEffect(combinedImageBlock, pixelizeEffect);
  engine.block.setInt(pixelizeEffect, 'pixelize/horizontalPixelSize', 8);
  engine.block.setInt(pixelizeEffect, 'pixelize/verticalPixelSize', 8);

  // Get all effects applied to the combined block
  const effects = engine.block.getEffects(combinedImageBlock);
  console.log('Applied effects:', effects);

  // Access properties of specific effects
  effects.forEach((effect, index) => {
    const effectType = engine.block.getType(effect);
    const isEnabled = engine.block.isEffectEnabled(effect);
    console.log(`Effect ${index}: ${effectType}, enabled: ${isEnabled}`);
  });

  // Check if effect is enabled and toggle
  const isBlurEnabled = engine.block.isEffectEnabled(combinedBlur);
  console.log('Blur effect is enabled:', isBlurEnabled);

  // Temporarily disable the blur effect
  engine.block.setEffectEnabled(combinedBlur, false);
  console.log(
    'Blur effect disabled:',
    !engine.block.isEffectEnabled(combinedBlur)
  );

  // Re-enable for final export
  engine.block.setEffectEnabled(combinedBlur, true);

  // Create a temporary block to demonstrate effect removal (Grid position 8)
  const tempBlock = await engine.block.addImage(imageUri, {
    size: blockSize
  });
  engine.block.appendChild(page, tempBlock);

  const tempEffect = engine.block.createEffect('pixelize');
  engine.block.appendEffect(tempBlock, tempEffect);
  engine.block.setInt(tempEffect, 'pixelize/horizontalPixelSize', 12);

  // Remove the effect from the block
  const tempEffects = engine.block.getEffects(tempBlock);
  const effectIndex = tempEffects.indexOf(tempEffect);
  if (effectIndex !== -1) {
    engine.block.removeEffect(tempBlock, effectIndex);
  }

  // Destroy the removed effect to free memory
  engine.block.destroy(tempEffect);
  console.log('Effect removed and destroyed');

  // ===== Position all blocks in grid layout =====
  // Calculate grid positions for 9 blocks (3x3 grid)
  const spacing = 20;
  const margin = 40;
  const cols = 3;
  const totalGridWidth = cols * blockSize.width + (cols - 1) * spacing;
  const startX = (800 - totalGridWidth) / 2;
  const startY = margin;

  const getPosition = (index: number) => ({
    x: startX + (index % cols) * (blockSize.width + spacing),
    y: startY + Math.floor(index / cols) * (blockSize.height + spacing)
  });

  const blocks = [
    sampleBlock, // Position 0
    blurImageBlock, // Position 1
    adjustmentsImageBlock, // Position 2
    ...lutImageBlocks, // Positions 3-4
    ...duotoneImageBlocks, // Positions 5-6
    combinedImageBlock, // Position 7
    tempBlock // Position 8
  ];

  blocks.forEach((block, index) => {
    const pos = getPosition(index);
    engine.block.setPositionX(block, pos.x);
    engine.block.setPositionY(block, pos.y);
  });

  // Apply same effects to multiple blocks (batch processing)
  const allGraphics = engine.block.findByType('graphic');

  allGraphics.forEach((graphic) => {
    if (engine.block.supportsEffects(graphic)) {
      // Only apply to blocks that don't already have effects
      const existingEffects = engine.block.getEffects(graphic);
      if (existingEffects.length === 0) {
        const effect = engine.block.createEffect('adjustments');
        engine.block.appendEffect(graphic, effect);
        engine.block.setFloat(effect, 'effect/adjustments/brightness', 0.1);
      }
    }
  });
  console.log('Batch processing complete');

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/filters-and-effects.png', buffer);
  console.log('Exported to output/filters-and-effects.png');
} finally {
  engine.dispose();
}
