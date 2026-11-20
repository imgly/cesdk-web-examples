import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  userId: 'guides-user',
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    await cesdk.addPlugin(new Example());

    // Exposed after the plugin, so the hero screenshot shows the imported file.
    (window as any).cesdk = cesdk;
  })
  .catch((error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
