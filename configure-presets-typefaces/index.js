import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.22.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.22.0/assets',
  theme: 'light',
  // highlight-remove-default-typefaces
  extensions: {
    baseURL: '/extensions/',
    // This will remove our default typefaces from the editor
    entries: []
  },
  // highlight-remove-default-typefaces
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
