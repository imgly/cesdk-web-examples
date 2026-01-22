import CreativeEditorSDK from '@cesdk/cesdk-js';
import CustomFontsExample from './browser';

const config = {
  // license: (import.meta as any).env?.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Required: Expose cesdk to window for hero screenshot generation
    (window as any).cesdk = cesdk;

    // Instantiate and load the custom fonts example plugin
    await cesdk.addPlugin(new CustomFontsExample());
  })
  .catch((error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
