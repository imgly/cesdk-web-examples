import CreativeEngine, { AssetsQueryResult } from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Refresh Assets
 *
 * Demonstrates how to refresh asset sources after external changes:
 * - Creating custom asset sources
 * - Simulating external uploads
 * - Triggering asset refresh with assetSourceContentsChanged()
 * - Handling external modifications and deletions
 */

// Simulated external data store (represents Cloudinary, S3, or external CMS)
const externalAssets = [
  {
    id: 'cloud-1',
    url: 'https://img.ly/static/ubq_samples/sample_1.jpg',
    name: 'Mountain Landscape'
  },
  {
    id: 'cloud-2',
    url: 'https://img.ly/static/ubq_samples/sample_2.jpg',
    name: 'Ocean Sunset'
  }
];

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // ===== Section 1: Register a Custom Asset Source =====
  // Register a custom asset source that fetches from an external system
  // This source will need manual refresh when external changes occur
  engine.asset.addSource({
    id: 'cloudinary-images',
    async findAssets(queryData): Promise<AssetsQueryResult> {
      // Fetch current assets from external data store
      const filteredAssets = externalAssets.filter(
        (asset) =>
          !queryData.query ||
          asset.name.toLowerCase().includes(queryData.query.toLowerCase())
      );

      return {
        assets: filteredAssets.map((asset) => ({
          id: asset.id,
          label: asset.name,
          meta: {
            uri: asset.url,
            thumbUri: asset.url,
            blockType: '//ly.img.ubq/graphic'
          }
        })),
        total: filteredAssets.length,
        currentPage: queryData.page,
        nextPage: undefined
      };
    }
  });

  console.log('✓ Created custom asset source: cloudinary-images');

  // ===== Section 2: Query Initial Assets =====
  const initialAssets = await engine.asset.findAssets('cloudinary-images', {
    page: 0,
    perPage: 100
  });
  console.log(`Initial assets: ${initialAssets.assets.length}`);
  for (const asset of initialAssets.assets) {
    console.log(`  - ${asset.id}: ${asset.label}`);
  }

  // ===== Section 3: Simulate External Upload =====
  // Simulate an external upload (e.g., from Cloudinary upload widget)
  // In a real application, this would be triggered by webhook or polling
  const newAsset = {
    id: 'cloud-3',
    url: 'https://img.ly/static/ubq_samples/sample_3.jpg',
    name: 'Forest Path'
  };
  externalAssets.push(newAsset);

  // Notify CE.SDK that the source contents have changed
  engine.asset.assetSourceContentsChanged('cloudinary-images');
  console.log('✓ External upload complete, asset source refreshed');

  // Verify the new asset is available
  const afterUpload = await engine.asset.findAssets('cloudinary-images', {
    page: 0,
    perPage: 100
  });
  console.log(`Assets after upload: ${afterUpload.assets.length}`);

  // ===== Section 4: Simulate External Modification =====
  // Simulate backend modifications (e.g., CMS updates, API changes)
  externalAssets[0] = {
    ...externalAssets[0],
    name: 'Modified: Mountain Landscape'
  };

  // Refresh the asset library to reflect changes
  engine.asset.assetSourceContentsChanged('cloudinary-images');
  console.log('✓ External modification complete, asset source refreshed');

  // Verify the modification
  const afterModification = await engine.asset.findAssets('cloudinary-images', {
    page: 0,
    perPage: 100
  });
  console.log(
    `First asset after modification: ${afterModification.assets[0].label}`
  );

  // ===== Section 5: Simulate External Deletion =====
  // Simulate asset deletion from external system
  const removed = externalAssets.pop();
  console.log(`Removed asset from external store: ${removed?.name}`);

  // Refresh the asset library to reflect the deletion
  engine.asset.assetSourceContentsChanged('cloudinary-images');
  console.log('✓ External deletion complete, asset source refreshed');

  // Verify the deletion
  const afterDeletion = await engine.asset.findAssets('cloudinary-images', {
    page: 0,
    perPage: 100
  });
  console.log(`Assets after deletion: ${afterDeletion.assets.length}`);

  // ===== Add an Image to the Scene =====
  // Use an asset from the source to create a block
  const imageBlock = engine.block.create('graphic');
  engine.block.setShape(imageBlock, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(imageBlock, imageFill);
  engine.block.setWidth(imageBlock, 400);
  engine.block.setHeight(imageBlock, 300);
  engine.block.setPositionX(imageBlock, 200);
  engine.block.setPositionY(imageBlock, 150);
  engine.block.appendChild(page, imageBlock);

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/refresh-assets-result.png`, buffer);

  console.log('✓ Exported result to output/refresh-assets-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
