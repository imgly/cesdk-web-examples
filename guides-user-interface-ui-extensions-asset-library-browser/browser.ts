import type {
  EditorPlugin,
  EditorPluginContext,
  AssetQueryData,
  AssetsQueryResult,
  AssetResult
} from '@cesdk/cesdk-js';
import { createApi, OrderBy } from 'unsplash-js';
import packageJson from './package.json';

// Create Unsplash API client with proxy URL
// For production, use your own Unsplash proxy with your API key
const unsplashApi = createApi({
  apiUrl: 'https://api.img.ly/unsplashProxy'
});

// Transform Unsplash photo to CE.SDK AssetResult format
function transformToAssetResult(photo: {
  id: string;
  description: string | null;
  alt_description: string | null;
  width: number;
  height: number;
  urls: { regular: string; small: string };
  user: { name: string; links: { html: string } };
}): AssetResult {
  return {
    id: photo.id,
    label: photo.alt_description || photo.description || 'Unsplash Photo',
    tags: photo.alt_description?.split(' ').slice(0, 5),
    meta: {
      uri: photo.urls.regular,
      thumbUri: photo.urls.small,
      blockType: '//ly.img.ubq/graphic',
      fillType: '//ly.img.ubq/fill/image',
      shapeType: '//ly.img.ubq/shape/rect',
      kind: 'image',
      width: photo.width,
      height: photo.height
    },
    credits: {
      name: photo.user.name,
      url: photo.user.links.html
    },
    utm: {
      source: 'CE.SDK Demo',
      medium: 'referral'
    }
  };
}

// Fetch photos from Unsplash API
async function fetchUnsplashPhotos(
  queryData: AssetQueryData
): Promise<{ photos: AssetResult[]; total: number }> {
  // Unsplash uses 1-indexed pages, CE.SDK uses 0-indexed
  const page = queryData.page + 1;

  if (queryData.query) {
    // Search endpoint for query-based searches
    const response = await unsplashApi.search.getPhotos({
      query: queryData.query,
      page,
      perPage: queryData.perPage
    });

    if (response.type === 'error') {
      throw new Error('Failed to search Unsplash photos');
    }

    const results = response.response.results;
    return {
      photos: results.map(transformToAssetResult),
      total: response.response.total
    };
  } else {
    // List endpoint for browsing popular photos
    const response = await unsplashApi.photos.list({
      orderBy: OrderBy.POPULAR,
      page,
      perPage: queryData.perPage
    });

    if (response.type === 'error') {
      throw new Error('Failed to list Unsplash photos');
    }

    const results = response.response.results;
    return {
      photos: results.map(transformToAssetResult),
      // For list endpoint, estimate total as large number since it's paginated
      total: 10000
    };
  }
}

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Create a design scene to work with
    await cesdk.createDesignScene();

    // Create an Unsplash asset source with remote API fetching
    engine.asset.addSource({
      id: 'unsplash-images',
      async findAssets(queryData: AssetQueryData): Promise<AssetsQueryResult> {
        try {
          const { photos, total } = await fetchUnsplashPhotos(queryData);

          // Calculate if there are more pages
          const startIndex = queryData.page * queryData.perPage;
          const hasNextPage = startIndex + photos.length < total;

          return {
            assets: photos,
            currentPage: queryData.page,
            nextPage: hasNextPage ? queryData.page + 1 : undefined,
            total
          };
        } catch (error) {
          console.error('Failed to fetch Unsplash photos:', error);
          return {
            assets: [],
            currentPage: queryData.page,
            nextPage: undefined,
            total: 0
          };
        }
      },
      // Provide available groups for filtering
      async getGroups(): Promise<string[]> {
        return ['nature', 'architecture', 'people', 'animals'];
      },
      // Unsplash credits and license
      credits: {
        name: 'Unsplash',
        url: 'https://unsplash.com'
      },
      license: {
        name: 'Unsplash License',
        url: 'https://unsplash.com/license'
      }
    });

    // Create a local asset source for user uploads
    engine.asset.addLocalSource('user-uploads', [
      'image/jpeg',
      'image/png',
      'image/webp'
    ]);

    // Add a custom asset library panel to display Unsplash images
    cesdk.ui.addAssetLibraryEntry({
      id: 'unsplash-panel',
      sourceIds: ['unsplash-images'],
      title: 'Unsplash Images',
      icon: 'ly.img.image',
      gridColumns: 3,
      gridItemHeight: 'square',
      cardLabel: (asset: AssetResult) => asset.label || '',
      cardStyle: (asset: AssetResult) => ({
        backgroundImage: `url(${asset.meta?.thumbUri})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      })
    });

    // Add an asset library panel for user uploads
    cesdk.ui.addAssetLibraryEntry({
      id: 'uploads-panel',
      sourceIds: ['user-uploads'],
      title: 'My Uploads',
      icon: 'ly.img.upload',
      gridColumns: 3,
      gridItemHeight: 'square',
      canAdd: true,
      cardLabel: (asset: AssetResult) => asset.label || '',
      cardStyle: (asset: AssetResult) => ({
        backgroundImage: `url(${asset.meta?.thumbUri})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      })
    });

    // Set dock to show both Unsplash and Uploads panels
    cesdk.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'unsplash-images',
        icon: '@imgly/Image',
        label: 'Unsplash',
        entries: ['unsplash-panel']
      },
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'user-uploads',
        icon: '@imgly/Upload',
        label: 'Uploads',
        entries: ['uploads-panel']
      }
    ]);

    // Register middleware to handle asset application
    engine.asset.registerApplyMiddleware(
      async (sourceId, assetResult, apply, context) => {
        // Log asset application for debugging
        console.log(`Applying asset from source: ${sourceId}`);
        console.log('Asset:', assetResult.label);

        // For Unsplash, you would typically track the download here
        // using the download_location URL to comply with Unsplash guidelines

        // Call the original apply function to create the block
        const blockId = await apply(sourceId, assetResult);

        return blockId;
      }
    );

    // Query available asset sources
    const allSources = engine.asset.findAllSources();
    console.log('All asset sources:', allSources);

    // Get metadata from the Unsplash source
    const credits = engine.asset.getCredits('unsplash-images');
    console.log('Source credits:', credits);

    const license = engine.asset.getLicense('unsplash-images');
    console.log('Source license:', license);

    // Query and manage asset library entries
    const allEntries = cesdk.ui.findAllAssetLibraryEntries();
    console.log('All asset library entries:', allEntries);

    // Get the Unsplash panel entry
    const unsplashEntry = cesdk.ui.getAssetLibraryEntry('unsplash-panel');
    console.log('Unsplash entry:', unsplashEntry);

    // Update the panel configuration
    cesdk.ui.updateAssetLibraryEntry('unsplash-panel', {
      gridColumns: 4
    });

    // Open the Unsplash asset library panel on startup
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['unsplash-panel'],
        title: 'Unsplash'
      }
    });
  }
}

export default Example;
