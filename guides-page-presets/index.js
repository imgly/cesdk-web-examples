import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.0/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.0/assets',
  userId: 'guides-user',
  ui: {
    stylesheets: {
      /* ... */
    },
    elements: {
      /* ... */
    }
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Do something with the instance of CreativeEditor SDK
  // Set scale using the new API
  instance.ui.setScale('normal');
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true
  });

  // Add a custom page preset asset source.
  instance.engine.asset.addLocalSource('my-custom-formats');
  instance.engine.asset.addAssetToSource(
    'my-custom-formats',
    {
      id: 'din-a1-portrait',
      label: {
        en: 'DIN A1 Portrait'
      },
      meta: {
        width: 80,
        height: 120,
        thumbUri: `${window.location.protocol}//${window.location.host}/din-a1-portrait.png`
      },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 594,
          height: 841,
          designUnit: 'Millimeter'
        }
      }
    }
  );

  // Update page presets library entry
  instance.ui.updateAssetLibraryEntry('ly.img.pagePresets', {
    sourceIds: [
      // 'ly.img.page.presets',
      // 'ly.img.page.presets.video',
      'my-custom-formats'
    ]
  });

  await instance.createDesignScene();
});
