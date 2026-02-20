import CreativeEditorSDK from '@cesdk/cesdk-js';
import { initialize } from './browser';

const container = document.getElementById('cesdk-container') as HTMLDivElement;

CreativeEditorSDK.create(container, {
  // license: (import.meta as any).env?.VITE_CESDK_LICENSE,
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  })
}).then(async (cesdk) => {
  // Expose cesdk to window for hero screenshots
  (window as any).cesdk = cesdk;

  // Initialize the example
  await initialize(cesdk);
});
