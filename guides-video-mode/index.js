import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.60.0-rc.1/index.js';

window.onload = async () => {
  const config = {
    license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
    userId: 'guides-user',
    theme: 'light',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.60.0-rc.1/assets',
    ui: {
      elements: {
        view: 'default',
        panels: {
          settings: true
        },
        navigation: {
          position: 'top'
        }
      }
    }
  };

  const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);

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
  cesdk.addDemoAssetSources({ sceneMode: 'Video', withUploadAssetSources: true });
  cesdk.ui.setBackgroundTrackAssetLibraryEntries([
    'ly.img.image',
    'ly.img.video'
  ]);
  const scene = await cesdk.createVideoScene();
};
