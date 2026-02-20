import type {
  AssetQueryData,
  AssetResult,
  AssetSource,
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
import { calculateGridLayout } from './utils';

/**
 * Getty Images integration note:
 * The proxy server handles API authentication and translates responses
 * to CE.SDK format, so no custom interfaces are needed here.
 */

/**
 * CE.SDK Plugin: Getty Images Integration
 *
 * Demonstrates integrating Getty Images stock photos via secure proxy:
 * - Setting up proxy-based API communication
 * - Implementing findAssets with Getty Images search
 * - Handling pagination with 1-based indexing
 * - Translating Getty Images responses to CE.SDK format
 * - Managing premium content attribution and licensing
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;
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
      page: { width: 1600, height: 1200, unit: 'Pixel' }
    });

    const [page] = engine.block.findByType('page');


    // Calculate grid layout for displaying images
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 4);

    // Load Getty Images proxy URL from environment
    // The proxy securely handles API authentication without exposing credentials in the frontend
    const gettyProxyUrl = import.meta.env.VITE_GETTY_IMAGES_PROXY_URL;

    if (!gettyProxyUrl) {
      console.warn(
        'Getty Images proxy URL not configured. Set VITE_GETTY_IMAGES_PROXY_URL to enable Getty Images integration.'
      );
    }

    const EMPTY_RESULT: AssetsQueryResult<AssetResult> = {
      assets: [],
      total: 0,
      currentPage: 0,
      nextPage: undefined
    };

    // Main asset query function for Getty Images
    const findGettyAssets = async (
      queryData: AssetQueryData
    ): Promise<AssetsQueryResult<AssetResult>> => {
      // Check if proxy URL is configured
      if (!gettyProxyUrl) {
        console.error(
          'Getty Images proxy URL not configured. Please set VITE_GETTY_IMAGES_PROXY_URL environment variable.'
        );
        return EMPTY_RESULT;
      }

      try {
        // Getty Images uses 1-based page numbering
        // Convert from CE.SDK's 0-based pagination
        const gettyPage = queryData.page + 1;

        // Build query parameters for proxy request
        const params = new URLSearchParams({
          query: queryData.query || 'technology',
          page: gettyPage.toString(),
          perPage: queryData.perPage.toString()
        });

        // Call the proxy server which handles Getty Images API authentication
        // and returns data already formatted for CE.SDK
        const response = await fetch(`${gettyProxyUrl}?${params}`);

        if (!response.ok) {
          throw new Error(`Getty API error: ${response.statusText}`);
        }

        // The proxy already returns data in CE.SDK format
        const data = (await response.json()) as AssetsQueryResult<AssetResult>;
        return data;
      } catch (error) {
        console.error('Getty Images API error:', error);
        return EMPTY_RESULT;
      }
    };

    // Define the custom asset source for Getty Images
    const gettyImagesAssetSource: AssetSource = {
      id: 'gettyImagesImageAssets',
      findAssets: findGettyAssets,
      credits: {
        name: 'Getty Images',
        url: 'https://www.gettyimages.com/'
      },
      license: {
        name: 'Getty Images Content License Agreement',
        url: 'https://www.gettyimages.com/eula'
      }
    };

    // Add the custom asset source to CE.SDK
    engine.asset.addSource(gettyImagesAssetSource);

    // Configure the asset library UI with a dedicated Getty Images dock entry
    cesdk.ui.addAssetLibraryEntry({
      id: 'getty-images-entry',
      sourceIds: ['gettyImagesImageAssets'],
      previewLength: 6,
      gridColumns: 3,
      gridItemHeight: 'square'
    });

    // Add Getty Images to the existing Images asset library
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ({ currentIds }) => [...currentIds, 'gettyImagesImageAssets']
    });

    // Add Getty Images as the first button in the dock with a separator
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'getty-images',
        label: 'Getty Images',
        entries: ['getty-images-entry']
      },
      { id: 'ly.img.separator' },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Query for assets and display them in the scene (only if proxy is configured)
    if (gettyProxyUrl) {
      const result = await engine.asset.findAssets(gettyImagesAssetSource.id, {
        query: 'business',
        page: 0,
        perPage: 4
      });

      // Add images from Getty Images to the scene in a grid layout
      for (let i = 0; i < Math.min(result.assets.length, 4); i++) {
        const asset = result.assets[i];
        const position = layout.getPosition(i);

        const block = await engine.asset.apply(
          gettyImagesAssetSource.id,
          asset
        );
        engine.block.setPositionX(block, position.x);
        engine.block.setPositionY(block, position.y);
        engine.block.setWidth(block, layout.blockWidth);
        engine.block.setHeight(block, layout.blockHeight);
      }
    }

    // Expose cesdk for hero image capture
    (window as any).cesdk = cesdk;
  }
}

export default Example;
