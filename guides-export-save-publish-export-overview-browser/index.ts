import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const container = document.getElementById('cesdk') as HTMLDivElement;

CreativeEditorSDK.create(container, {
  // license: 'YOUR_CESDK_LICENSE_KEY',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  }),
  callbacks: {
    onUpload: 'local'
  }
}).then(async (cesdk) => {
  // Expose for hero image capture
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).cesdk = cesdk;

  // Initialize the example plugin
  await cesdk.addPlugin(new Example());
});
