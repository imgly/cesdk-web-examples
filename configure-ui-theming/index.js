import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.3/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.3/assets',
  // docs-theming-theme
  theme: 'dark', // 'light' or 'dark'
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
