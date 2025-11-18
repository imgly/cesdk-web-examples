import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.64.0-rc.2/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.64.0-rc.2/assets',
  // docs-theming-theme
  ui: {
    // docs-theming-theme
    // docs-theming-generator
    elements: {}
    // docs-theming-generator
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Enable settings panel
  instance.feature.enable('ly.img.settings');

  // Do something with the instance of CreativeEditor SDK, for example:
  // Set theme and scale after initialization
  instance.ui.setTheme('light'); // 'light' or 'dark' or 'system'

  // Set scale dynamically based on viewport
  instance.ui.setScale(({ containerWidth, isTouch }) => {
    if (containerWidth < 600 || isTouch) {
      return 'large';
    } else {
      return 'normal';
    }
  }); // or simply 'normal' or 'large'

  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true
  });
  await instance.createDesignScene();
});
