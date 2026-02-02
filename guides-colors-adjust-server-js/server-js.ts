import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Adjust Colors
 *
 * Demonstrates how to adjust color properties of images programmatically:
 * - Creating adjustments effects
 * - Setting brightness, contrast, saturation, and other properties
 * - Enabling/disabling adjustments
 * - Reading adjustment values
 * - Applying different adjustment styles
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

    // Sample image URL
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Check if a block supports effects before applying adjustments
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: 400, height: 300 }
    });
    engine.block.appendChild(page, imageBlock);
    engine.block.setPositionX(imageBlock, 200);
    engine.block.setPositionY(imageBlock, 150);

    const supportsEffects = engine.block.supportsEffects(imageBlock);
    console.log('Block supports effects:', supportsEffects);

    // Create an adjustments effect
    const adjustmentsEffect = engine.block.createEffect('adjustments');

    // Attach the adjustments effect to the image block
    engine.block.appendEffect(imageBlock, adjustmentsEffect);

    // Set brightness - positive values lighten, negative values darken
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/brightness',
      0.4
    );

    // Set contrast - increases or decreases tonal range
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/contrast',
      0.35
    );

    // Set saturation - increases or decreases color intensity
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/saturation',
      0.5
    );

    // Set temperature - positive for warmer, negative for cooler tones
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/temperature',
      0.25
    );

    // Read current adjustment values
    const brightness = engine.block.getFloat(
      adjustmentsEffect,
      'effect/adjustments/brightness'
    );
    console.log('Current brightness:', brightness);

    // Discover all available adjustment properties
    const allProperties = engine.block.findAllProperties(adjustmentsEffect);
    console.log('Available adjustment properties:', allProperties);

    // Disable adjustments temporarily (effect remains attached)
    engine.block.setEffectEnabled(adjustmentsEffect, false);
    console.log(
      'Adjustments enabled:',
      engine.block.isEffectEnabled(adjustmentsEffect)
    );

    // Re-enable adjustments
    engine.block.setEffectEnabled(adjustmentsEffect, true);

    // Create a second image to demonstrate a different adjustment style
    const secondImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 200, height: 150 }
    });
    engine.block.appendChild(page, secondImageBlock);
    engine.block.setPositionX(secondImageBlock, 50);
    engine.block.setPositionY(secondImageBlock, 50);

    // Apply a contrasting style: darker, high contrast, desaturated (moody look)
    const combinedAdjustments = engine.block.createEffect('adjustments');
    engine.block.appendEffect(secondImageBlock, combinedAdjustments);
    engine.block.setFloat(
      combinedAdjustments,
      'effect/adjustments/brightness',
      -0.15
    );
    engine.block.setFloat(
      combinedAdjustments,
      'effect/adjustments/contrast',
      0.4
    );
    engine.block.setFloat(
      combinedAdjustments,
      'effect/adjustments/saturation',
      -0.3
    );

    // List all effects on the block
    const effects = engine.block.getEffects(secondImageBlock);
    console.log('Effects on second image:', effects.length);

    // Demonstrate removing an effect
    const tempBlock = await engine.block.addImage(imageUri, {
      size: { width: 150, height: 100 }
    });
    engine.block.appendChild(page, tempBlock);
    engine.block.setPositionX(tempBlock, 550);
    engine.block.setPositionY(tempBlock, 50);

    const tempEffect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(tempBlock, tempEffect);
    engine.block.setFloat(tempEffect, 'effect/adjustments/brightness', 0.5);

    // Remove the effect by index
    const tempEffects = engine.block.getEffects(tempBlock);
    const effectIndex = tempEffects.indexOf(tempEffect);
    if (effectIndex !== -1) {
      engine.block.removeEffect(tempBlock, effectIndex);
    }

    // Destroy the removed effect to free memory
    engine.block.destroy(tempEffect);

    // Add refinement adjustments to demonstrate subtle enhancement properties
    const refinementEffect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(tempBlock, refinementEffect);

    // Sharpness - enhances edge definition
    engine.block.setFloat(
      refinementEffect,
      'effect/adjustments/sharpness',
      0.4
    );

    // Clarity - increases mid-tone contrast for more detail
    engine.block.setFloat(refinementEffect, 'effect/adjustments/clarity', 0.35);

    // Highlights - adjusts bright areas
    engine.block.setFloat(
      refinementEffect,
      'effect/adjustments/highlights',
      -0.2
    );

    // Shadows - adjusts dark areas
    engine.block.setFloat(refinementEffect, 'effect/adjustments/shadows', 0.3);

    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/adjusted-colors.png`, buffer);

    console.log('Exported result to output/adjusted-colors.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
