import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.59.1-rc.0/index.js';

import * as unsplash from './vendor/unsplash-js.esm.js';

const unsplashApi = unsplash.createApi({
  apiUrl: '...'
});

const findUnsplashAssets = async (queryData) => {
  if (queryData.query) {
    const response = await unsplashApi.search.getPhotos({
      query: queryData.query,
      page: queryData.page,
      perPage: queryData.perPage
    });
    if (response.type === 'success') {
      const { results, total, total_pages } = response.response;

      return {
        assets: results.map(translateToAssetResult),

        total,
        currentPage: queryData.page,
        nextPage:
          queryData.page + 1 <= total_pages ? queryData.page + 1 : undefined
      };
    } else if (response.type === 'error') {
      throw new Error(response.errors[0]);
    } else {
      return Promise.resolve(undefined);
    }
  } else {
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
  }
};

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.59.1-rc.0/assets',
  assetSources: {
    unsplash: {
      findAssets: findUnsplashAssets,
      credits: {
        name: 'Unsplash',
        url: 'https://unsplash.com/'
      },
      license: {
        name: 'Unsplash license (free)',
        url: 'https://unsplash.com/license'
      }
    }
  }
};

async function initializeCESDK() {
  const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);
  await cesdk.createDesignScene();
}

initializeCESDK();

function translateToAssetResult(image) {
  const artistName = image?.user?.name;
  const artistUrl = image?.user?.links?.html;

  return {
    id: image.id,
    locale: 'en',
    //
    label: image.description ?? image.alt_description ?? undefined,
    tags: image.tags ? image.tags.map((tag) => tag.title) : undefined,

    meta: {
      uri: image.urls.full,
      thumbUri: image.urls.thumb,
      blockType: '//ly.img.ubq/graphic',
      fillType: '//ly.img.ubq/fill/image',
      width: image.width,
      height: image.height
    },

    context: {
      sourceId: 'unsplash'
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

