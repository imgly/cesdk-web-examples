import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Chroma Key (Green Screen) Guide
 *
 * Demonstrates the green screen effect for color keying:
 * - Applying the green screen effect to an image
 * - Configuring the target color to key out
 * - Adjusting colorMatch, smoothness, and spill parameters
 * - Compositing with background layers
 * - Managing and toggling effects
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

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

    // Set the target color to key out
    // Use off-white to remove the bright sky background
    // For traditional green screen footage, use { r: 0.0, g: 1.0, b: 0.0, a: 1.0 }
    engine.block.setColor(greenScreenEffect, 'effect/green_screen/fromColor', {
      r: 0.98,
      g: 0.98,
      b: 0.98,
      a: 1.0
    });

    // Adjust color matching tolerance
    // Higher values (closer to 1.0) key out more color variations
    // Lower values create more precise keying
    engine.block.setFloat(
      greenScreenEffect,
      'effect/green_screen/colorMatch',
      0.26
    );

    // Control edge smoothness for natural transitions
    // Higher values create softer edges that blend with backgrounds
    engine.block.setFloat(
      greenScreenEffect,
      'effect/green_screen/smoothness',
      1.0
    );

    // Remove color spill from reflective surfaces
    // Reduces color tint on edges near the keyed background
    engine.block.setFloat(greenScreenEffect, 'effect/green_screen/spill', 1.0);

    // Create a background layer for compositing
    const backgroundBlock = engine.block.create('graphic');
    const backgroundShape = engine.block.createShape('rect');
    engine.block.setShape(backgroundBlock, backgroundShape);

    // Create a solid color fill for the background
    const backgroundFill = engine.block.createFill('color');
    engine.block.setColor(backgroundFill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 1.0
    });
    engine.block.setFill(backgroundBlock, backgroundFill);

    // Size and position the background to cover the page
    engine.block.setWidth(backgroundBlock, 800);
    engine.block.setHeight(backgroundBlock, 600);
    engine.block.setPositionX(backgroundBlock, 0);
    engine.block.setPositionY(backgroundBlock, 0);

    // Add to page and send to back
    engine.block.appendChild(page, backgroundBlock);
    engine.block.sendToBack(backgroundBlock);

    // Bring the keyed image to front
    engine.block.bringToFront(imageBlock);

    // Check if the effect is currently enabled
    const isEnabled = engine.block.isEffectEnabled(greenScreenEffect);
    console.log('Green screen effect enabled:', isEnabled);

    // Toggle the effect on or off
    engine.block.setEffectEnabled(greenScreenEffect, !isEnabled);
    console.log(
      'Effect toggled:',
      engine.block.isEffectEnabled(greenScreenEffect)
    );

    // Re-enable for demonstration
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

    // Re-apply the effect for final display
    const finalEffect = engine.block.createEffect('green_screen');
    engine.block.appendEffect(imageBlock, finalEffect);
    engine.block.setColor(finalEffect, 'effect/green_screen/fromColor', {
      r: 0.98,
      g: 0.98,
      b: 0.98,
      a: 1.0
    });
    engine.block.setFloat(finalEffect, 'effect/green_screen/colorMatch', 0.26);
    engine.block.setFloat(finalEffect, 'effect/green_screen/smoothness', 1.0);
    engine.block.setFloat(finalEffect, 'effect/green_screen/spill', 1.0);

    // Select the image block so the inspector panel shows it
    engine.block.setSelected(imageBlock, true);

    console.log(
      'Chroma key guide initialized. Select the image to see effect parameters.'
    );
  }
}

export default Example;
