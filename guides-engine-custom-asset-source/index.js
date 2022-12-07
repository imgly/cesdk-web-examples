import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.9.0/index.js';

import * as unsplash from './vendor/unsplash-js.esm.js';

// highlight-unsplash-api-creation
const unsplashApi = unsplash.createApi({
  apiUrl: '...'
});
// highlight-unsplash-api-creation

const EMPTY_RESULT = {
  assets: [],
  total: 0,
  currentPage: 0,
  nextPage: undefined
};

// highlight-unsplash-findAssets
const findUnsplashAssets = async (queryData) => {
  /* Unsplash page indices are 1-based. */
  const unsplashPage = queryData.page + 1;

  if (queryData.query) {
    // highlight-unsplash-query
    const response = await unsplashApi.search.getPhotos({
      query: queryData.query,
      page: unsplashPage,
      perPage: queryData.perPage
    });
    // highlight-unsplash-query
    if (response.type === 'success') {
      // highlight-unsplash-result-mapping
      const { results, total, total_pages } = response.response;

      return {
        assets: await Promise.all(results.map(translateToAssetResult)),

        total,
        currentPage: queryData.page,
        nextPage:
          queryData.page + 1 < total_pages ? queryData.page + 1 : undefined
      };
      // highlight-unsplash-result-mapping
    } else if (response.type === 'error') {
      // highlight-unsplash-error
      throw new Error(response.errors.join('. '));
    } else {
      // highlight-unsplash-empty-fallback
      return Promise.resolve(EMPTY_RESULT);
    }
  } else {
    // highlight-unsplash-list
    const response = await unsplashApi.photos.list({
      orderBy: 'popular',
      page: unsplashPage,
      perPage: queryData.perPage
    });

    if (response.type === 'success') {
      const { results, total } = response.response;
      const totalFetched = queryData.page * queryData.perPage + results.length;

      const nextPage = totalFetched < total ? queryData.page + 1 : undefined;

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
    // highlight-unsplash-list
  }
};

const getUnsplashUrl = async (unsplashResult) => {
  const trackDownloadResponse = await unsplashApi.photos.trackDownload({
    downloadLocation: unsplashResult.links.download_location
  });

  if (trackDownloadResponse.type === 'error') {
    throw new Error(trackDownloadResponse.errors.join('. '));
  }
  return trackDownloadResponse.response?.url;
};

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.9.0/assets'
};

CreativeEngine.init(config, document.getElementById('cesdk_canvas')).then(async (instance) => {
  const scene = instance.scene.create();
  const page = instance.block.create('page');
  instance.block.appendChild(scene, page);
  instance.scene.zoomToBlock(page);

  // highlight-unsplash-definition
  const customSource = {
    id: 'unsplash',
    findAssets: findUnsplashAssets,
    // highlight-unsplash-credits-license
    credits: {
      name: 'Unsplash',
      url: 'https://unsplash.com/'
    },
    license: {
      name: 'Unsplash license (free)',
      url: 'https://unsplash.com/license'
    }
    // highlight-unsplash-credits-license
  };
  // highlight-unsplash-definition

  instance.asset.addSource(customSource);

  const result = await instance.asset.findAssets(customSource.id, {page: 0, perPage: 3});
  const asset = result.assets[0];

  await instance.asset.apply(customSource.id, asset);
});

// highlight-translateToAssetResult
async function translateToAssetResult(image) {
  const artistName = image?.user?.name;
  const artistUrl = image?.user?.links?.html;

  return {
    // highlight-result-id
    id: image.id,
    // highlight-result-locale
    locale: 'en',
    //
    // highlight-result-label
    label: image.description ?? image.alt_description ?? undefined,
    // highlight-result-tags
    tags: image.tags ? image.tags.map((tag) => tag.title) : undefined,

    // highlight-result-thumbUri
    thumbUri: image.urls.thumb,

    // highlight-result-size
    size: {
      width: image.width,
      height: image.height
    },
    // highlight-result-size

    // highlight-result-uri
    meta: {
      uri: await getUnsplashUrl(image),
      blockType: 'ly.img.image'
    },
    // highlight-result-uri

    // highlight-result-context
    context: {
      sourceId: 'unsplash'
    },
    // highlight-result-context

    // highlight-result-credits
    credits: artistName
      ? {
          name: artistName,
          url: artistUrl
        }
      : undefined,
    // highlight-result-credits

    // highlight-result-utm
    utm: {
      source: 'CE.SDK Demo',
      medium: 'referral'
    }
    // highlight-result-utm
  };
}
