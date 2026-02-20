import CreativeEditorSDK from '@cesdk/cesdk-js';
import BlurPlugin from './browser';

const container = document.getElementById('cesdk_container')!;

const config = {
  // license: 'YOUR_LICENSE_KEY',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  }),
  callbacks: {
    onUpload: 'local'
  }
};

CreativeEditorSDK.create(container, config)
  .then(async (cesdk) => {
    // Expose cesdk for debugging
    (window as any).cesdk = cesdk;

    // Load the blur plugin
    await cesdk.addPlugin(new BlurPlugin());
  })
  .catch((error) => {
    console.error('Failed to initialize CE.SDK:', error);
  });
