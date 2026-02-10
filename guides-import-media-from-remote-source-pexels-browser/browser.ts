import type {
  EditorPlugin,
  EditorPluginContext,
  AssetSource,
  AssetQueryData,
  AssetResult,
  AssetsQueryResult
} from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

// Pexels API wrapper using native fetch
interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  page: number;
  per_page: number;
  total_results: number;
}

interface PexelsApiResponse {
  data: PexelsResponse;
  status: number;
}

const fetchFromPexels = async (
  url: string,
  apiKey: string
): Promise<PexelsApiResponse> => {
  const response = await fetch(`https://api.pexels.com/v1/${url}`, {
    mode: 'cors',
    headers: {
      Authorization: apiKey
    }
  });
  const json = await response.json();
  const status = response.status;
  return { data: json, status };
};

const createPexelsApi = (apiKey: string) => {
  return {
    photos: {
      search: async ({
        query,
        per_page,
        page
      }: {
        query: string;
        per_page?: number;
        page?: number;
      }) => {
        const params = new URLSearchParams();
        params.append('query', query);
        if (per_page) params.append('per_page', per_page.toString());
        if (page) params.append('page', page.toString());
        return await fetchFromPexels(`search?${params}`, apiKey);
      },
      curated: async ({
        per_page,
        page
      }: {
        per_page?: number;
        page?: number;
      }) => {
        const params = new URLSearchParams();
        if (per_page) params.append('per_page', per_page.toString());
        if (page) params.append('page', page.toString());
        return await fetchFromPexels(`curated?${params}`, apiKey);
      }
    }
  };
};

/**
 * CE.SDK Plugin: Custom Asset Source with Pexels
 *
 * Demonstrates integrating custom asset sources into CE.SDK:
 * - Creating custom asset source definitions
 * - Implementing findAssets callback for Pexels API
 * - Mapping external API responses to CE.SDK asset format
 * - Handling pagination and search
 * - Adding credits and licenses
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load default assets and create a basic scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Design' });
    await cesdk.createDesignScene();

    const [page] = engine.block.findByType('page');

    // Set page dimensions for the canvas
    engine.block.setWidth(page, 1600);
    engine.block.setHeight(page, 1200);

    // Calculate grid layout for displaying images
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 3);

    // Create Pexels API client
    const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;

    if (!pexelsApiKey) {
      throw new Error('VITE_PEXELS_API_KEY environment variable is required');
    }

    const PexelsApi = createPexelsApi(pexelsApiKey);

    // Configure localization for the asset library
    cesdk.i18n.setTranslations({
      en: {
        'libraries.pexels.label': 'Pexels'
      }
    });

    // Main asset query function for Pexels
    const findPexelsAssets = async (
      queryData: AssetQueryData
    ): Promise<AssetsQueryResult<AssetResult>> => {
      // Pexels page indices are 1-based, but only pass if > 0
      const pexelsPage = queryData.page > 0 ? queryData.page : undefined;

      if (queryData.query) {
        // Search for images with a query string
        const response = await PexelsApi.photos.search({
          query: queryData.query,
          page: pexelsPage,
          per_page: queryData.perPage
        });

        if (response.status === 200) {
          const { photos, total_results, page } = response.data;
          const assets = photos.map((image) => translateToAssetResult(image));
          const nextPage = photos.length > 0 ? (page ?? 0) + 1 : undefined;

          return {
            assets,
            total: total_results,
            currentPage: page ?? 0,
            nextPage
          };
        } else {
          const error = new Error(
            `Received a response with code ${response.status} when trying to access Pexels`
          );
          console.error(error);
          throw error;
        }
      } else {
        // Show curated images when no query is provided
        const response = await PexelsApi.photos.curated({
          page: pexelsPage,
          per_page: queryData.perPage
        });

        if (response.status === 200) {
          const { photos, total_results, page } = response.data;
          const assets = photos.map((image) => translateToAssetResult(image));
          const nextPage = photos.length > 0 ? (page ?? 0) + 1 : undefined;

          return {
            assets,
            total: total_results,
            currentPage: page ?? 0,
            nextPage
          };
        } else {
          const error = new Error(
            `Received a response with code ${response.status} when trying to access Pexels`
          );
          console.error(error);
          throw error;
        }
      }
    };

    // Translate Pexels photo to CE.SDK AssetResult format
    const translateToAssetResult = (image: PexelsPhoto): AssetResult => {
      const artistName = image.photographer;
      const artistUrl = image.photographer_url;
      const thumbUri = image.src.medium;
      const id = image.id.toString();
      const credits = {
        name: artistName,
        url: artistUrl
      };

      return {
        id,
        locale: 'en',
        meta: {
          thumbUri,
          width: image.width,
          height: image.height,
          mimeType: 'image/jpeg',
          uri: image.src.original
        },
        utm: {
          source: 'CE.SDK Demo',
          medium: 'referral'
        },
        credits
      };
    };

    // Define the Pexels asset source
    const pexelsAssetSource: AssetSource = {
      id: 'pexels',
      findAssets: findPexelsAssets,
      credits: {
        name: 'Pexels',
        url: 'https://pexels.com/'
      },
      license: {
        name: 'Pexels license (free)',
        url: 'https://pexels.com/license'
      }
    };

    // Register the Pexels asset source
    engine.asset.addSource(pexelsAssetSource);

    // Configure the asset library UI with a dedicated Pexels dock entry
    cesdk.ui.addAssetLibraryEntry({
      id: 'pexels',
      sourceIds: ['pexels'],
      previewLength: 6,
      gridColumns: 3
    });

    // Add Pexels to the existing Images asset library
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ({ currentIds }) => [...currentIds, 'pexels']
    });

    // Add Pexels as the first button in the dock with a separator
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'pexels',
        label: 'libraries.pexels.label',
        entries: ['pexels']
      },
      { id: 'ly.img.separator' },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Query for assets and display them (only if scene was created successfully)
    const result = await engine.asset.findAssets(pexelsAssetSource.id, {
      page: 0,
      perPage: 4
    });

    // Add images from Pexels to the scene in a grid layout
    for (let i = 0; i < Math.min(result.assets.length, 4); i++) {
      const asset = result.assets[i];
      const position = layout.getPosition(i);

      const block = await engine.asset.apply(pexelsAssetSource.id, asset);
      engine.block.setPositionX(block, position.x);
      engine.block.setPositionY(block, position.y);
      engine.block.setWidth(block, layout.blockWidth);
      engine.block.setHeight(block, layout.blockHeight);
    }
  }
}

export default Example;
