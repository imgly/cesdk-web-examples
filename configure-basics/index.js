import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.18.1/cesdk.umd.js';

// highlight-config
const config = {
  // highlight-baseurl
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.18.1/assets',
  // highlight-baseurl
  // highlight-locale
  locale: 'en', // 'de'
  // highlight-locale
  // highlight-theme
  theme: 'light', // 'dark'
  // highlight-theme
  // highlight-role
  role: 'Creator', // 'Adopter' 'Viewer'
  // highlight-role
  callbacks: { onUpload: 'local' }, // Enable local uploads in Asset Library.
  // highlight-logger
  logger: (message, logLevel) => {
    console.log(`${logLevel}: ${message}}`);
  }
  // highlight-logger
};
// highlight-config

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });
  await instance.createDesignScene();
});
