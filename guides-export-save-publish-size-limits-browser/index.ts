import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  userId: 'guides-user'
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Expose cesdk for debugging and hero screenshot generation
    (window as any).cesdk = cesdk;

    await cesdk.addPlugin(new Example());
  })
  .catch((error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
