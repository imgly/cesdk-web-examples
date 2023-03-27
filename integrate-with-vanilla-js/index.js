// highlight-1
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.11.0-preview.0/cesdk.umd.js';
// Import a node module when you work with a bundler:
// import CreativeEngine from '@cesdk/engine';
// highlight-1

// highlight-3
let config = {
  // Serve assets from IMG.LY cdn or locally
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.11.0-preview.0/assets'
};

CreativeEditorSDK.init('#cesdk_container', config).then(async (editor) => {
  /** do something with the instance of CreativeEditor SDK **/
  // highlight-engine
  let engine = editor.engine; // Access the engine directly if required
  // highlight-engine

  // highlight-dispose
  // Dispose the Editor when done to cleanup all memories and dangling references
  // editor.dispose();
  // highlight-dispose
});
// highlight-3
