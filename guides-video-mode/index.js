import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.0/index.js';

window.onload = async () => {
  const config = {
    // license: import.meta.env.VITE_CESDK_LICENSE,
    userId: 'guides-user',
    theme: 'light',
    // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.0/assets',
    ui: {
      elements: {
        navigation: {
          position: 'top'
        }
      }
    }
  };

  const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);

  // Enable settings panel
  cesdk.feature.enable('ly.img.settings');

  // Set the editor view mode
  cesdk.ui.setView('default');

  // Configure navigation bar actions using the new API
  cesdk.ui.insertNavigationBarOrderComponent('last', {
    id: 'ly.img.actions.navigationBar',
    children: [
      'ly.img.saveScene.navigationBar',
      'ly.img.importScene.navigationBar',
      'ly.img.exportScene.navigationBar',
      'ly.img.exportVideo.navigationBar'
    ]
  });

  cesdk.addDefaultAssetSources();
  cesdk.addDemoAssetSources({
    sceneMode: 'Video',
    withUploadAssetSources: true
  });
  cesdk.ui.setBackgroundTrackAssetLibraryEntries([
    'ly.img.image',
    'ly.img.video'
  ]);
  const scene = await cesdk.createVideoScene();
};
