import CreativeEngine from '@cesdk/node';
import * as readline from 'readline';
import { mkdirSync, writeFileSync } from 'fs';

/**
 * CE.SDK Server Guide: Add to Template Library
 *
 * This example demonstrates how to create a template library by:
 * 1. Creating a local asset source for templates
 * 2. Adding templates with metadata (label, thumbnail, URI)
 * 3. Saving scenes as templates
 * 4. Managing templates programmatically
 */

// Helper function to prompt user for input
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init();

try {
  // Create a local asset source for templates
  engine.asset.addLocalSource('my-templates', undefined, async (asset) => {
    // Apply the selected template to the current scene
    await engine.scene.applyTemplateFromURL(asset.meta!.uri as string);
    return undefined;
  });

  // Add a template to the source with metadata
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-postcard',
    label: { en: 'Postcard' },
    meta: {
      uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene',
      thumbUri:
        'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_postcard_1.jpg'
    }
  });

  // Add more templates
  engine.asset.addAssetToSource('my-templates', {
    id: 'template-business-card',
    label: { en: 'Business Card' },
    meta: {
      uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_business_card_1.scene',
      thumbUri:
        'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_business_card_1.jpg'
    }
  });

  engine.asset.addAssetToSource('my-templates', {
    id: 'template-social-media',
    label: { en: 'Social Media Post' },
    meta: {
      uri: 'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_instagram_post_1.scene',
      thumbUri:
        'https://cdn.img.ly/assets/demo/v3/ly.img.template/thumbnails/cesdk_instagram_post_1.jpg'
    }
  });

  // Load the first template
  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  // Ask user how to save the template
  console.log('\nHow would you like to save the template?');
  console.log('1. String format (lightweight, references remote assets)');
  console.log('2. Archive format (self-contained with bundled assets)');
  console.log('3. Cancel');

  const choice = await prompt('\nEnter your choice (1-3): ');

  if (choice === '1') {
    mkdirSync('output', { recursive: true });
    const templateString = await engine.scene.saveToString();
    writeFileSync('output/saved-scene.scene', templateString);
    console.log('Template saved to output/saved-scene.scene');
  } else if (choice === '2') {
    mkdirSync('output', { recursive: true });
    const templateBlob = await engine.scene.saveToArchive();
    const buffer = Buffer.from(await templateBlob.arrayBuffer());
    writeFileSync('output/saved-scene.zip', buffer);
    console.log('Template saved to output/saved-scene.zip');
  } else {
    console.log('Save operation cancelled.');
  }

  // List all registered asset sources
  const sources = engine.asset.findAllSources();
  console.log('Registered sources:', sources);

  // Notify that source contents have changed (useful after dynamic updates)
  engine.asset.assetSourceContentsChanged('my-templates');

  // Query templates from the source
  const queryResult = await engine.asset.findAssets('my-templates', {
    page: 0,
    perPage: 10
  });
  console.log('Templates in library:', queryResult.total);

  // Remove a template from the source
  engine.asset.removeAssetFromSource('my-templates', 'template-social-media');
  console.log('Removed template-social-media from library');

  console.log('Template library operations completed successfully');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
