/**
 * CE.SDK Node.js Example: Import Templates
 *
 * Demonstrates loading templates from different sources:
 * - Archive URLs (.zip files with bundled assets)
 * - Scene URLs (.scene files)
 * - Serialized strings (file content)
 */

import CreativeEngine from '@cesdk/node';
import { readFileSync, writeFileSync } from 'fs';
import { config } from 'dotenv';
import * as readline from 'readline';

// Load environment variables from .env file
config();

// Template sources
const fashionAdArchiveUrl =
  'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip';

const postcardSceneUrl =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

// For loadFromString: read the scene file content
const businessCardSceneString = readFileSync(
  './assets/business-card.scene',
  'utf-8'
);

// Prompt user to select import method
async function selectImportMethod(): Promise<string> {
  const methods = [
    { key: '1', label: 'Import Archive (fashion-ad.zip)', value: 'archive' },
    { key: '2', label: 'Import URL (postcard.scene)', value: 'url' },
    { key: '3', label: 'Import String (business-card.scene)', value: 'string' }
  ];

  console.log('\nSelect import method:');
  methods.forEach((m) => console.log(`  ${m.key}) ${m.label}`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nEnter choice (1-3): ', (answer) => {
      rl.close();
      const selected = methods.find((m) => m.key === answer.trim());
      if (!selected) {
        console.error(
          `\n✗ Invalid choice: "${answer.trim()}". Please enter 1-3.`
        );
        process.exit(1);
      }
      resolve(selected.value);
    });
  });
}

const configuration = {
  userId: 'guides-user'
};

async function main() {
  // Get user's import method selection
  const method = await selectImportMethod();
  console.log('');

  const engine = await CreativeEngine.init(configuration);

  try {
    let templateName = '';

    if (method === 'archive') {
      // Load template from archive URL (bundled assets)
      await engine.scene.loadFromArchiveURL(fashionAdArchiveUrl);
      templateName = 'fashion-ad';
    }

    if (method === 'url') {
      // Load template from a scene URL
      await engine.scene.loadFromURL(postcardSceneUrl);
      templateName = 'postcard';
    }

    if (method === 'string') {
      // Load template from serialized string
      await engine.scene.loadFromString(businessCardSceneString);
      templateName = 'business-card';
    }

    // Verify the loaded scene
    const scene = engine.scene.get();
    if (scene == null) {
      throw new Error('Failed to load scene');
    }

    const pages = engine.scene.getPages();
    // eslint-disable-next-line no-console
    console.log(`Loaded ${templateName} template with ${pages.length} page(s)`);

    // Export the loaded template to a PNG file
    const blob = await engine.block.export(scene, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const outputPath = `output-${templateName}.png`;
    writeFileSync(outputPath, buffer);
    // eslint-disable-next-line no-console
    console.log(`Exported template to ${outputPath}`);

    // eslint-disable-next-line no-console
    console.log('Example completed successfully!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    throw error;
  } finally {
    // Always dispose the engine when done
    engine.dispose();
  }
}

// Run the example
main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to run example:', error);
  process.exit(1);
});
