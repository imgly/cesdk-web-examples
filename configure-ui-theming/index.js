import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.12.0-rc.0/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.12.0-rc.0/assets',
  // docs-theming-theme
  theme: 'light', // 'light' or 'dark'
  ui: {
    scale: 'normal', // 'normal' or 'large'
    // docs-theming-theme
    // docs-theming-generator
    elements: {
      panels: {
        settings: true
      }
    }
    // docs-theming-generator
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
