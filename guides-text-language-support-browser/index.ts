import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  userId: 'guides-user',
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    // Expose cesdk for debugging
    (window as any).cesdk = cesdk;

    // Register local upload handler for development
    cesdk.actions.register('uploadFile', (file, onProgress, context) => {
      return cesdk.utils.localUpload(file, context);
    });

    // Load the example plugin
    await cesdk.addPlugin(new Example());
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
