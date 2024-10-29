import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.38.0/index.js';

// highlight-config
const config = {
  // highlight-license
  license: 'YOUR_API_KEY',
  // highlight-license
  // highlight-userid
  userId: 'USER_ID',
  // highlight-userid
  // highlight-baseurl
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.38.0/assets',
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

  // highlight-onRoleChanged
  instance.engine.editor.onRoleChanged((role) => {
    if (role === 'Adopter') {
      // Enable the filter tab in the appearance panel when previewing the
      // design in the Adopter role.
      instance.engine.editor.setGlobalScope('appearance/filter', 'Allow');
    }
  });
  // highlight-onRoleChanged

  await instance.createDesignScene();
});
