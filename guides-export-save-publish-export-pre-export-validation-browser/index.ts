import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  userId: 'guides-user',
  // license: import.meta.env.VITE_CESDK_LICENSE
  featureFlags: {
    exportWorker: true
  }
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk: CreativeEditorSDK) => {

    // Expose cesdk for debugging and hero screenshot generation
    (window as any).cesdk = cesdk;

    // Load the example plugin
    await cesdk.addPlugin(new Example());

    console.log('Pre-Export Validation example initialized');
  })
  .catch((error: Error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
