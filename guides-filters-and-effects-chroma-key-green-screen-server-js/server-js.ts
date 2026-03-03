import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Chroma Key (Green Screen)
 *
 * Demonstrates the green screen effect for color keying:
 * - Applying the green screen effect to an image
 * - Configuring color, colorMatch, smoothness, and spill parameters
 * - Toggling the effect programmatically
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

  // Create an image block to apply the green screen effect
  const imageBlock = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_4.jpg',
    {
      size: { width: 600, height: 450 }
    }
  );
  engine.block.appendChild(page, imageBlock);
  engine.block.setPositionX(imageBlock, 100);
  engine.block.setPositionY(imageBlock, 75);

  // Create the green screen effect
  const greenScreenEffect = engine.block.createEffect('green_screen');

  // Apply the effect to the image block
  engine.block.appendEffect(imageBlock, greenScreenEffect);

  // Set the target color to key out (off-white to remove bright sky)
  engine.block.setColor(greenScreenEffect, 'effect/green_screen/fromColor', {
    r: 0.98,
    g: 0.98,
    b: 0.98,
    a: 1.0
  });

  // Adjust color matching tolerance
  // Higher values key out more color variations (useful for uneven lighting)
  engine.block.setFloat(
    greenScreenEffect,
    'effect/green_screen/colorMatch',
    0.26
  );

  // Control edge smoothness
  // Higher values create softer edges that blend naturally with backgrounds
  engine.block.setFloat(
    greenScreenEffect,
    'effect/green_screen/smoothness',
    1.0
  );

  // Remove color spill from reflective surfaces
  // Reduces color tint on edges near the keyed background
  engine.block.setFloat(greenScreenEffect, 'effect/green_screen/spill', 1.0);

  // Check if the effect is currently enabled
  const isEnabled = engine.block.isEffectEnabled(greenScreenEffect);
  console.log('Green screen effect enabled:', isEnabled);

  // Toggle the effect on or off
  engine.block.setEffectEnabled(greenScreenEffect, !isEnabled);
  console.log(
    'Effect toggled:',
    engine.block.isEffectEnabled(greenScreenEffect)
  );

  // Re-enable the effect for export
  engine.block.setEffectEnabled(greenScreenEffect, true);

  // Check if the block supports effects
  const supportsEffects = engine.block.supportsEffects(imageBlock);
  console.log('Block supports effects:', supportsEffects);

  // Get all effects applied to the block
  const effects = engine.block.getEffects(imageBlock);
  console.log('Number of effects:', effects.length);

  // Remove the effect from the block (by index)
  engine.block.removeEffect(imageBlock, 0);
  console.log('Effect removed from block');

  // Destroy the effect instance to free resources
  engine.block.destroy(greenScreenEffect);
  console.log('Effect destroyed');

  // Re-apply the effect for export demonstration
  const newGreenScreenEffect = engine.block.createEffect('green_screen');
  engine.block.appendEffect(imageBlock, newGreenScreenEffect);
  engine.block.setColor(newGreenScreenEffect, 'effect/green_screen/fromColor', {
    r: 0.98,
    g: 0.98,
    b: 0.98,
    a: 1.0
  });
  engine.block.setFloat(
    newGreenScreenEffect,
    'effect/green_screen/colorMatch',
    0.26
  );
  engine.block.setFloat(
    newGreenScreenEffect,
    'effect/green_screen/smoothness',
    1.0
  );
  engine.block.setFloat(newGreenScreenEffect, 'effect/green_screen/spill', 1.0);

  // Export the page to a PNG file
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  const outputPath = `${outputDir}/chroma-key-result.png`;
  writeFileSync(outputPath, buffer);
  console.log(`Exported chroma key result to: ${outputPath}`);
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
