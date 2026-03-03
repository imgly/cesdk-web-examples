import CreativeEditorSDK from '@cesdk/cesdk-js';
import registerNewComponentPlugin from './browser';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  })
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    // Expose cesdk for debugging and hero image capture
    (window as any).cesdk = cesdk;

    // Add the register new component plugin
    cesdk.addPlugin(registerNewComponentPlugin);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
