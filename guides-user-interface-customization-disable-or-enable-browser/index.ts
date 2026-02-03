import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
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
