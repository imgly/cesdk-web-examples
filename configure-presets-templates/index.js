import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/assets',
  presets: {
    // highlight-templates
    templates: {
      demo: {
        // highlight-label
        label: 'Template',
        // highlight-label
        // highlight-scene
        scene: `${window.location.protocol}//${window.location.host}/template.scene`,
        // highlight-scene
        // highlight-thumbnail
        thumbnailURL: `${window.location.protocol}//${window.location.host}/template_thumb.png`
        // highlight-thumbnail
      }
    }
    // highlight-templates
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
