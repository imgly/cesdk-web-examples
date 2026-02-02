import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Adjust Colors Guide
 *
 * Demonstrates how to adjust color properties of images and design elements:
 * - Creating adjustments effects
 * - Setting brightness, contrast, saturation, and other properties
 * - Enabling/disabling adjustments
 * - Reading adjustment values
 * - Applying different adjustment styles
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

    // Enable adjustments in the inspector panel
    cesdk.feature.enable('ly.img.adjustment');

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Create a sample image to demonstrate color adjustments
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

    // Select the main image block to show adjustments panel
    engine.block.select(imageBlock);

    console.log(
      'Color adjustments guide initialized. Select an image to see the adjustments panel.'
    );
  }
}

export default Example;
