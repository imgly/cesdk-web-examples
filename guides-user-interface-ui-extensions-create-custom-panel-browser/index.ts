import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  userId: 'guides-user'
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    // Expose cesdk for debugging and hero image capture
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).cesdk = cesdk;

    // Load the example plugin
    await cesdk.addPlugin(new Example());
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
