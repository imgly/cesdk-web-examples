import type {
  EditorPlugin,
  EditorPluginContext,
  AssetSource,
  AssetQueryData,
  AssetResult,
  AssetDefinition,
  AssetsQueryResult
} from '@cesdk/cesdk-js';
import { createApi } from 'unsplash-js';
import type { Basic as UnsplashPhoto } from 'unsplash-js/dist/methods/photos/types';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Custom Asset Source with Unsplash
 *
 * Demonstrates integrating custom asset sources into CE.SDK:
 * - Creating custom asset source definitions
 * - Implementing findAssets callback for Unsplash API
 * - Mapping external API responses to CE.SDK asset format
 * - Handling pagination and search
 * - Adding credits and licenses
 * - Creating local asset sources
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
    const layout = calculateGridLayout(pageWidth, pageHeight, 4);

    // Create Unsplash API client with proxy URL
    // The proxy securely handles API authentication without exposing keys in the frontend
    const unsplashProxyUrl = import.meta.env.VITE_UNSPLASH_PROXY_URL;

    if (!unsplashProxyUrl) {
      throw new Error(
        'VITE_UNSPLASH_PROXY_URL environment variable is required'
      );
    }

    const unsplashApi = createApi({
      apiUrl: unsplashProxyUrl
    });

    const EMPTY_RESULT: AssetsQueryResult<AssetResult> = {
      assets: [],
      total: 0,
      currentPage: 0,
      nextPage: undefined
    };

    // Main asset query function for Unsplash
    const findUnsplashAssets = async (
      queryData: AssetQueryData
    ): Promise<AssetsQueryResult<AssetResult>> => {
      // Unsplash page indices are 1-based
      const unsplashPage = queryData.page + 1;

      if (queryData.query) {
        // Search for images with a query string
        const response = await unsplashApi.search.getPhotos({
          query: queryData.query,
          page: unsplashPage,
          perPage: queryData.perPage
        });

        if (response.type === 'success') {
          const { results, total, total_pages } = response.response;

          return {
            assets: await Promise.all(results.map(translateToAssetResult)),
            total,
            currentPage: queryData.page,
            nextPage:
              queryData.page + 1 < total_pages ? queryData.page + 1 : undefined
          };
        } else if (response.type === 'error') {
          throw new Error(response.errors.join('. '));
        } else {
          return Promise.resolve(EMPTY_RESULT);
        }
      } else {
        // List popular images when no query is provided
        const response = await (unsplashApi.photos as any).list({
          orderBy: 'popular',
          page: unsplashPage,
          perPage: queryData.perPage
        });

        if (response.type === 'success') {
          const { results, total } = response.response;
          const totalFetched =
            queryData.page * queryData.perPage + results.length;
          const nextPage =
            totalFetched < total ? queryData.page + 1 : undefined;

          return {
            assets: await Promise.all(results.map(translateToAssetResult)),
            total,
            currentPage: queryData.page,
            nextPage
          };
        } else if (response.type === 'error') {
          throw new Error(response.errors.join('. '));
        } else {
          return Promise.resolve(EMPTY_RESULT);
        }
      }
    };

    // Helper function to get Unsplash download URL
    const getUnsplashUrl = async (unsplashResult: UnsplashPhoto) => {
      const trackDownloadResponse = await unsplashApi.photos.trackDownload({
        downloadLocation: unsplashResult.links.download_location
      });

      if (trackDownloadResponse.type === 'error') {
        throw new Error(trackDownloadResponse.errors.join('. '));
      }
      return trackDownloadResponse.response?.url || unsplashResult.urls.regular;
    };

    // Translate Unsplash image to CE.SDK asset format
    async function translateToAssetResult(image: any): Promise<AssetResult> {
      const artistName = image?.user?.name;
      const artistUrl = image?.user?.links?.html;
      const description =
        image.description ?? image.alt_description ?? 'Unsplash Image';

      return {
        id: image.id,
        locale: 'en',
        label: description,
        tags: image.tags ? image.tags.map((tag: any) => tag.title) : undefined,

        meta: {
          uri: await getUnsplashUrl(image),
          thumbUri: image.urls.thumb,
          blockType: '//ly.img.ubq/graphic',
          fillType: '//ly.img.ubq/fill/image',
          shapeType: '//ly.img.ubq/shape/rect',
          kind: 'image',
          width: image.width,
          height: image.height
        },

        credits: artistName
          ? {
              name: artistName,
              url: artistUrl
            }
          : undefined,

        utm: {
          source: 'CE.SDK Demo',
          medium: 'referral'
        }
      };
    }

    // Define the custom asset source for Unsplash
    const customSource: AssetSource = {
      id: 'unsplash',
      findAssets: findUnsplashAssets,
      credits: {
        name: 'Unsplash',
        url: 'https://unsplash.com/'
      },
      license: {
        name: 'Unsplash license (free)',
        url: 'https://unsplash.com/license'
      }
    };

    // Add the custom asset source to CE.SDK
    engine.asset.addSource(customSource);

    // Query for assets and display them (only if scene was created successfully)
    const result = await engine.asset.findAssets(customSource.id, {
      page: 0,
      perPage: 4
    });

    // Add images from Unsplash to the scene in a grid layout
    for (let i = 0; i < Math.min(result.assets.length, 4); i++) {
      const asset = result.assets[i];
      const position = layout.getPosition(i);

      const block = await engine.asset.apply(customSource.id, asset);
      engine.block.setPositionX(block, position.x);
      engine.block.setPositionY(block, position.y);
      engine.block.setWidth(block, layout.blockWidth);
      engine.block.setHeight(block, layout.blockHeight);
    }

    // Create a local asset source for custom assets
    const localSourceId = 'background-videos';
    engine.asset.addLocalSource(localSourceId);

    // Add a custom video asset to the local source
    engine.asset.addAssetToSource(localSourceId, {
      id: 'ocean-waves-1',
      label: {
        en: 'relaxing ocean waves',
        es: 'olas del mar relajantes'
      },
      tags: {
        en: ['ocean', 'waves', 'soothing', 'slow'],
        es: ['mar', 'olas', 'calmante', 'lento']
      },
      meta: {
        uri: 'https://img.ly/static/ubq_video_samples/bbb.mp4',
        thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
        mimeType: 'video/mp4',
        width: 1920,
        height: 1080
      }
    } as AssetDefinition);

    // Configure the asset library UI with a dedicated Unsplash dock entry
    // This must be done at the end after all default assets are registered
    cesdk.ui.addAssetLibraryEntry({
      id: 'unsplash-entry',
      sourceIds: ['unsplash'],
      previewLength: 6,
      gridColumns: 3,
      gridItemHeight: 'square'
    });

    // Add Unsplash to the existing Images asset library
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ({ currentIds }) => [...currentIds, 'unsplash']
    });

    // Add Unsplash as the first button in the dock with a separator
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'unsplash',
        label: 'Unsplash',
        entries: ['unsplash-entry']
      },
      { id: 'ly.img.separator' },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);
  }
}

export default Example;
