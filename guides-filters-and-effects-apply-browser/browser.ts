import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout, hexToRgba } from './utils';

/**
 * CE.SDK Plugin: Filters and Effects Guide
 *
 * Demonstrates applying various filters and effects to image blocks:
 * - Checking effect support
 * - Applying basic effects (blur)
 * - Configuring effect parameters (adjustments)
 * - Applying LUT filters
 * - Combining multiple effects
 * - Managing effect stacks
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

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Enable effects and filters in the inspector panel using the Feature API
    cesdk.feature.enable('ly.img.effect'); // Enable all effects
    cesdk.feature.enable('ly.img.filter'); // Enable all filters
    cesdk.feature.enable('ly.img.blur'); // Enable blur effect
    cesdk.feature.enable('ly.img.adjustment'); // Enable adjustments

    // Calculate responsive grid layout based on page dimensions
    const layout = calculateGridLayout(pageWidth, pageHeight, 9);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Use a sample image URL (this will load from demo assets)
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Query available LUT and Duotone filters from asset sources
    // These filters are provided by the demo asset sources loaded above
    const lutResults = await engine.asset.findAssets('ly.img.filter.lut', {
      page: 0,
      perPage: 10
    });
    const duotoneResults = await engine.asset.findAssets(
      'ly.img.filter.duotone',
      {
        page: 0,
        perPage: 10
      }
    );

    const lutAssets = lutResults.assets;
    const duotoneAssets = duotoneResults.assets;

    // Pattern #2: Use Convenience APIs - addImage() simplifies block creation
    // Create a sample block to demonstrate effect support checking
    const blockSize = { width: blockWidth, height: blockHeight };
    const sampleBlock = await engine.block.addImage(imageUri, {
      size: blockSize
    });
    engine.block.appendChild(page, sampleBlock);

    // Check if a block supports effects
    const supportsEffects = engine.block.supportsEffects(sampleBlock);
    // eslint-disable-next-line no-console
    console.log('Block supports effects:', supportsEffects); // true for graphics

    // Page blocks don't support effects
    const pageSupportsEffects = engine.block.supportsEffects(page);
    // eslint-disable-next-line no-console
    console.log('Page supports effects:', pageSupportsEffects); // false

    // Select this block so effects panel is visible
    engine.block.setSelected(sampleBlock, true);

    // Pattern #1: Demonstrate Individual Before Combined
    // Create a separate image block for blur demonstration
    const blurImageBlock = await engine.block.addImage(imageUri, {
      size: blockSize
    });
    engine.block.appendChild(page, blurImageBlock);

    // Create and apply a blur effect
    const blurEffect = engine.block.createEffect('extrude_blur');
    engine.block.appendEffect(blurImageBlock, blurEffect);

    // Adjust blur intensity
    engine.block.setFloat(blurEffect, 'effect/extrude_blur/amount', 0.5);

    // Create a separate image block for adjustments demonstration
    const adjustmentsImageBlock = await engine.block.addImage(imageUri, {
      size: blockSize
    });
    engine.block.appendChild(page, adjustmentsImageBlock);

    // Create adjustments effect for brightness and contrast
    const adjustmentsEffect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(adjustmentsImageBlock, adjustmentsEffect);

    // Find all available properties for this effect
    const adjustmentProperties =
      engine.block.findAllProperties(adjustmentsEffect);
    // eslint-disable-next-line no-console
    console.log('Available adjustment properties:', adjustmentProperties);

    // Set brightness, contrast, and saturation
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/brightness',
      0.2
    );
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/contrast',
      0.15
    );
    engine.block.setFloat(
      adjustmentsEffect,
      'effect/adjustments/saturation',
      0.1
    );

    // Demonstrate LUT filters by applying the first 2 from asset library
    // These filters are fetched from the demo asset sources (Grid positions 3-4)
    const lutImageBlocks = [];
    for (let i = 0; i < Math.min(2, lutAssets.length); i++) {
      const lutAsset = lutAssets[i];

      const lutImageBlock = await engine.block.addImage(imageUri, {
        size: blockSize
      });
      engine.block.appendChild(page, lutImageBlock);
      lutImageBlocks.push(lutImageBlock);

      // Create LUT filter effect using the full effect type URI
      const lutEffect = engine.block.createEffect(
        '//ly.img.ubq/effect/lut_filter'
      );

      // Use asset metadata for LUT configuration
      // The asset provides the LUT file URI and grid dimensions
      engine.block.setString(
        lutEffect,
        'effect/lut_filter/lutFileURI',
        lutAsset.meta?.uri as string
      );
      engine.block.setInt(
        lutEffect,
        'effect/lut_filter/horizontalTileCount',
        parseInt(lutAsset.meta?.horizontalTileCount as string, 10)
      );
      engine.block.setInt(
        lutEffect,
        'effect/lut_filter/verticalTileCount',
        parseInt(lutAsset.meta?.verticalTileCount as string, 10)
      );
      engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.85);

      engine.block.appendEffect(lutImageBlock, lutEffect);
    }

    // Demonstrate Duotone filters by applying the first 2 from asset library
    // Duotone filters create artistic two-color treatments (Grid positions 5-6)
    const duotoneImageBlocks = [];
    for (let i = 0; i < Math.min(2, duotoneAssets.length); i++) {
      const duotoneAsset = duotoneAssets[i];

      const duotoneImageBlock = await engine.block.addImage(imageUri, {
        size: blockSize
      });
      engine.block.appendChild(page, duotoneImageBlock);
      duotoneImageBlocks.push(duotoneImageBlock);

      // Create Duotone filter effect using the full effect type URI
      const duotoneEffect = engine.block.createEffect(
        '//ly.img.ubq/effect/duotone_filter'
      );

      // Convert hex colors from asset metadata to RGBA (0-1 range)
      const darkColor = hexToRgba(duotoneAsset.meta?.darkColor as string);
      engine.block.setColor(
        duotoneEffect,
        'effect/duotone_filter/darkColor',
        darkColor
      );

      const lightColor = hexToRgba(duotoneAsset.meta?.lightColor as string);
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

    // Pattern #5: Progressive Complexity - now combining multiple effects
    // Create a separate image block to demonstrate combining multiple effects (Grid position 7)
    const combinedImageBlock = await engine.block.addImage(imageUri, {
      size: blockSize
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
    // eslint-disable-next-line no-console
    console.log('Applied effects:', effects);

    // Access properties of specific effects
    effects.forEach((effect, index) => {
      const effectType = engine.block.getType(effect);
      const isEnabled = engine.block.isEffectEnabled(effect);
      // eslint-disable-next-line no-console
      console.log(`Effect ${index}: ${effectType}, enabled: ${isEnabled}`);
    });

    // Check if effect is enabled
    const isBlurEnabled = engine.block.isEffectEnabled(combinedBlur);
    // eslint-disable-next-line no-console
    console.log('Blur effect is enabled:', isBlurEnabled);

    // Create a temporary block to demonstrate effect removal
    const tempBlock = await engine.block.addImage(imageUri, {
      size: blockSize
    });
    engine.block.appendChild(page, tempBlock);

    const tempEffect = engine.block.createEffect('pixelize');
    engine.block.appendEffect(tempBlock, tempEffect);
    engine.block.setInt(tempEffect, 'pixelize/horizontalPixelSize', 12);

    // Remove the effect
    const tempEffects = engine.block.getEffects(tempBlock);
    const effectIndex = tempEffects.indexOf(tempEffect);
    if (effectIndex !== -1) {
      engine.block.removeEffect(tempBlock, effectIndex);
    }

    // Destroy the removed effect to free memory
    engine.block.destroy(tempEffect);

    // ===== Position all blocks in grid layout =====
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

    // Apply same effects to multiple blocks
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

    // eslint-disable-next-line no-console
    console.log(
      'Effects guide initialized. Select any image to see effects panel.'
    );
  }
}

export default Example;
