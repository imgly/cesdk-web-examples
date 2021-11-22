import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.2.0/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.2.0/assets',
  presets: {
    // highlight-images
    images: {
      imgly_logo: {
        // highlight-imageURL
        imageURL: '/logo.png',
        // highlight-imageURL
        // highlight-thumbnailURL
        thumbnailURL: '/logo_thumbnail.png',
        // highlight-thumbnailURL
        // highlight-width
        width: 1024,
        // highlight-width
        // highlight-height
        height: 216
        // highlight-height
      }
    }
    // highlight-images
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
