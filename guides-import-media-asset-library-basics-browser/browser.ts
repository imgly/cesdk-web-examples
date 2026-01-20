import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Asset Library Basics Guide
 *
 * Demonstrates the asset library architecture:
 * - Creating a custom asset source (engine layer)
 * - Creating an asset library entry (UI configuration layer)
 * - Connecting the entry to the dock (UI interaction layer)
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Design' });
    await cesdk.createDesignScene();

    // Layer 1: Asset Source - provides assets to the UI
    cesdk.engine.asset.addSource({
      id: 'my-custom-images',
      findAssets: async () => ({
        assets: [
          {
            id: 'sample-1',
            meta: {
              uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
              thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
              width: 1920,
              height: 1280
            }
          },
          {
            id: 'sample-2',
            meta: {
              uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
              thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
              width: 1920,
              height: 1280
            }
          },
          {
            id: 'sample-3',
            meta: {
              uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
              thumbUri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
              width: 1920,
              height: 1280
            }
          }
        ],
        total: 3,
        currentPage: 1,
        nextPage: undefined
      }),
      applyAsset: async (assetResult) =>
        cesdk.engine.asset.defaultApplyAsset(assetResult)
    });

    // Layer 2: Asset Library Entry - connects sources to display settings
    cesdk.ui.addAssetLibraryEntry({
      id: 'my-images-entry',
      sourceIds: ['my-custom-images'],
      previewLength: 3,
      gridColumns: 3,
      gridItemHeight: 'square'
    });

    // Layer 3: Dock - adds button to access the entry
    cesdk.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'my-images-entry',
        label: 'libraries.my-images-entry.label',
        entries: ['my-images-entry']
      },
      ...cesdk.ui.getDockOrder()
    ]);
    cesdk.i18n.setTranslations({
      en: { 'libraries.my-images-entry.label': 'My Images' }
    });

    // Query registered entries
    const allEntries = cesdk.ui.findAllAssetLibraryEntries();
    console.log('Registered entries:', allEntries);

    const myEntry = cesdk.ui.getAssetLibraryEntry('my-images-entry');
    console.log('My entry:', myEntry);

    // Open the panel to show the custom assets immediately
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: ['my-images-entry'] }
    });
  }
}

export default Example;
