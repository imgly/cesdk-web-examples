import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.55.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.55.0/assets',
  userId: 'guides-user',
  ui: {
    scale: 'normal',
    stylesheets: {
      /* ... */
    },
    elements: {
      /* ... */
    },
    pagePresetLibraries: [
      // 'ly.img.page.presets',
      // 'ly.img.page.presets.video',
      'my-custom-formats'
    ]
  },
  callbacks: { onUpload: 'local' } // Enable local uploads in Asset Library.
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Do something with the instance of CreativeEditor SDK
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });

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

  await instance.createDesignScene();
});
