import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  // License key removes watermarks from exports
  // Get a free trial at https://img.ly/forms/free-trial
  // license: 'YOUR_CESDK_LICENSE_KEY',

  // User ID for accurate MAU tracking across devices
  userId: 'guides-user',

  // Custom logger for debugging and monitoring
  logger: (message: string, level?: string) => {
    console.log(`[CE.SDK ${level ?? 'Info'}] ${message}`);
  },

  // Enable developer mode for diagnostics
  devMode: false,

  // Accessibility settings
  a11y: {
    headingsHierarchyStart: 1 as const
  },

  // Location of core engine assets (WASM, data files)
  // Default: IMG.LY CDN. For production, host assets yourself.
  // baseURL: 'https://your-cdn.com/cesdk-assets/',

  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk: CreativeEditorSDK) => {

    // Expose cesdk for debugging and hero screenshot generation
    (window as any).cesdk = cesdk;

    // Load the example plugin
    await cesdk.addPlugin(new Example());
  })
  .catch((error: Error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
