import CreativeEngine from '@cesdk/node';
import type {
  AssetSource,
  AssetQueryData,
  AssetsQueryResult,
  AssetResult
} from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Create Custom Filters
 *
 * Demonstrates creating and registering custom LUT filter asset sources:
 * - Creating a filter source with addSource()
 * - Defining filter assets with LUT metadata
 * - Loading filters from JSON configuration
 * - Querying custom filters
 * - Applying filters from custom sources
 * - Exporting the result
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 600 } }
  });
  const page = engine.block.findByType('page')[0];

  // Define custom LUT filter assets with metadata
  const customFilters: AssetResult[] = [
    {
      id: 'vintage-warm',
      label: 'Vintage Warm',
      tags: ['vintage', 'warm', 'retro'],
      meta: {
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
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
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_bw_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_bw_5_5_128.png',
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
        uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_bw_5_5_128.png',
        thumbUri:
          'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_bw_5_5_128.png',
        horizontalTileCount: '5',
        verticalTileCount: '5',
        blockType: '//ly.img.ubq/effect/lut_filter'
      }
    }
  ];

  // Create a custom filter asset source
  const customFilterSource: AssetSource = {
    id: 'my-custom-filters',

    async findAssets(
      queryData: AssetQueryData
    ): Promise<AssetsQueryResult | undefined> {
      // Filter by query if provided
      let filteredAssets = customFilters;
      if (queryData.query) {
        const searchTerm = queryData.query.toLowerCase();
        filteredAssets = customFilters.filter(
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
      const currentPage = queryData.page ?? 0;
      const perPage = queryData.perPage ?? 10;
      const startIndex = currentPage * perPage;
      const paginatedAssets = filteredAssets.slice(
        startIndex,
        startIndex + perPage
      );

      return {
        assets: paginatedAssets,
        total: filteredAssets.length,
        currentPage,
        nextPage:
          startIndex + perPage < filteredAssets.length
            ? currentPage + 1
            : undefined
      };
    },

    // Return available filter categories
    async getGroups(): Promise<string[]> {
      return ['vintage', 'cinema', 'black and white'];
    }
  };

  // Register the custom filter source
  engine.asset.addSource(customFilterSource);
  console.log('Registered custom filter source: my-custom-filters');

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
          uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
          thumbUri:
            'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png',
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
          uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_bw_5_5_128.png',
          thumbUri:
            'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_bw_5_5_128.png',
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
  console.log('Created JSON-based filter source:', jsonSourceId);

  // Query filters from the custom source
  const customFilterResults = await engine.asset.findAssets(
    'my-custom-filters',
    {
      page: 0,
      perPage: 10
    }
  );
  console.log('Found', customFilterResults.total, 'filters in custom source');

  // Query filters from the JSON source
  const jsonFilterResults = await engine.asset.findAssets('my-json-filters', {
    page: 0,
    perPage: 10
  });
  console.log('Found', jsonFilterResults.total, 'filters in JSON source');

  // List all registered asset sources
  const allSources = engine.asset.findAllSources();
  console.log('Registered sources:', allSources);

  // Create an image block
  const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
  const imageBlock = await engine.block.addImage(imageUri, {
    x: 50,
    y: 50,
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, imageBlock);

  // Get the first filter from our custom source
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
    console.log('Applied filter:', filterAsset.label);
  }

  // Create a second image block with a filter from JSON source
  const imageBlock2 = await engine.block.addImage(imageUri, {
    x: 450,
    y: 50,
    size: { width: 300, height: 225 }
  });
  engine.block.appendChild(page, imageBlock2);

  // Get a filter from the JSON source
  const jsonFilterAsset = jsonFilterResults.assets[0];
  if (jsonFilterAsset && jsonFilterAsset.meta) {
    const lutEffect2 = engine.block.createEffect(
      '//ly.img.ubq/effect/lut_filter'
    );

    engine.block.setString(
      lutEffect2,
      'effect/lut_filter/lutFileURI',
      jsonFilterAsset.meta.uri as string
    );
    engine.block.setInt(
      lutEffect2,
      'effect/lut_filter/horizontalTileCount',
      parseInt(jsonFilterAsset.meta.horizontalTileCount as string, 10)
    );
    engine.block.setInt(
      lutEffect2,
      'effect/lut_filter/verticalTileCount',
      parseInt(jsonFilterAsset.meta.verticalTileCount as string, 10)
    );
    engine.block.setFloat(lutEffect2, 'effect/lut_filter/intensity', 0.85);

    engine.block.appendEffect(imageBlock2, lutEffect2);
    console.log('Applied JSON filter:', jsonFilterAsset.label);
  }

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/custom-filters.png', buffer);
  console.log('Exported to output/custom-filters.png');
} finally {
  engine.dispose();
}
