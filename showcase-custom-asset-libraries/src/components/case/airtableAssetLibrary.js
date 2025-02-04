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


let base;
if (AIRTABLE_API_KEY !== '') {
  base = new Airtable({
    apiKey: AIRTABLE_API_KEY
  }).base('appHAZoD6Qj3teOmr');
}

export const queryAirtable = ({ query, page, perPage }) => {
  let records = [];
  return new Promise(function (resolve, reject) {
    base('Asset sources')
      .select({
        maxRecords: perPage || 100,
        view: 'Grid view',
        // Poor mans search via airtable formula
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
        'custom-asset-libraries',
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
    // TODO: Check why labels do not work
    // label: image.name ?? undefined,
    meta: {
      width: image.width,
      height: image.height,
      thumbUri: image.thumbnails.large.url,
      blockType: '//ly.img.ubq/image',
      uri: image.url
    },

    context: {
      sourceId: 'Airtable'
    }
  };
  return asset;
}
