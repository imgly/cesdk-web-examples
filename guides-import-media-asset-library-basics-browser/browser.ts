import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'my-images-entry',
        label: 'libraries.my-images-entry.label',
        entries: ['my-images-entry']
      },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
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
