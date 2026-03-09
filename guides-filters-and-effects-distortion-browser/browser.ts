import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Distortion Effects Guide
 *
 * Demonstrates applying various distortion effects to image blocks:
 * - Checking effect support
 * - Applying liquid distortion
 * - Applying mirror effect
 * - Applying shifter (chromatic aberration)
 * - Applying radial pixel effect
 * - Applying TV glitch effect
 * - Combining multiple distortion effects
 * - Managing effects (enable/disable/remove)
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Enable effects in the inspector panel using the Feature API
    cesdk.feature.enable('ly.img.effect');

    // Calculate responsive grid layout based on page dimensions
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
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
    engine.block.setFloat(
      radialPixelEffect,
      'effect/radial_pixel/segments',
      0.5
    );
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
      tvGlitchBlock
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Select the liquid effect block (second block) and open the effects panel
    engine.block.select(liquidBlock);
    cesdk.ui.openPanel('//ly.img.panel/inspector/effects');

    console.log('Distortion effects guide initialized.');
  }
}

export default Example;
