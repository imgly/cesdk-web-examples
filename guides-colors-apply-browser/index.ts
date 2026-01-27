import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  // license: 'YOUR_CESDK_LICENSE_KEY',
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: "/assets/",
  }),
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Required: Expose cesdk to window for hero screenshot generation
    (window as any).cesdk = cesdk;

    // Instantiate and load the example plugin
    await cesdk.addPlugin(new Example());
  })
  .catch((error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
