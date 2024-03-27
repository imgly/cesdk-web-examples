import Airtable from 'airtable';

// This custom asset library demonstrates how to use an arbitrary API as asset source.
// Airtable is a SaaS product that provides extensible spreadsheets.
// We use their javascript library https://github.com/Airtable/airtable.js
// to query a sample spreadsheet and display the images in the spreadsheet
// in our asset library.

// Insert a readonly api key:
// See: https://support.airtab∏le.com/hc/en-us/articles/360056249614-Creating-a-read-only-API-key
let AIRTABLE_API_KEY = '';
const AIRTABLE_DATABASE_ID = 'appHAZoD6Qj3teOmr';


let base;
if (AIRTABLE_API_KEY !== '') {
  base = new Airtable({
    apiKey: AIRTABLE_API_KEY
  }).base(AIRTABLE_DATABASE_ID);
}

export const queryAirtable = ({ query, perPage }) => {
  let records = [];
  return new Promise(function (resolve) {
    base('Asset sources')
      .select({
        maxRecords: perPage || 100,
        view: 'Grid view',
        // A simple search formula that searches for the query in the Name field
        filterByFormula: query
          ? "AND({Name} != '', SEARCH(LOWER('" + query + "'), LOWER({Name})))"
          : "{Name} != ''"
      })
      .eachPage(
        function page(pageRecords, fetchNextPage) {
          pageRecords.forEach(function (record) {
            const asset = {
              name: record.get('Name'),
              image: record.get('Image')[0]
            };
            records = [...records, asset];
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          resolve({ results: records });
        }
      );
  });
};

export const findAirtableAssets = async (queryData) => {
  if (AIRTABLE_API_KEY === '' && !window.airtableWarning) {
    window.airtableWarning = true;
    alert(`Please provide your airtable api key.`);
    return;
  }

  const response = await queryAirtable({
    query: queryData.query,
    page: queryData.page,
    perPage: queryData.perPage
  });
  const { results } = response;

  return {
    assets: results.map(translateToAssetResult),
    // Airtable does not return a total number of assets.
    // With a high number we force the button to display 'more'
    total: 99999,
    currentPage: 1,
    nextPage: undefined
  };
};
function translateToAssetResult({ image }) {
  /** @type {import('@cesdk/cesdk-js').AssetDefinition} */
  const asset = {
    id: image.id,
    meta: {
      width: image.width,
      height: image.height,
      thumbUri: image.thumbnails.large.url,
      mimeType: 'image/jpeg',
      uri: image.url
    }
  };
  return asset;
}
export const airtableAssetLibrary = {
  id: 'airtable',
  findAssets: findAirtableAssets,
  credits: {
    name: 'Airtable',
    url: 'https://airtable.com/shr4x8s9jqaxiJxm5/tblSLR9GBwiVwFS8z?backgroundColor=orange'
  }
};
