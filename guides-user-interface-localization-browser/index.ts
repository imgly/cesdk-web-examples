import CreativeEditorSDK from '@cesdk/cesdk-js';
import LocalizationExample from './browser';

const config = {
  // license: (import.meta as any).env?.VITE_CESDK_LICENSE,
  userId: 'guides-user'
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // CRITICAL: Expose cesdk to window for hero screenshot generation
    // The scripts/capture-hero.mjs script relies on window.cesdk to set themes
    (window as any).cesdk = cesdk;

    // Instantiate and load the localization example plugin
    await cesdk.addPlugin(new LocalizationExample());
  })
  .catch((error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
