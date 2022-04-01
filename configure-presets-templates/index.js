import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.5/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.5/assets',
  presets: {
    // highlight-templates
    templates: {
      demo: {
        // highlight-scene
        scene: '/template.scene',
        // highlight-scene
        // highlight-thumbnail
        thumbnailURL: '/template_thumb.png'
        // highlight-thumbnail
      }
    }
    // highlight-templates
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
