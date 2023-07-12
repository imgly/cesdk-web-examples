import { buildGithubUrl } from 'lib/paths';

let GETTY_API_URL = ''; // INSERT YOUR GETTY PROXY URL HERE


export const findGettyAssets = async (queryData) => {
  if (GETTY_API_URL === '' && !window.gettyWarning) {
    window.gettyWarning = true;
    alert(
      `Please provide your Getty Images proxy api url. For more information see ${buildGithubUrl(
        'getty-images-image-assets',
        'gettyAssetLibrary.js'
      )}.`
    );
    return;
  }

  const page = queryData.page || 1;
  const response = await fetch(
    `${GETTY_API_URL}/?${new URLSearchParams({ ...queryData, page: page + 1 })}`
  );

  const data = await response.json();
  return data;
};

export const GETTY_IMAGES_IMAGE_ASSET_SOURCE_ID = 'gettyImagesImageAssets';

export const gettyImagesImageAssets = {
  id: GETTY_IMAGES_IMAGE_ASSET_SOURCE_ID,
  findAssets: findGettyAssets,
  credits: {
    name: 'Getty Images',
    url: 'https://www.gettyimages.com/'
  },
  license: {
    name: 'Getty Images Content License Agreement',
    url: 'https://www.gettyimages.com/eula'
  }
};
