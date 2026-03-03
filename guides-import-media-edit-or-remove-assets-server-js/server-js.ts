import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Edit or Remove Assets
 *
 * Demonstrates how to manage assets in local asset sources:
 * - Adding assets to local sources
 * - Finding and querying assets
 * - Updating asset metadata
 * - Removing individual assets
 * - Removing entire asset sources
 * - Handling asset source events
 */

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

  // ===== Section 1: Create a Local Asset Source =====
  // Create a local asset source to manage images
  engine.asset.addLocalSource('server-uploads');

  // Add sample assets to the source
  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-1',
    label: { en: 'Sample Image 1' },
    tags: { en: ['sample', 'image'] },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-2',
    label: { en: 'Sample Image 2' },
    tags: { en: ['sample', 'photo'] },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-3',
    label: { en: 'Sample Image 3' },
    tags: { en: ['sample', 'landscape'] },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  console.log('✓ Created local source with 3 assets');

  // ===== Section 2: Find Assets in a Source =====
  // Query assets from the source to find specific assets
  const result = await engine.asset.findAssets('server-uploads', {
    query: 'sample',
    page: 0,
    perPage: 100
  });

  console.log('Found assets:', result.assets.length);
  for (const asset of result.assets) {
    console.log(`  - ${asset.id}: ${asset.label}`);
  }

  // ===== Section 3: Update Asset Metadata =====
  // To update an asset's metadata, remove it and add an updated version
  engine.asset.removeAssetFromSource('server-uploads', 'asset-1');

  // Add the updated version with new metadata
  engine.asset.addAssetToSource('server-uploads', {
    id: 'asset-1',
    label: { en: 'Updated Sample Image' }, // New label
    tags: { en: ['sample', 'image', 'updated'] }, // New tags
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  console.log('✓ Updated asset-1 metadata');

  // ===== Section 4: Remove an Asset from a Source =====
  // Remove a single asset from the source
  // The asset is permanently deleted from the source
  engine.asset.removeAssetFromSource('server-uploads', 'asset-2');
  console.log('✓ Removed asset-2 from server-uploads');

  // Verify the asset was removed
  const afterRemove = await engine.asset.findAssets('server-uploads', {
    page: 0,
    perPage: 100
  });
  console.log('Remaining assets:', afterRemove.assets.length);

  // ===== Section 5: Notify UI of Changes =====
  // After modifying assets, notify any connected UI components
  // In server context, this ensures any connected clients are updated
  engine.asset.assetSourceContentsChanged('server-uploads');
  console.log('✓ Notified UI of source changes');

  // ===== Section 6: Create a Temporary Source =====
  // Create a temporary source that will be removed
  engine.asset.addLocalSource('temp-source');

  engine.asset.addAssetToSource('temp-source', {
    id: 'temp-asset',
    label: { en: 'Temporary Asset' },
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_4.jpg',
      blockType: '//ly.img.ubq/graphic'
    }
  });

  console.log('✓ Created temporary source with 1 asset');

  // ===== Section 7: Remove an Entire Asset Source =====
  // Remove a complete asset source and all its assets
  engine.asset.removeSource('temp-source');
  console.log('✓ Removed temp-source and all its assets');

  // ===== Section 8: Listen to Asset Source Events =====
  // Subscribe to lifecycle events for asset sources
  const unsubscribeAdded = engine.asset.onAssetSourceAdded((sourceId) => {
    console.log(`Event: Source added - ${sourceId}`);
  });

  const unsubscribeRemoved = engine.asset.onAssetSourceRemoved((sourceId) => {
    console.log(`Event: Source removed - ${sourceId}`);
  });

  const unsubscribeUpdated = engine.asset.onAssetSourceUpdated((sourceId) => {
    console.log(`Event: Source updated - ${sourceId}`);
  });

  // Demonstrate events
  engine.asset.addLocalSource('event-demo');
  engine.asset.assetSourceContentsChanged('event-demo');
  engine.asset.removeSource('event-demo');

  // Clean up subscriptions
  unsubscribeAdded();
  unsubscribeRemoved();
  unsubscribeUpdated();

  // ===== Add an Image to the Scene =====
  // Use an asset from the remaining source to create a block
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
  writeFileSync(`${outputDir}/edit-or-remove-assets-result.png`, buffer);

  console.log('✓ Exported result to output/edit-or-remove-assets-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
