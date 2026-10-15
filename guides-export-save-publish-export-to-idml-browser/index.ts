import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

declare global {
  interface Window {
    cesdk?: CreativeEditorSDK;
  }
}

CreativeEditorSDK.create('#cesdk_container', {
  userId: 'guides-user',
})
  .then(async (cesdk) => {
    await cesdk.addPlugin(new Example());
    window.cesdk = cesdk;
  })
  .catch((error) => {
    console.error('Failed to initialize CE.SDK:', error);
    const container = document.getElementById('cesdk_container');
    if (container) {
      container.setAttribute('role', 'alert');
      container.textContent =
        'The editor could not load. Please reload the page to try again.';
    }
  });
