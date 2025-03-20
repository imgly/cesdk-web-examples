import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.47.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.47.0/assets',
  i18n: {
    en: {
      'libraries.empty-custom-asset-source.label': 'Empty'
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

  instance.ui.addAssetLibraryEntry({
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
  });

  instance.ui.addAssetLibraryEntry({
    id: 'empty-custom-asset-source-for-replace',
    sourceIds: ['emptySource'],
    previewLength: 3,
    gridColumns: 3,
    gridItemHeight: 'square'
  });

  instance.ui.addAssetLibraryEntry({
    id: 'custom-images',
    sourceIds: ['ly.img.image'],
    previewLength: 5,
    gridColumns: 5,
    icon: 'https://img.ly/static/cesdk/guides/icon-normal-dark.svg'
  });

  instance.ui.updateAssetLibraryEntry('ly.img.image', {
    ...instance.ui.getAssetLibraryEntry('ly.img.image'),
    gridColumns: 4
  });

  instance.ui.setReplaceAssetLibraryEntries(
    ({ defaultEntryIds, selectedBlocks }) => {
      if (selectedBlocks.length !== 1) {
        return [];
      }
      const [selectedBlock] = selectedBlocks;
      if (selectedBlock.blockType === '//ly.img.ubq/graphic') {
        return [...defaultEntryIds, 'empty-custom-asset-source-for-replace'];
      }
      return [];
    }
  );

  instance.ui.setDockOrder([
    ...instance.ui.getDockOrder(),
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'empty-custom-asset-source',
      icon: '@imgly/CustomLibrary',
      label: 'libraries.empty-custom-asset-source.label',
      entries: ['empty-custom-asset-source']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'custom-images',
      icon: '@imgly/CustomLibrary',
      label: 'libraries.custom-images.label',
      entries: ['custom-images']
    }
  ]);

  await instance.createDesignScene();
});
