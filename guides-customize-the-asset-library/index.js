import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.7.0-alpha.5/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.7.0-alpha.5/assets',
  // highlight-i18n-label
  i18n: {
    en: {
      'libraries.empty-custom-asset-source.label': 'Empty'
    }
  },
  // highlight-i18n-label
  assetSources: {
    emptySource: {
      findAssets: () => {
        return Promise.resolve({
          assets: [],
          total: 0,
          currentPage: 1,
          nextPage: undefined
        });
      }
    }
  },
  ui: {
    elements: {
      libraries: {
        insert: {
          entries: (defaultEntries) => {
            // highlight-change-default-entries
            const imageEntry = defaultEntries.find((entry) => {
              return entry.id === 'ly.img.image';
            });

            if (imageEntry) {
              imageEntry.gridColumns = 4;
            }
            // highlight-change-default-entries

            return [
              ...defaultEntries,
              // highlight-custom-entry
              {
                id: 'empty-custom-asset-source',
                sourceIds: ['emptySource'],
                previewLength: 3,
                gridColumns: 3,
                gridItemHeight: 'square',

                previewBackgroundType: 'contain',
                gridBackgroundType: 'contain'
              },
              // highlight-custom-entry
              {
                id: 'custom-images',
                sourceIds: ['ly.img.image'],
                previewLength: 5,
                gridColumns: 5
              }
            ];
          }
        }
      }
    }
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
