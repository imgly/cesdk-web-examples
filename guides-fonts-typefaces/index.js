import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.44.0-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.44.0-rc.1/assets',
  theme: 'light',
  ui: {
    typefaceLibraries: [
      // 'ly.img.typeface',
      'my-custom-typefaces'
    ]
  },
  presets: {
    callbacks: { onUpload: 'local' } // Enable local uploads in Asset Library.
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Do something with the instance of CreativeEditor SDK, for example:
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });

  // Add a custom typeface asset source.
  instance.engine.asset.addLocalSource('my-custom-typefaces');
  instance.engine.asset.addAssetToSource('my-custom-typefaces', {
    id: 'orbitron',
    label: {
      en: 'Orbitron'
    },
    payload: {
      typeface: {
        name: 'Orbitron',
        fonts: [
          {
            uri: `${window.location.protocol}//${window.location.host}/Orbitron-Regular.ttf`,
            subFamily: 'Regular',
            weight: 'regular',
            style: 'normal'
          },
          {
            uri: `${window.location.protocol}//${window.location.host}/Orbitron-Bold.ttf`,
            subFamily: 'Bold',
            weight: 'bold',
            style: 'normal'
          }
        ]
      }
    }
  });

  await instance.createDesignScene();
});
