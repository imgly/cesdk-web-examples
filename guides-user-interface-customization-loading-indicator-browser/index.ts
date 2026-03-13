import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const customSpinner = `
<svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes custom-ep-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .custom-ep-spinner {
      transform-origin: 50px 50px;
      animation: custom-ep-spin 1s linear infinite;
    }
  </style>
  <symbol id="@imgly/EditorProgress" viewBox="0 0 100 100" width="192" height="192">
    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor"
      stroke-width="4" stroke-opacity="0.3" />
    <path class="custom-ep-spinner" d="M50 20 A30 30 0 0 1 80 50" fill="none"
      stroke="currentColor" stroke-width="4" stroke-linecap="round" />
  </symbol>
</svg>
`;
CreativeEditorSDK.ui.addIconSet('custom-loading-spinner', customSpinner);

CreativeEditorSDK.i18n.setTranslations({
  en: {
    'loading.heading': 'Welcome',
    'loading.text': 'Preparing your editor...'
  },
  de: {
    'loading.heading': 'Willkommen',
    'loading.text': 'Editor wird vorbereitet...'
  }
});

CreativeEditorSDK.ui.setComponentOrder({ in: 'ly.img.loading' }, [
  'ly.img.loading.spinner',
  { id: 'ly.img.loading.heading', content: 'loading.heading' },
  { id: 'ly.img.loading.text', content: 'loading.text' }
]);

// To show only text without a spinner, omit the spinner:
// CreativeEditorSDK.ui.setComponentOrder({ in: 'ly.img.loading' }, [
//   { id: 'ly.img.loading.heading', content: 'Loading' },
//   { id: 'ly.img.loading.text', content: 'Please wait...' }
// ]);

// Apply theme from URL query param (used by hero image capture script)
const theme = new URLSearchParams(window.location.search).get('theme');
if (theme === 'dark' || theme === 'light') {
  CreativeEditorSDK.ui.setTheme(theme);
}

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
    // Expose cesdk for debugging and hero screenshot generation
    (window as any).cesdk = cesdk;

    // Load the example plugin
    await cesdk.addPlugin(new Example());
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
