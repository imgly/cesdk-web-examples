import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.12.1/cesdk.umd.js';

CreativeEditorSDK.create('#cesdk_container').then(async (instance) => {
  // Do something with the instance of CreativeEditor SDK, for example:
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });
  await instance.createDesignScene();
});
