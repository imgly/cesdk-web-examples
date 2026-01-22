import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const container = document.getElementById('cesdk_container') as HTMLDivElement;

CreativeEditorSDK.create(container, {
  // license: (import.meta as any).env?.VITE_CESDK_LICENSE,
  callbacks: {
    onUpload: 'local'
  }
}).then(async (cesdk) => {
  // Expose for hero image capture
  (window as any).cesdk = cesdk;

  // Initialize the example plugin
  await cesdk.addPlugin(new Example());
});
