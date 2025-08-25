import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.59.0-rc.0/index.js';

const config = {
  license: 'YOUR_API_KEY',
  userId: 'USER_ID',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.59.0-rc.0/assets',
  theme: 'light', // 'dark'
  role: 'Creator', // 'Adopter' 'Viewer'
  callbacks: { onUpload: 'local' }, // Enable local uploads in Asset Library.
  logger: (message, logLevel) => {
    console.log(`${logLevel}: ${message}}`);
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Set locale after instance creation
  instance.i18n.setLocale('en'); // 'de'
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

