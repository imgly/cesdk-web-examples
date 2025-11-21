import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.64.0/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.64.0/assets'
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  instance.actions.register('onUnsupportedBrowser', () => {
    /* This is the default window alert which will be shown in case an unsupported
     * browser tries to run CE.SDK */
    window.alert(
      'Your current browser is not supported.\nPlease use one of the following:\n\n- Mozilla Firefox 115 or newer\n- Apple Safari 15.6 or newer\n- Microsoft Edge 114 or newer\n- Google Chrome 114 or newer'
    );
  });
  instance.actions.register('uploadFile', (_file, _onProgress) => {
    window.alert('Upload action!');
    const newImage = {
      id: 'exampleImageIdentifier',
      meta: {
        uri: 'https://YOURSERVER/images/file.jpg',
        thumbUri: 'https://YOURSERVER/images/thumb.jpg'
      }
    };
    return Promise.resolve(newImage);
  });

  // Do something with the instance of CreativeEditor SDK, for example:
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true
  });
  await instance.createDesignScene();
});
