import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.62.1/index.js';

const config = {
  license: 'YOUR_API_KEY',
  userId: 'USER_ID',
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.62.1/assets',
  role: 'Creator', // 'Adopter' 'Viewer'
  logger: (message, logLevel) => {
    console.log(`${logLevel}: ${message}}`);
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Set theme after instance creation
  instance.ui.setTheme('light'); // 'dark' or 'system'
  // Set locale after instance creation
  instance.i18n.setLocale('en'); // 'de'

  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true
  });

  instance.engine.editor.onRoleChanged((role) => {
    if (role === 'Adopter') {
      // Enable the filter tab in the appearance panel when previewing the
      // design in the Adopter role.
      instance.engine.editor.setGlobalScope('appearance/filter', 'Allow');
    }
  });

  await instance.createDesignScene();
});
