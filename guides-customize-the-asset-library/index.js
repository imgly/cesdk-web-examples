import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.17.0/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.17.0/assets',
  // highlight-i18n-label
  i18n: {
    en: {
      'libraries.empty-custom-asset-source.label': 'Empty'
    }
  },
  // highlight-i18n-label
  ui: {
    elements: {
      libraries: {
        // highlight-custom-replace-entries
        replace: {
          entries: (defaultEntries, context) => {
            if (context.selectedBlocks.length !== 1) {
              return [];
            }

            const [selectedBlock] = context.selectedBlocks;
            if (selectedBlock.blockType === 'ly.img.image') {
              return [
                ...defaultEntries,
                {
                  id: 'empty-custom-asset-source-for-replace',
                  sourceIds: ['emptySource'],
                  previewLength: 3,
                  gridColumns: 3,
                  gridItemHeight: 'square'
                }
              ];
            }

            return [];
          }
        },
        // highlight-custom-replace-entries
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
                gridBackgroundType: 'contain',
                icon: ({ theme, iconSize }) => {
                  if (theme === 'dark') {
                    if (iconSize === 'normal') {
                      return 'https://img.ly/static/cesdk/guides/icon-normal-dark.svg';
                    } else {
                      return 'https://img.ly/static/cesdk/guides/icon-large-dark.svg';
                    }
                  }

                  if (iconSize === 'normal') {
                    return 'https://img.ly/static/cesdk/guides/icon-normal-light.svg';
                  } else {
                    return 'https://img.ly/static/cesdk/guides/icon-large-light.svg';
                  }
                }
              },
              // highlight-custom-entry
              {
                id: 'custom-images',
                sourceIds: ['ly.img.image'],
                previewLength: 5,
                gridColumns: 5,
                icon: 'https://img.ly/static/cesdk/guides/icon-normal-dark.svg'
              }
            ];
          }
        }
      }
    }
  },
  callbacks: { onUpload: 'local' } // Enable local uploads in Asset Library.
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Do something with the instance of CreativeEditor SDK, for example:
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });

  instance.engine.asset.addSource({
    id: 'emptySource',
    findAssets: () => {
      return Promise.resolve({
        assets: [],
        total: 0,
        currentPage: 1,
        nextPage: undefined
      });
    }
  });

  await instance.createDesignScene();
});
