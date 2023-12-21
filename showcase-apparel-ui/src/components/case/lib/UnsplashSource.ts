import type CreativeEngine from '@cesdk/engine';
import type {
  AssetQueryData,
  AssetResult,
  AssetSource,
  AssetsQueryResult
} from '@cesdk/engine';
import { OrderBy, createApi } from 'unsplash-js';

const EMPTY_RESULT = {
  assets: [],
  total: 0,
  currentPage: 0,
  nextPage: undefined
};

function createUnsplashSource(proxyUrl: string, engine: CreativeEngine) {
  const unsplash = createApi({
    apiUrl: proxyUrl
  });

  const UnsplashSource: AssetSource = {
    id: 'unsplash',
    credits: {
      name: 'Unsplash',
      url: 'https://unsplash.com/'
    },
    license: {
      name: 'Unsplash license (free)',
      url: 'https://unsplash.com/license'
    },
    applyAsset: async (assetResult) => {
      const url = await trackDownloadAndReturnURL(assetResult);

      const blockId = await engine.asset.defaultApplyAsset({
        ...assetResult,
        meta: {
          ...assetResult.meta,
          previewUri: assetResult?.meta?.thumbUri,
          uri: url
        }
      });

      return blockId;
    },
    applyAssetToBlock: async (assetResult, blockId) => {
      const url = await trackDownloadAndReturnURL(assetResult);

      await engine.asset.defaultApplyAssetToBlock(
        {
          ...assetResult,
          meta: {
            ...assetResult.meta,
            previewUri: assetResult?.meta?.thumbUri,
            uri: url
          }
        },
        blockId
      );
    },
    async findAssets(queryData: AssetQueryData): Promise<AssetsQueryResult> {
      // NOTE: Unsplashs paginations starts with 1. Using zero here returns
      // also the first page, resulting in page 0 and page 1 being the same page
      // Since we are using a default of 0 inside `AssetLibraryGrid:76`, we need
      // to reset this for Unsplash here.
      const page = queryData.page === 0 ? 1 : queryData.page;

      if (queryData.query) {
        const response = await unsplash.search.getPhotos({
          query: queryData.query,
          page,
          perPage: queryData.perPage,
          orderBy: 'relevant'
        });
        if (response.type === 'success') {
          const { results, total, total_pages } = response.response;

          return {
            assets: results.map((asset) => translateToAssetResult(asset)),

            total,
            currentPage: page,
            nextPage: page + 1 <= total_pages ? page + 1 : undefined
          };
        } else if (response.type === 'error') {
          throw new Error(response.errors[0]);
        } else {
          return Promise.resolve(EMPTY_RESULT);
        }
      } else {
        const response = await unsplash.photos.list({
          orderBy: OrderBy.LATEST,
          page,
          perPage: queryData.perPage
        });

        if (response.type === 'success') {
          const { results, total } = response.response;
          const totalFetched = (page - 1) * queryData.perPage + results.length;
          const nextPage = totalFetched < total ? page + 1 : undefined;
          const assets = results.map((asset) => translateToAssetResult(asset));

          return {
            assets,
            total,
            currentPage: page,
            nextPage
          };
        } else if (response.type === 'error') {
          throw new Error(response.errors[0]);
        } else {
          return Promise.resolve(EMPTY_RESULT);
        }
      }
    },
    getGroups: () => {
      return Promise.resolve([]);
    },
    addAsset: () => {
      throw new Error('Not implemented');
    },
    removeAsset: () => {
      throw new Error('Not implemented');
    }
  };

  const trackDownloadAndReturnURL = async (assetResult: AssetResult) => {
    if (assetResult.meta?.uri) {
      const trackDownloadResponse = await unsplash.photos.trackDownload({
        downloadLocation: assetResult.meta.uri
      });

      if (trackDownloadResponse.type === 'error') {
        throw new Error(trackDownloadResponse.errors.join('. '));
      }
      return trackDownloadResponse.response?.url;
    } else {
      throw new Error(
        `Cannot download without valid URI for asset ${assetResult.id}`
      );
    }
  };

  return UnsplashSource;
}

interface UnsplashImage {
  id: string;
  urls: {
    full: string;
    raw: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  height: number;
  width: number;
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  user?: {
    name?: string;
    links?: {
      html?: string;
    };
  };
}

function translateToAssetResult(image: UnsplashImage): AssetResult {
  const artistName = image?.user?.name;
  const artistUrl = image?.user?.links?.html;

  return {
    id: image.id,

    locale: 'en',
    label: image.description ?? image.alt_description ?? undefined,

    // @ts-ignore
    tags: image.tags ? image.tags.map((tag) => tag.title) : undefined,

    meta: {
      uri: image.links.download_location,
      thumbUri: image.urls.thumb,
      blockType: '//ly.img.ubq/graphic',
      kind: 'image',
      fillType: '//ly.img.ubq/fill/image',
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

export default createUnsplashSource;
