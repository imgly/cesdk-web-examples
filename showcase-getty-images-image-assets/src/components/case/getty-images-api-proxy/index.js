// This file is part of the CESDK Web Examples showcase app.
// Load the .env file which includes the GETTY_IMAGES API Secrets into process.env
require('dotenv').config();
const GettyImagesApi = require('gettyimages-api');

// Configure your Getty Images API credentials
const apiKey = process.env.GETTY_IMAGES_API_KEY;
const apiSecret = process.env.GETTY_IMAGES_API_SECRET;

const gettyImagesClient = new GettyImagesApi({ apiKey, apiSecret });

// Google Cloud Function to proxy Getty Images requests
exports.gettyImagesProxy = async (req, res) => {
  setCorsHeaders(res);

  if (isPreflightRequest(req)) {
    handlePreflightRequest(res);
    return;
  }

  try {
    const { query, page, pageSize } = parseRequestParameters(req);
    const imagesResponse = await fetchImagesFromGettyImages(
      query,
      page,
      pageSize
    );
    const assetsQueryResult = formatAssetsQueryResult(
      imagesResponse,
      page,
      pageSize
    );

    res.status(200).json(assetsQueryResult);
  } catch (error) {
    console.error('Error fetching images from Getty Images API:', error);
    res.status(500).send('Failed to fetch images from Getty Images API');
  }
};

function setCorsHeaders(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
}

function isPreflightRequest(req) {
  return req.method === 'OPTIONS';
}

function handlePreflightRequest(res) {
  res.status(204).send('');
}

function parseRequestParameters(req) {
  const { query, page, pageSize } = req.query;
  return {
    query: query || 'Adventure',
    page: parseInt(page) || 1,
    pageSize: parseInt(pageSize) || 30
  };
}

async function fetchImagesFromGettyImages(query, page, pageSize) {
  return await gettyImagesClient
    .searchimages()
    .withResponseField('summary_set')
    .withResponseField('display_set')
    .withPhrase(query)
    .withPage(page)
    .withPageSize(pageSize)
    .execute();
}

function formatAssetsQueryResult(imagesResponse, page, pageSize) {
  return {
    assets: imagesResponse.images.map(formatAsset),
    currentPage: page,
    nextPage: calculateNextPage(page, pageSize, imagesResponse.result_count),
    total: imagesResponse.result_count
  };
}

function formatAsset(image) {
  return {
    id: image.id,
    meta: {
      mimeType: 'image/jpeg', // Assuming all images are JPEG
      uri: image.display_sizes.find(({ name }) => name === 'high_res_comp')
        ?.uri,
      thumbUri: image.display_sizes[0]?.uri, // Using the same URI as thumbUri (only one display size available)
      previewUri: image.display_sizes[0]?.uri, // Using the same URI as previewUri (only one display size available)
      filename: image.title,
      width: image.max_dimensions?.width,
      height: image.max_dimensions?.height
    },
    context: {
      sourceId: 'gettyImagesImageAssets'
    }
  };
}

function calculateNextPage(page, pageSize, resultCount) {
  const hasNextPage = page < Math.ceil(resultCount / pageSize);
  return hasNextPage ? page + 1 : undefined;
}
