import type {
  AssetsQueryResult,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

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

    // Add the custom source to the asset library
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ['cloudinary-images'],
      gridColumns: 2,
      gridItemHeight: 'square',
      previewLength: 4
    });

    // ===== Section 2: Simulate External Upload =====
    // Simulate an external upload widget (e.g., Cloudinary upload widget)
    // In a real application, this would be triggered by the widget's success callback
    const simulateExternalUpload = () => {
      // Add a new asset to the external store
      const newAsset = {
        id: `cloud-${Date.now()}`,
        url: 'https://img.ly/static/ubq_samples/sample_3.jpg',
        name: `Uploaded Image ${externalAssets.length + 1}`
      };
      externalAssets.push(newAsset);

      // Notify CE.SDK that the source contents have changed
      engine.asset.assetSourceContentsChanged('cloudinary-images');

      console.log('External upload complete, asset library refreshed');
    };

    // ===== Section 3: Simulate External Modification =====
    // Simulate backend modifications (e.g., CMS updates, API changes)
    const simulateExternalModification = () => {
      // Modify assets in the external store
      if (externalAssets.length > 0) {
        externalAssets[0] = {
          ...externalAssets[0],
          name: `Modified: ${externalAssets[0].name}`
        };
      }

      // Refresh the asset library to reflect changes
      engine.asset.assetSourceContentsChanged('cloudinary-images');

      console.log('External modification complete, asset library refreshed');
    };

    // ===== Section 4: Simulate External Deletion =====
    // Simulate asset deletion from external system
    const simulateExternalDeletion = () => {
      // Remove the last asset from the external store
      if (externalAssets.length > 2) {
        const removed = externalAssets.pop();
        console.log(`Removed asset: ${removed?.name}`);

        // Refresh the asset library to reflect the deletion
        engine.asset.assetSourceContentsChanged('cloudinary-images');

        console.log('External deletion complete, asset library refreshed');
      }
    };

    // Expose functions for demo purposes
    (window as any).simulateExternalUpload = simulateExternalUpload;
    (window as any).simulateExternalModification = simulateExternalModification;
    (window as any).simulateExternalDeletion = simulateExternalDeletion;

    // Automatically trigger an upload to demonstrate the refresh
    setTimeout(() => {
      simulateExternalUpload();
    }, 2000);

    // Open the asset library to show the custom source
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.image']
      }
    });
  }
}

export default Example;
