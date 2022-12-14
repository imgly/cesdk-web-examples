
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.1/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.1/assets',
  // highlight-scene
  scene: {
    // highlight-dpi
    dpi: 300,
    // highlight-dpi
    // highlight-pixelScaleFactor
    pixelScaleFactor: 1.0
    // highlight-pixelScaleFactor
  }
  // highlight-scene
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
