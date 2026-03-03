import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables from .env file
config();

async function main() {
  // Initialize the headless Creative Engine for server-side processing
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Load remote assets from a JSON manifest URL
    // The parent directory of the JSON file is used as the base path for relative URLs
    const audioSourceId = await engine.asset.addLocalAssetSourceFromJSONURI(
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/content.json'
    );
    console.log('Loaded audio assets from:', audioSourceId);

    // Load image assets from another remote JSON manifest
    const imageSourceId = await engine.asset.addLocalAssetSourceFromJSONURI(
      'https://cdn.img.ly/assets/demo/v3/ly.img.image/content.json'
    );
    console.log('Loaded image assets from:', imageSourceId);

    // Load assets from a JSON string when content is already available
    const customAssetJSON = JSON.stringify({
      version: '2.0.0',
      id: 'my.custom.assets',
      assets: [
        {
          id: 'sample_image_1',
          label: { en: 'Sample Image 1' },
          meta: {
            uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
            thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        },
        {
          id: 'sample_image_2',
          label: { en: 'Sample Image 2' },
          meta: {
            uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
            thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        }
      ]
    });

    const customSourceId =
      await engine.asset.addLocalAssetSourceFromJSONString(customAssetJSON);
    console.log('Created custom asset source:', customSourceId);

    // When loading from string, you can specify a custom base path
    // for resolving {{base_url}} placeholders in the manifest
    const assetsWithBasePath = JSON.stringify({
      version: '2.0.0',
      id: 'my.cdn.assets',
      assets: [
        {
          id: 'cdn_image',
          label: { en: 'CDN Image' },
          meta: {
            uri: '{{base_url}}/sample_1.jpg',
            thumbUri: '{{base_url}}/sample_1.jpg',
            blockType: '//ly.img.ubq/graphic',
            mimeType: 'image/jpeg'
          }
        }
      ]
    });

    const cdnSourceId = await engine.asset.addLocalAssetSourceFromJSONString(
      assetsWithBasePath,
      'https://img.ly/static/ubq_samples/'
    );
    console.log('Created CDN asset source with custom base path:', cdnSourceId);

    // Verify loaded assets by querying the asset source
    const audioAssets = await engine.asset.findAssets(audioSourceId, {
      page: 0,
      perPage: 10
    });
    console.log(`Loaded ${audioAssets.total} audio assets`);

    const customAssets = await engine.asset.findAssets(customSourceId, {
      page: 0,
      perPage: 10
    });
    console.log(`Loaded ${customAssets.total} custom assets`);

    // Create a scene and apply an asset
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Apply an asset from the loaded source to the scene
    const imageAssets = await engine.asset.findAssets(imageSourceId, {
      page: 0,
      perPage: 10
    });
    if (imageAssets.assets.length > 0) {
      const asset = imageAssets.assets[0];
      await engine.asset.apply(imageSourceId, asset);
      console.log('Applied asset:', asset.id);
    }

    // List all registered asset sources
    const allSources = engine.asset.findAllSources();
    console.log('All registered asset sources:', allSources);

    // Remove an asset source when no longer needed
    engine.asset.removeSource(cdnSourceId);
    console.log('Removed asset source:', cdnSourceId);

    // Export the scene to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const outputPath = `${outputDir}/remote-asset-result.png`;
    writeFileSync(outputPath, buffer);
    console.log(`Exported scene to: ${outputPath}`);

    console.log('\nRemote asset loading completed successfully!');
  } finally {
    // Always dispose of the engine to release resources
    engine.dispose();
  }
}

main().catch(console.error);
