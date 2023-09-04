import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.16.0-rc.0/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.16.0-rc.0/assets',
  theme: 'light',
  presets: {
    // highlight-typefaces
    typefaces: {
      orbitron: {
        // highlight-family
        family: 'Orbitron',
        // highlight-family
        // highlight-fonts
        fonts: [
          {
            // highlight-fontURL
            fontURL: `${window.location.protocol}//${window.location.host}/Orbitron-Regular.ttf`,
            // highlight-fontURL
            // highlight-weight
            weight: 'regular',
            // highlight-weight
            // highlight-style
            style: 'normal'
            // highlight-style
          },
          {
            fontURL: `${window.location.protocol}//${window.location.host}/Orbitron-Bold.ttf`,
            weight: 'bold',
            style: 'normal'
          }
        ]
        // highlight-fonts
      }
    },
    // highlight-typefaces
    callbacks: { onUpload: 'local' } // Enable local uploads in Asset Library.
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Do something with the instance of CreativeEditor SDK, for example:
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });
  await instance.createDesignScene();
});
