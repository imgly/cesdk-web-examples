import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Example: Templating Concepts
 *
 * Demonstrates the core template concepts in CE.SDK:
 * - Loading a template from URL
 * - Discovering and setting variables
 * - Discovering placeholders
 * - Exporting personalized designs
 */
async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Load a postcard template from URL
    // Templates are scenes containing variable tokens and placeholder blocks
    const templateUrl =
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene';
    await engine.scene.loadFromURL(templateUrl);

    // Discover what variables this template expects
    // Variables are named slots that can be populated with data
    const variableNames = engine.variable.findAll();
    console.log('Template variables:', variableNames);

    // Set variable values to personalize the template
    // These values replace {{variableName}} tokens in text blocks
    engine.variable.setString('Name', 'Jane');
    engine.variable.setString('Greeting', 'Wish you were here!');
    console.log('Variables set successfully.');

    // Discover placeholder blocks in the template
    // Placeholders mark content slots for user or automation replacement
    const placeholders = engine.block.findAllPlaceholders();
    console.log('Template placeholders:', placeholders.length);

    // Export the personalized design to a PNG file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const pages = engine.scene.getPages();
    const blob = await engine.block.export(pages[0], {
      mimeType: 'image/png'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/templating-personalized.png`, buffer);
    console.log('Exported to output/templating-personalized.png');

    console.log('Templating guide completed successfully.');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
