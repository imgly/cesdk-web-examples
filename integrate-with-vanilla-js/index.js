import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.50.1/index.js';
// Import a node module when you work with a bundler:
// import CreativeEditorSDK from '@cesdk/cesdk-js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  // Serve assets from IMG.LY cdn or locally
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.50.1/assets',
  // Enable local uploads in Asset Library
  callbacks: { onUpload: 'local' }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (editor) => {
  // Do something with the instance of CreativeEditor SDK, for example:
  // Populate the asset library with default / demo asset sources.
  editor.addDefaultAssetSources();
  editor.addDemoAssetSources({ sceneMode: 'Design' });
  await editor.createDesignScene();
  const engine = editor.engine; // Access the engine directly if required

  // Dispose the Editor when done to cleanup all memories and dangling references
  // editor.dispose();
});
