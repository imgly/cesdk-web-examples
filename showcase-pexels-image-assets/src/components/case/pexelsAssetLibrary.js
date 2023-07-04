import { createPexelsApi } from './pexelsApiWrapper';

let PEXELS_API_KEY = ''; // INSERT YOUR PEXELS API KEY HERE


const PexelsApi = createPexelsApi(PEXELS_API_KEY);

export async function findPexelsAssets(queryData) {
  if (PEXELS_API_KEY === '' && !window.pexelsWarning) {
    window.pexelsWarning = true;
    alert(`Please provide your Pexels api key.`);
  }
  if (queryData.query) {
    return await getSearchResults(queryData);
  } else {
    return await getCuratedPhotos(queryData);
  }
}

function formatResponse(response) {
  const total = response.total_results;
  const results = response.photos;
  const assets = results.map((image) => translateToAssetResult(image));
  const nextPage = results.length > 0 ? (response.page ?? 0) + 1 : undefined;
  const formattedResponse = {
    assets,
    total,
    nextPage,
    currentPage: response.page ?? 0
  };
  return formattedResponse;
}

async function getCuratedPhotos(queryData) {
  const page = queryData.page > 0 ? queryData.page : undefined;
  const response = await PexelsApi.photos.curated({
    page: page,
    per_page: queryData.perPage
  });
  if (response.status === 200) {
    return formatResponse(response.data);
  } else {
    const error = new Error(`Received a response with code 
            ${response.status} when trying to access pexels`);
    console.error(error);
    throw error;
  }
}

async function getSearchResults(queryData) {
  const page = queryData.page > 0 ? queryData.page : undefined;
  const response = await PexelsApi.photos.search({
    query: queryData.query,
    page: page,
    per_page: queryData.perPage
  });
  if (response.status === 200) {
    return formatResponse(response.data);
  } else {
    const error = new Error(`Received a response with code
            ${response.status} when trying to access pexels`);
    console.error(error);
    throw error;
  }
}

function translateToAssetResult(image) {
  const artistName = image.photographer;
  const artistUrl = image.photographer_url;
  const thumbUri = image.src.medium;
  const id = image.id.toString();
  // const label = !!image.alt ? image.alt : undefined;
  const credits = {
    name: artistName,
    url: artistUrl
  };

  return {
    id,
    locale: 'en',
    // TODO: Check why labels do not work
    // label: { 'en': label },
    meta: {
      thumbUri,
      width: image.width,
      height: image.height,
      blockType: '//ly.img.ubq/image',
      uri: image.src.original
    },
    context: {
      sourceId: 'pexels'
    },
    utm: {
      source: 'CE.SDK Demo',
      medium: 'referral'
    },
    credits
  };
}

export const pexelsAssetLibrary = {
  id: 'pexels',
  findAssets: findPexelsAssets,
  credits: {
    name: 'pexels',
    url: 'https://pexels.com/'
  },
  license: {
    name: 'Pexels license (free)',
    url: 'https://pexels.com/license'
  }
};
