import CreativeEditorSDK from '@cesdk/cesdk-js';
import BlurPlugin from './browser';

const config = {
  // license: 'YOUR_LICENSE_KEY',
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Expose cesdk for debugging
    (window as any).cesdk = cesdk;

    // Load the blur plugin
    await cesdk.addPlugin(new BlurPlugin());
  })
  .catch((error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
