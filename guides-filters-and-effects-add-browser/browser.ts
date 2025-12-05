import type {
  EditorPlugin,
  EditorPluginContext,
  AssetSource,
  AssetQueryData,
  AssetsQueryResult,
  AssetResult
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Create Custom Filters Guide
 *
 * Demonstrates creating and registering custom LUT filter asset sources:
 * - Creating a filter source with addSource()
 * - Defining filter assets with LUT metadata
 * - Loading filters from JSON configuration
 * - Querying custom filters
 * - Applying filters from custom sources
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load default assets
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Enable filters in the inspector panel using the Feature API
    cesdk.feature.enable('ly.img.filter');

    // Add a custom filter to the built-in LUT filter source
    // The ID must follow the format //ly.img.cesdk.filters.lut/{name}
    // for the UI to display the label correctly
    engine.asset.addAssetToSource('ly.img.filter.lut', {
      id: '//ly.img.cesdk.filters.lut/mycustomfilter',
      label: { en: 'MY CUSTOM FILTER' },
      tags: { en: ['custom', 'brand'] },
      meta: {
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        horizontalTileCount: '5',
        verticalTileCount: '5',
        blockType: '//ly.img.ubq/effect/lut_filter'
      }
    });

    // Add translation for the custom filter label
    cesdk.i18n.setTranslations({
      en: {
        'property.lutFilter.mycustomfilter': 'MY CUSTOM FILTER'
      }
    });

    // Create a custom filter asset source for organizing multiple filters
    const customFilterSource: AssetSource = {
      id: 'my-custom-filters',

      async findAssets(
        queryData: AssetQueryData
      ): Promise<AssetsQueryResult | undefined> {
        // Define custom LUT filter assets
        const filters: AssetResult[] = [
          {
            id: 'vintage-warm',
            label: 'Vintage Warm',
            tags: ['vintage', 'warm', 'retro'],
            meta: {
              uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              thumbUri:
                'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              horizontalTileCount: '5',
              verticalTileCount: '5',
              blockType: '//ly.img.ubq/effect/lut_filter'
            }
          },
          {
            id: 'cool-cinema',
            label: 'Cool Cinema',
            tags: ['cinema', 'cool', 'film'],
            meta: {
              uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              thumbUri:
                'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              horizontalTileCount: '5',
              verticalTileCount: '5',
              blockType: '//ly.img.ubq/effect/lut_filter'
            }
          },
          {
            id: 'bw-classic',
            label: 'B&W Classic',
            tags: ['black and white', 'classic', 'monochrome'],
            meta: {
              uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              thumbUri:
                'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
              horizontalTileCount: '5',
              verticalTileCount: '5',
              blockType: '//ly.img.ubq/effect/lut_filter'
            }
          }
        ];

        // Filter by query if provided
        let filteredAssets = filters;
        if (queryData.query) {
          const searchTerm = queryData.query.toLowerCase();
          filteredAssets = filters.filter(
            (asset) =>
              asset.label?.toLowerCase().includes(searchTerm) ||
              asset.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
        }

        // Filter by groups if provided
        if (queryData.groups && queryData.groups.length > 0) {
          filteredAssets = filteredAssets.filter((asset) =>
            asset.tags?.some((tag) => queryData.groups?.includes(tag))
          );
        }

        // Handle pagination
        const page = queryData.page ?? 0;
        const perPage = queryData.perPage ?? 10;
        const startIndex = page * perPage;
        const paginatedAssets = filteredAssets.slice(
          startIndex,
          startIndex + perPage
        );

        return {
          assets: paginatedAssets,
          total: filteredAssets.length,
          currentPage: page,
          nextPage:
            startIndex + perPage < filteredAssets.length ? page + 1 : undefined
        };
      },

      // Return available filter categories
      async getGroups(): Promise<string[]> {
        return ['vintage', 'cinema', 'black and white'];
      }
    };

    // Register the custom filter source for programmatic access
    engine.asset.addSource(customFilterSource);

    // Load filters from a JSON configuration string
    const filterConfigJSON = JSON.stringify({
      version: '2.0.0',
      id: 'my-json-filters',
      assets: [
        {
          id: 'sunset-glow',
          label: { en: 'Sunset Glow' },
          tags: { en: ['warm', 'sunset', 'golden'] },
          groups: ['Warm Tones'],
          meta: {
            uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            thumbUri:
              'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            horizontalTileCount: '5',
            verticalTileCount: '5',
            blockType: '//ly.img.ubq/effect/lut_filter'
          }
        },
        {
          id: 'ocean-breeze',
          label: { en: 'Ocean Breeze' },
          tags: { en: ['cool', 'blue', 'ocean'] },
          groups: ['Cool Tones'],
          meta: {
            uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            thumbUri:
              'https://cdn.img.ly/packages/imgly/cesdk-js/1.66.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
            horizontalTileCount: '5',
            verticalTileCount: '5',
            blockType: '//ly.img.ubq/effect/lut_filter'
          }
        }
      ]
    });

    // Create asset source from JSON string
    const jsonSourceId =
      await engine.asset.addLocalAssetSourceFromJSONString(filterConfigJSON);
    // eslint-disable-next-line no-console
    console.log('Created JSON-based filter source:', jsonSourceId);

    // Query filters from our custom source for programmatic use
    const customFilterResults = await engine.asset.findAssets(
      'my-custom-filters',
      {
        page: 0,
        perPage: 10
      }
    );

    // Create an image block to demonstrate applying a custom filter
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      x: 50,
      y: 150,
      size: { width: 300, height: 200 }
    });
    engine.block.appendChild(page, imageBlock);

    // Get a filter from our custom source
    const filterAsset = customFilterResults.assets[0];
    if (filterAsset && filterAsset.meta) {
      // Create and configure the LUT filter effect
      const lutEffect = engine.block.createEffect(
        '//ly.img.ubq/effect/lut_filter'
      );

      // Set LUT file URI from asset metadata
      engine.block.setString(
        lutEffect,
        'effect/lut_filter/lutFileURI',
        filterAsset.meta.uri as string
      );

      // Configure LUT grid dimensions
      engine.block.setInt(
        lutEffect,
        'effect/lut_filter/horizontalTileCount',
        parseInt(filterAsset.meta.horizontalTileCount as string, 10)
      );
      engine.block.setInt(
        lutEffect,
        'effect/lut_filter/verticalTileCount',
        parseInt(filterAsset.meta.verticalTileCount as string, 10)
      );

      // Set filter intensity (0.0 to 1.0)
      engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.85);

      // Apply the effect to the image block
      engine.block.appendEffect(imageBlock, lutEffect);
    }

    // Create a second image without a filter for comparison
    const imageBlock2 = await engine.block.addImage(imageUri, {
      x: 450,
      y: 150,
      size: { width: 300, height: 200 }
    });
    engine.block.appendChild(page, imageBlock2);

    // Select the filtered image to show the filter in the inspector
    engine.block.select(imageBlock);

    // eslint-disable-next-line no-console
    console.log(
      'Custom filters guide initialized. Select an image to see filters in the inspector panel.'
    );
  }
}

export default Example;
