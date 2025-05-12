import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.51.0-rc.2/index.js';

const config = {
  license: 'YOUR_API_KEY',
  userId: 'USER_ID',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.51.0-rc.2/assets',
  locale: 'en', // 'de'
  theme: 'light', // 'dark'
  role: 'Creator', // 'Adopter' 'Viewer'
  callbacks: { onUpload: 'local' }, // Enable local uploads in Asset Library.
  logger: (message, logLevel) => {
    console.log(`${logLevel}: ${message}}`);
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });

  instance.engine.editor.onRoleChanged((role) => {
    if (role === 'Adopter') {
      // Enable the filter tab in the appearance panel when previewing the
      // design in the Adopter role.
      instance.engine.editor.setGlobalScope('appearance/filter', 'Allow');
    }
  });

  await instance.createDesignScene();
});
