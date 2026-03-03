import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

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

    // Create a text block to demonstrate drop shadow
    const textBlock = engine.block.create('text');
    engine.block.replaceText(textBlock, 'Shadows & Glows');
    engine.block.setTextFontSize(textBlock, 10);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setPositionX(textBlock, 40);
    engine.block.setPositionY(textBlock, 40);
    engine.block.appendChild(page, textBlock);

    // Check if block supports drop shadows
    const canHaveDropShadow = engine.block.supportsDropShadow(textBlock);
    console.log('Block supports drop shadow:', canHaveDropShadow);

    if (canHaveDropShadow) {
      // Enable drop shadow on the block
      engine.block.setDropShadowEnabled(textBlock, true);
      const shadowIsEnabled = engine.block.isDropShadowEnabled(textBlock);
      console.log('Drop shadow enabled:', shadowIsEnabled);

      // Set drop shadow color to a deep teal
      engine.block.setDropShadowColor(textBlock, {
        r: 0.0,
        g: 0.3,
        b: 0.4,
        a: 0.8
      });
      const shadowColor = engine.block.getDropShadowColor(textBlock);
      console.log('Drop shadow color:', shadowColor);

      // Set shadow offset (positive values move right/down)
      engine.block.setDropShadowOffsetX(textBlock, 6);
      engine.block.setDropShadowOffsetY(textBlock, 6);
      const offsetX = engine.block.getDropShadowOffsetX(textBlock);
      const offsetY = engine.block.getDropShadowOffsetY(textBlock);
      console.log('Drop shadow offset:', offsetX, offsetY);

      // Set blur radius for soft shadow edges
      engine.block.setDropShadowBlurRadiusX(textBlock, 12);
      engine.block.setDropShadowBlurRadiusY(textBlock, 12);
      const blurX = engine.block.getDropShadowBlurRadiusX(textBlock);
      const blurY = engine.block.getDropShadowBlurRadiusY(textBlock);
      console.log('Drop shadow blur:', blurX, blurY);
    }

    // Create an image block to demonstrate glow effect
    const imageUri = 'https://img.ly/static/ubq_samples/sample_4.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      x: 450,
      y: 150,
      size: { width: 300, height: 300 }
    });

    // Check if block supports effects (including glow)
    const canHaveEffects = engine.block.supportsEffects(imageBlock);
    console.log('Block supports effects:', canHaveEffects);

    if (canHaveEffects) {
      // Create and apply a glow effect
      const glowEffect = engine.block.createEffect('glow');
      engine.block.appendEffect(imageBlock, glowEffect);

      // Configure glow parameters
      engine.block.setFloat(glowEffect, 'effect/glow/size', 25);
      engine.block.setFloat(glowEffect, 'effect/glow/amount', 0.7);
      engine.block.setFloat(glowEffect, 'effect/glow/darkness', 0.25);
      console.log('Glow effect applied');
    }

    // Create a second image block to demonstrate combining shadow and glow
    const secondImageUri = 'https://img.ly/static/ubq_samples/sample_5.jpg';
    const combinedBlock = await engine.block.addImage(secondImageUri, {
      x: 50,
      y: 180,
      size: { width: 300, height: 300 }
    });

    // Apply both drop shadow and glow to the same block
    if (engine.block.supportsDropShadow(combinedBlock)) {
      engine.block.setDropShadowEnabled(combinedBlock, true);
      engine.block.setDropShadowColor(combinedBlock, {
        r: 0.0,
        g: 0.2,
        b: 0.3,
        a: 0.6
      });
      engine.block.setDropShadowOffsetX(combinedBlock, 8);
      engine.block.setDropShadowOffsetY(combinedBlock, 8);
      engine.block.setDropShadowBlurRadiusX(combinedBlock, 20);
      engine.block.setDropShadowBlurRadiusY(combinedBlock, 20);
    }

    if (engine.block.supportsEffects(combinedBlock)) {
      const combinedGlow = engine.block.createEffect('glow');
      engine.block.appendEffect(combinedBlock, combinedGlow);
      engine.block.setFloat(combinedGlow, 'effect/glow/size', 15);
      engine.block.setFloat(combinedGlow, 'effect/glow/amount', 0.5);
      engine.block.setFloat(combinedGlow, 'effect/glow/darkness', 0.15);
    }
    console.log('Combined shadow and glow applied');

    // Toggle drop shadow visibility
    const wasEnabled = engine.block.isDropShadowEnabled(textBlock);
    engine.block.setDropShadowEnabled(textBlock, false);
    console.log(
      'Shadow disabled:',
      !engine.block.isDropShadowEnabled(textBlock)
    );
    engine.block.setDropShadowEnabled(textBlock, wasEnabled);
    console.log(
      'Shadow re-enabled:',
      engine.block.isDropShadowEnabled(textBlock)
    );

    // Toggle glow effect visibility
    const effects = engine.block.getEffects(imageBlock);
    if (effects.length > 0) {
      const glowEffect = effects[0];
      engine.block.setEffectEnabled(glowEffect, false);
      console.log('Glow disabled:', !engine.block.isEffectEnabled(glowEffect));
      engine.block.setEffectEnabled(glowEffect, true);
      console.log('Glow re-enabled:', engine.block.isEffectEnabled(glowEffect));
    }

    // Export the result to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/shadows-and-glows.png`, buffer);

    console.log('Exported result to output/shadows-and-glows.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
