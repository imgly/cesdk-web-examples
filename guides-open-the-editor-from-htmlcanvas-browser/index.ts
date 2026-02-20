import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  // license: (import.meta as any).env?.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  })
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // CRITICAL: Expose cesdk to window for hero screenshot generation
    // The scripts/capture-hero.mjs script relies on window.cesdk to set themes
    (window as any).cesdk = cesdk;

    // Instantiate and load the example plugin
    await cesdk.addPlugin(new Example());
  })
  .catch((error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
