import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.1/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.1/assets',
  presets: {
    // highlight-colorpalettes
    colorPalettes: {
      rgb: {
        // highlight-meta
        meta: { default: true },
        // highlight-meta
        // highlight-entries
        entries: [
          // highlight-hex
          '#FF0000',
          // highlight-hex
          // highlight-rgb
          { r: 0.0, g: 1.0, b: 0.0 },
          // highlight-rgb
          // highlight-rgba
          { r: 0.0, g: 0.0, b: 1.0, a: 1.0 },
          // highlight-rgba
        ]
        // highlight-entries
      }
    }
    // highlight-colorpalettes
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
