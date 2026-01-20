import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create Custom LUT Filter
 *
 * Demonstrates applying custom LUT filters directly using the effect API:
 * - Creating a lut_filter effect
 * - Configuring the LUT file URI and tile dimensions
 * - Setting filter intensity
 * - Toggling the effect on and off
 * - Exporting the result
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];

    // Add an image block to apply the LUT filter
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      x: 150,
      y: 100,
      size: { width: 500, height: 400 }
    });
    engine.block.appendChild(page, imageBlock);

    // Create a LUT filter effect
    const lutEffect = engine.block.createEffect('//ly.img.ubq/effect/lut_filter');

    // Configure the LUT file URI - this is a tiled PNG containing the color lookup table
    const lutUrl =
      'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0-rc.1/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png';
    engine.block.setString(lutEffect, 'effect/lut_filter/lutFileURI', lutUrl);

    // Set the tile grid dimensions - must match the LUT image structure
    engine.block.setInt(lutEffect, 'effect/lut_filter/horizontalTileCount', 5);
    engine.block.setInt(lutEffect, 'effect/lut_filter/verticalTileCount', 5);

    // Set filter intensity (0.0 = no effect, 1.0 = full effect)
    engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.8);

    // Apply the effect to the image block
    engine.block.appendEffect(imageBlock, lutEffect);

    // Toggle the effect off and back on
    engine.block.setEffectEnabled(lutEffect, false);
    const isEnabled = engine.block.isEffectEnabled(lutEffect);
    console.log('Effect enabled:', isEnabled); // false

    engine.block.setEffectEnabled(lutEffect, true);

    // Retrieve all effects on the block
    const effects = engine.block.getEffects(imageBlock);
    console.log('Number of effects:', effects.length); // 1

    // Check if block supports effects
    const supportsEffects = engine.block.supportsEffects(imageBlock);
    console.log('Supports effects:', supportsEffects); // true

    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/custom-lut-filter.png`, buffer);

    console.log('Exported result to output/custom-lut-filter.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
