import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';
import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

/**
 * Apply a Template (Server/Node.js)
 *
 * This example demonstrates how to apply template content in a headless workflow:
 * 1. Creating a scene with specific dimensions
 * 2. Applying a template from URL while preserving dimensions
 * 3. Exporting the result with consistent output size
 */

async function run() {
  let engine: CreativeEngine | undefined;

  try {
    const config = {
      // license: process.env.CESDK_LICENSE,
      logger: (message: string, logLevel?: string) => {
        if (logLevel === 'ERROR' || logLevel === 'WARN') {
          console.log(`[${logLevel}]`, message);
        }
      }
    };

    engine = await CreativeEngine.init(config);
    console.log('✓ Engine initialized');

    // Create a scene with specific dimensions
    // These dimensions will be preserved when applying templates
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Set custom dimensions for fixed output size (e.g., social media post)
    engine.block.setWidth(page, 1080);
    engine.block.setHeight(page, 1920);

    console.log('✓ Scene created with dimensions 1080x1920');

    // Apply a template from URL - content adjusts to fit current page dimensions
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

    await engine.scene.applyTemplateFromURL(templateUrl);
    console.log('✓ Template applied from URL');

    // Verify that page dimensions are preserved after applying template
    const width = engine.block.getWidth(page);
    const height = engine.block.getHeight(page);
    console.log(`✓ Page dimensions preserved: ${width}x${height}`);

    // Export the result with consistent dimensions
    const blob = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1080,
      targetHeight: 1920
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync('template-output.png', buffer);
    console.log('✓ Exported to template-output.png');

    // Demonstrate applying a different template while keeping dimensions
    const alternativeTemplateUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene';

    await engine.scene.applyTemplateFromURL(alternativeTemplateUrl);
    console.log('✓ Switched to alternative template');

    // Verify dimensions remain the same
    const newWidth = engine.block.getWidth(page);
    const newHeight = engine.block.getHeight(page);
    console.log(`✓ Dimensions after switch: ${newWidth}x${newHeight}`);

    // Export the alternative template
    const blob2 = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 1080,
      targetHeight: 1920
    });

    const buffer2 = Buffer.from(await blob2.arrayBuffer());
    writeFileSync('template-output-alternative.png', buffer2);
    console.log('✓ Exported alternative to template-output-alternative.png');

    console.log('\n✓ All operations completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    // Always dispose the engine
    engine?.dispose();
    console.log('\n✓ Engine disposed');
  }
}

// Run the example
run();
