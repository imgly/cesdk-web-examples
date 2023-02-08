import { AssetQueryData, AssetResult } from '@cesdk/cesdk-js';
import words from 'lodash/words';

export function filterAssets(assets: AssetResult[], queryData: AssetQueryData) {
  const { query } = queryData;

  if (!query) {
    return assets;
  }

  const queryTokens = words(query.toLowerCase());

  return query
    ? assets.filter((asset) => {
        if (asset.label || asset.tags) {
          const stringToSearch = [asset.label || '', asset.tags || '']
            .join(',')
            .toLowerCase();

          return queryTokens.every((queryToken) => {
            return stringToSearch.match(queryToken);
          });
        }
        if (asset.id) {
          const stringToSearch = asset.id.toLowerCase();
          return queryTokens.every((queryToken) => {
            return stringToSearch.match(queryToken);
          });
        }

        return true;
      })
    : assets;
}

export function sliceAssets(
  assets: AssetResult[],
  { page, perPage }: AssetQueryData
) {
  const pageOffset = (page ?? 0) * perPage;

  return assets.slice(pageOffset, pageOffset + perPage);
}

export function paginateAssetResult(
  array: AssetResult[],
  { page, perPage } = {
    page: 1,
    perPage: 10
  }
) {
  const pageOffset = (page ?? 0) * perPage;
  const assetsInCurrentPage = array.slice(pageOffset, pageOffset + perPage);
  const total = array.length;
  const currentPage = page;

  const totalFetched = page * perPage + assetsInCurrentPage.length;
  const nextPage = totalFetched < total ? currentPage + 1 : undefined;

  return {
    assets: assetsInCurrentPage,

    total,
    currentPage,
    nextPage
  };
}

export function applyQuerySearch(
  assets: AssetResult[],
  querySearch: AssetQueryData['query']
) {
  return querySearch
    ? assets.filter((asset) => {
        return (asset.label || '')
          .toLowerCase()
          .includes(querySearch.toLowerCase());
      })
    : assets;
}
