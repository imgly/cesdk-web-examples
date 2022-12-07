import * as unsplash from 'unsplash-js';

// We use the official javascript client to communicate with unsplash https://github.com/unsplash/unsplash-js
// Additionally, we are using a custom proxy as to not expose our api key in the frontend.
// Read more about that here: https://github.com/unsplash/unsplash-js#creating-an-instance

let UNSPLASH_API_URL = ''; // INSERT YOUR UNSPLASH PROXY URL HERE


const unsplashApi = unsplash.createApi({
  apiUrl: UNSPLASH_API_URL
});

const UNSPLASH_SIZE_TO_USE = 'regular'; // Other values include "full"

export const findUnsplashAssets = async (queryData) => {
  if (UNSPLASH_API_URL === '' && !window.unsplashWarning) {
    window.unsplashWarning = true;
    alert(`Please provide your unsplash proxy api url enable stock images.`);
    return {
      assets: [],
      total: 0,
      currentPage: 0
    };
  }

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

function translateToAssetResult(image) {
  const artistName = image?.user?.name;
  const artistUrl = image?.user?.links?.html;

  return {
    id: image.id,
    locale: 'en',
    label: image.description ?? image.alt_description ?? undefined,
    tags: image.tags ? image.tags.map((tag) => tag.title) : undefined,

    thumbUri: image.urls.thumb,

    size: {
      width: image.width,
      height: image.height
    },

    meta: {
      blockType: 'ly.img.image',
      uri: image.urls[UNSPLASH_SIZE_TO_USE]
    },

    context: {
      sourceId: 'Unsplash'
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
