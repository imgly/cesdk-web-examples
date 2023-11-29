// highlight-1
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.18.1/cesdk.umd.js';
// Import a node module when you work with a bundler:
// import CreativeEditorSDK from '@cesdk/cesdk-js';
// highlight-1

// highlight-3
const config = {
  // Serve assets from IMG.LY cdn or locally
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.18.1/assets',
  // Enable local uploads in Asset Library
  callbacks: { onUpload: 'local' }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (editor) => {
  // Do something with the instance of CreativeEditor SDK, for example:
  // Populate the asset library with default / demo asset sources.
  editor.addDefaultAssetSources();
  editor.addDemoAssetSources({ sceneMode: 'Design' });
  await editor.createDesignScene();
  // highlight-engine
  const engine = editor.engine; // Access the engine directly if required
  // highlight-engine

  // highlight-dispose
  // Dispose the Editor when done to cleanup all memories and dangling references
  // editor.dispose();
  // highlight-dispose
});
// highlight-3
