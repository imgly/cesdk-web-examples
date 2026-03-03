import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  })
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    // Expose cesdk for debugging and hero image capture
    (window as any).cesdk = cesdk;

    // Load the example plugin
    await cesdk.addPlugin(new Example());
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
