import STICKERS from './stickers.json';

export const findCustomStickerAssets = async (queryData) => {
  const results = Object.entries(STICKERS)
    .filter(
      ([groupName]) =>
        queryData.groups.length === 0 || queryData.groups.includes(groupName)
    )
    .flatMap(([_groupName, stickerUrls]) => stickerUrls)
    .map((stickerUrl) => ({
      url: stickerUrl
    }));
  const assetSourceResult = {
    assets: results.map(translateToAssetResult),
    total: results.length,
    currentPage: 1,
    nextPage: undefined
  };
  return assetSourceResult;
};

function translateToAssetResult({ url }) {
  const fileName = getFileName(url);
  return {
    id: fileName,
    locale: 'en',
    label: fileName,

    meta: {
      uri: url,
      thumbUri: url,
      blockType: '//ly.img.ubq/image',
      width: 100,
      height: 100  
    },

    context: {
      sourceId: 'stickers'
    }
  };
}

function getFileName(url) {
  return url.split('/').pop().split('.')[0];
}
