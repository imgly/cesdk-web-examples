import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.12.1-rc.0/cesdk.umd.js';

import * as unsplash from './vendor/unsplash-js.esm.js';

// highlight-unsplash-api-creation
const unsplashApi = unsplash.createApi({
  apiUrl: '...'
});
// highlight-unsplash-api-creation

// highlight-unsplash-findAssets
const findUnsplashAssets = async (queryData) => {
  // highlight-unsplash-findAssets
  if (queryData.query) {
    // highlight-unsplash-query
    const response = await unsplashApi.search.getPhotos({
      query: queryData.query,
      page: queryData.page,
      perPage: queryData.perPage
    });
    // highlight-unsplash-query
    if (response.type === 'success') {
      // highlight-unsplash-result-mapping
      const { results, total, total_pages } = response.response;

      return {
        assets: results.map(translateToAssetResult),

        total,
        currentPage: queryData.page,
        nextPage:
          queryData.page + 1 <= total_pages ? queryData.page + 1 : undefined
      };
      // highlight-unsplash-result-mapping
    } else if (response.type === 'error') {
      // highlight-unsplash-error
      throw new Error(response.errors[0]);
      // highlight-unsplash-error
    } else {
      // highlight-unsplash-empty-fallback
      return Promise.resolve(undefined);
      // highlight-unsplash-empty-fallback
    }
  } else {
    // highlight-unsplash-list
    const response = await unsplashApi.photos.list({
      orderBy: 'popular',
      page: queryData.page,
      perPage: queryData.perPage
    });

    if (response.type === 'success') {
      const { results, total } = response.response;
      const totalFetched =
        (queryData.page - 1) * queryData.perPage + results.length;

      const nextPage = totalFetched < total ? queryData.page + 1 : undefined;

      return {
        assets: results.map(translateToAssetResult),

        total,
        currentPage: queryData.page,
        nextPage
      };
    } else if (response.type === 'error') {
      throw new Error(response.errors[0]);
    } else {
      return Promise.resolve(undefined);
    }
    // highlight-unsplash-list
  }
};

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.12.1-rc.0/assets',
  assetSources: {
    // highlight-unsplash-definition
    unsplash: {
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
    }
    // highlight-unsplash-definition
  }
};

CreativeEditorSDK.init('#cesdk_container', config);

// highlight-translateToAssetResult
function translateToAssetResult(image) {
  // highlight-translateToAssetResult
  const artistName = image?.user?.name;
  const artistUrl = image?.user?.links?.html;

  return {
    // highlight-result-id
    id: image.id,
    // highlight-result-id
    // highlight-result-locale
    locale: 'en',
    // highlight-result-locale
    //
    // highlight-result-label
    label: image.description ?? image.alt_description ?? undefined,
    // highlight-result-label
    // highlight-result-tags
    tags: image.tags ? image.tags.map((tag) => tag.title) : undefined,
    // highlight-result-tags

    meta: {
      // highlight-result-uri
      uri: image.urls.full,
      // highlight-result-uri
      // highlight-result-thumbUri
      thumbUri: image.urls.thumb,
      // highlight-result-thumbUri
      // highlight-result-blockType
      blockTypes: '//ly.img.ubq/image',
      // highlight-result-blockType
      // highlight-result-size
      width: image.width,
      height: image.height
      // highlight-result-size
    },

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
