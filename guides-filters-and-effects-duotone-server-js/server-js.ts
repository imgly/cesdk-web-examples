import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { hexToRgba } from './utils';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Duotone
 *
 * Demonstrates applying duotone effects to images in server-side workflows:
 * - Querying duotone presets from the asset library
 * - Applying duotone with preset colors
 * - Creating custom duotone color combinations
 * - Managing and removing effects
 */
async function main(): Promise<void> {
  // Initialize CE.SDK engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Add default asset sources to access duotone presets
    // Note: This may fail in some environments if assets are not available
    let hasAssetSources = false;
    try {
      await engine.addDefaultAssetSources();
      hasAssetSources = true;
    } catch {
      console.warn('Default asset sources not available, skipping presets');
    }

    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    // Use a sample image URL
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create image block for preset demonstration
    const presetImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 350, height: 250 }
    });
    engine.block.appendChild(page, presetImageBlock);
    engine.block.setPositionX(presetImageBlock, 25);
    engine.block.setPositionY(presetImageBlock, 25);

    // Verify a block supports effects before applying them
    const canApplyEffects = engine.block.supportsEffects(presetImageBlock);
    if (!canApplyEffects) {
      console.warn('Block does not support effects');
      return;
    }

    // Query duotone presets from the asset library
    const duotoneResults = hasAssetSources
      ? await engine.asset.findAssets('ly.img.filter.duotone', {
          page: 0,
          perPage: 10
        })
      : { assets: [] };
    const duotonePresets = duotoneResults.assets;

    // Apply a preset to the first image (or use fallback colors)
    // Create a new duotone effect block
    const duotoneEffect = engine.block.createEffect('duotone_filter');

    // Configure effect with preset colors (convert hex to RGBA)
    if (duotonePresets.length > 0) {
      const preset = duotonePresets[0];
      if (preset.meta?.darkColor) {
        engine.block.setColor(
          duotoneEffect,
          'effect/duotone_filter/darkColor',
          hexToRgba(preset.meta.darkColor as string)
        );
      }
      if (preset.meta?.lightColor) {
        engine.block.setColor(
          duotoneEffect,
          'effect/duotone_filter/lightColor',
          hexToRgba(preset.meta.lightColor as string)
        );
      }
    } else {
      // Fallback: Desert preset colors (#5c3a15, #f0d8b8)
      engine.block.setColor(
        duotoneEffect,
        'effect/duotone_filter/darkColor',
        hexToRgba('#5c3a15')
      );
      engine.block.setColor(
        duotoneEffect,
        'effect/duotone_filter/lightColor',
        hexToRgba('#f0d8b8')
      );
    }
    engine.block.setFloat(
      duotoneEffect,
      'effect/duotone_filter/intensity',
      0.9
    );

    // Attach the configured effect to the image block
    engine.block.appendEffect(presetImageBlock, duotoneEffect);

    // Create image block for custom duotone demonstration
    const customImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 350, height: 250 }
    });
    engine.block.appendChild(page, customImageBlock);
    engine.block.setPositionX(customImageBlock, 425);
    engine.block.setPositionY(customImageBlock, 25);

    // Create duotone with custom brand colors
    const customDuotone = engine.block.createEffect('duotone_filter');

    // Dark color: deep navy blue (shadows)
    engine.block.setColor(customDuotone, 'effect/duotone_filter/darkColor', {
      r: 0.1,
      g: 0.15,
      b: 0.3,
      a: 1.0
    });

    // Light color: warm cream (highlights)
    engine.block.setColor(customDuotone, 'effect/duotone_filter/lightColor', {
      r: 0.95,
      g: 0.9,
      b: 0.8,
      a: 1.0
    });

    // Control effect strength (0.0 = original, 1.0 = full duotone)
    engine.block.setFloat(
      customDuotone,
      'effect/duotone_filter/intensity',
      0.85
    );

    engine.block.appendEffect(customImageBlock, customDuotone);

    // Create image block for combined effects demonstration
    const combinedImageBlock = await engine.block.addImage(imageUri, {
      size: { width: 350, height: 250 }
    });
    engine.block.appendChild(page, combinedImageBlock);
    engine.block.setPositionX(combinedImageBlock, 225);
    engine.block.setPositionY(combinedImageBlock, 325);

    // Combine duotone with other effects
    // First, add adjustments for brightness and contrast
    const adjustments = engine.block.createEffect('adjustments');
    engine.block.setFloat(adjustments, 'effect/adjustments/brightness', 0.1);
    engine.block.setFloat(adjustments, 'effect/adjustments/contrast', 0.15);
    engine.block.appendEffect(combinedImageBlock, adjustments);

    // Then add duotone on top
    const combinedDuotone = engine.block.createEffect('duotone_filter');
    engine.block.setColor(combinedDuotone, 'effect/duotone_filter/darkColor', {
      r: 0.2,
      g: 0.1,
      b: 0.3,
      a: 1.0 // Deep purple
    });
    engine.block.setColor(combinedDuotone, 'effect/duotone_filter/lightColor', {
      r: 1.0,
      g: 0.85,
      b: 0.7,
      a: 1.0 // Warm peach
    });
    engine.block.setFloat(
      combinedDuotone,
      'effect/duotone_filter/intensity',
      0.75
    );
    engine.block.appendEffect(combinedImageBlock, combinedDuotone);

    // Get all effects currently applied to a block
    const appliedEffects = engine.block.getEffects(presetImageBlock);

    console.log(`Block has ${appliedEffects.length} effect(s) applied`);

    // Disable an effect without removing it
    if (appliedEffects.length > 0) {
      engine.block.setEffectEnabled(appliedEffects[0], false);

      // Check if an effect is currently enabled
      const isEnabled = engine.block.isEffectEnabled(appliedEffects[0]);
      console.log(`Effect enabled: ${isEnabled}`);

      // Re-enable the effect
      engine.block.setEffectEnabled(appliedEffects[0], true);
    }

    // Remove an effect at a specific index from a block
    const effectsOnCustom = engine.block.getEffects(customImageBlock);
    if (effectsOnCustom.length > 0) {
      engine.block.removeEffect(customImageBlock, 0);
    }

    // Destroy removed effect blocks to free memory
    if (effectsOnCustom.length > 0) {
      engine.block.destroy(effectsOnCustom[0]);
    }

    // Re-apply custom duotone after demonstration
    const newCustomDuotone = engine.block.createEffect('duotone_filter');
    engine.block.setColor(newCustomDuotone, 'effect/duotone_filter/darkColor', {
      r: 0.1,
      g: 0.15,
      b: 0.3,
      a: 1.0
    });
    engine.block.setColor(
      newCustomDuotone,
      'effect/duotone_filter/lightColor',
      {
        r: 0.95,
        g: 0.9,
        b: 0.8,
        a: 1.0
      }
    );
    engine.block.setFloat(
      newCustomDuotone,
      'effect/duotone_filter/intensity',
      0.85
    );
    engine.block.appendEffect(customImageBlock, newCustomDuotone);

    // Export the page to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const outputPath = `${outputDir}/duotone-result.png`;
    writeFileSync(outputPath, buffer);
    console.log(`Exported duotone result to: ${outputPath}`);
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
