import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: false
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // ===== Section 1: Create a Local Asset Source =====
    // Create a local asset source to manage images
    engine.asset.addLocalSource('my-uploads');

    // Add some sample assets to the source
    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-1',
      label: { en: 'Mountain Landscape' },
      tags: { en: ['nature', 'mountain'] },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-2',
      label: { en: 'Ocean Waves' },
      tags: { en: ['nature', 'water'] },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-3',
      label: { en: 'Forest Path' },
      tags: { en: ['nature', 'forest'] },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    // ===== Section 2: Find Assets in a Source =====
    // Query assets from the source to find specific assets
    const result = await engine.asset.findAssets('my-uploads', {
      query: 'nature',
      page: 0,
      perPage: 100
    });

    console.log('Found assets:', result.assets.length);
    const assetToModify = result.assets.find((a) => a.id === 'image-1');
    console.log('Asset to modify:', assetToModify?.label);

    // ===== Section 3: Update Asset Metadata =====
    // To update an asset's metadata, remove it and add an updated version
    // This pattern ensures the asset library reflects the latest data
    engine.asset.removeAssetFromSource('my-uploads', 'image-1');

    // Add the updated version with new metadata
    engine.asset.addAssetToSource('my-uploads', {
      id: 'image-1',
      label: { en: 'Updated Mountain Photo' }, // New label
      tags: { en: ['nature', 'mountain', 'updated'] }, // New tags
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    // ===== Section 4: Remove an Asset from a Source =====
    // Remove a single asset from the source
    // Blocks already using this asset on the canvas remain unaffected
    engine.asset.removeAssetFromSource('my-uploads', 'image-2');
    console.log('Removed image-2 from my-uploads');

    // ===== Section 5: Notify UI of Changes =====
    // After modifying assets, notify the UI to refresh
    // This triggers update events for components like the asset library panel
    engine.asset.assetSourceContentsChanged('my-uploads');

    // ===== Section 6: Create a Second Source for Removal Demo =====
    // Create a temporary source to demonstrate source removal
    engine.asset.addLocalSource('temporary-uploads');

    engine.asset.addAssetToSource('temporary-uploads', {
      id: 'temp-1',
      label: { en: 'Temporary Image' },
      meta: {
        uri: 'https://img.ly/static/ubq_samples/sample_4.jpg',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_4.jpg',
        blockType: '//ly.img.ubq/graphic'
      }
    });

    // ===== Section 7: Remove an Entire Asset Source =====
    // Remove a complete asset source and all its assets
    // Any UI panels displaying this source will stop showing content
    engine.asset.removeSource('temporary-uploads');
    console.log('Removed temporary-uploads source');

    // ===== Section 8: Listen to Asset Source Events =====
    // Subscribe to lifecycle events for asset sources
    const unsubscribeAdded = engine.asset.onAssetSourceAdded((sourceId) => {
      console.log(`Source added: ${sourceId}`);
    });

    const unsubscribeRemoved = engine.asset.onAssetSourceRemoved((sourceId) => {
      console.log(`Source removed: ${sourceId}`);
    });

    const unsubscribeUpdated = engine.asset.onAssetSourceUpdated((sourceId) => {
      console.log(`Source updated: ${sourceId}`);
    });

    // Demonstrate events by creating and removing a source
    engine.asset.addLocalSource('event-demo-source');
    engine.asset.assetSourceContentsChanged('event-demo-source');
    engine.asset.removeSource('event-demo-source');

    // Clean up subscriptions when no longer needed
    unsubscribeAdded();
    unsubscribeRemoved();
    unsubscribeUpdated();

    // ===== Configure Asset Library Display =====
    // Configure the asset library to show our custom source
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ['my-uploads'],
      gridBackgroundType: 'cover',
      previewBackgroundType: 'contain'
    });

    // Open the asset library to show the custom uploads
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.image']
      }
    });
  }
}

export default Example;
