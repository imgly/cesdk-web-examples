import CreativeEditorSDK from '@cesdk/cesdk-js';
import CustomFeaturePlugin from './browser';

const config = {
  // license: (import.meta as any).env?.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    // Required: Expose cesdk to window for hero screenshot generation
    // The scripts/capture-hero.mjs script relies on window.cesdk to set themes
    (window as any).cesdk = cesdk;

    // Add the plugin with configuration to show button in canvas menu
    await cesdk.addPlugin(
      CustomFeaturePlugin({
        ui: {
          locations: ['canvasMenu']
        }
      })
    );
  })
  .catch((error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
