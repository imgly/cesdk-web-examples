import Airtable from 'airtable';
import { buildGithubUrl } from 'lib/paths';

// This custom asset library demonstrates how to use an arbitrary API as asset source.
// Airtable is a SaaS product that provides extensible spreadsheets.
// We use their javascript library https://github.com/Airtable/airtable.js
// to query a sample spreadsheet and display the images in the spreadsheet
// in our asset library.

// Insert a readonly api key:
// See: https://support.airtable.com/hc/en-us/articles/360056249614-Creating-a-read-only-API-key
let AIRTABLE_API_KEY = '';
const AIRTABLE_DATABASE_ID = 'appHAZoD6Qj3teOmr';


let base;
if (AIRTABLE_API_KEY !== '') {
  base = new Airtable({
    apiKey: AIRTABLE_API_KEY
  }).base(AIRTABLE_DATABASE_ID);
}

export const queryAirtable = ({ query, page, perPage }) => {
  let records = [];
  return new Promise(function (resolve, reject) {
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
    alert(
      `Please provide your airtable api key. For more information see ${buildGithubUrl(
        'airtable-image-assets',
        'airtableAssetLibrary.js'
      )}.`
    );
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
      blockType: '//ly.img.ubq/image',
      uri: image.url
    },

    context: {
      sourceId: 'airtable'
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
