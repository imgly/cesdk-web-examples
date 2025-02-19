import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/cesdk.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/assets',
  presets: {
    // highlight-pageFormats
    pageFormats: {
      'din-a6': {
        // highlight-meta
        meta: {
          default: true
        },
        // highlight-meta
        // highlight-width
        width: 148,
        // highlight-width
        // highlight-height
        height: 105,
        // highlight-height
        // highlight-unit
        unit: 'mm', // Millimeter
        // highlight-unit
        // highlight-fixedOrientation
        fixedOrientation: false
        // highlight-fixedOrientation
      },
      'twitter-profile': {
        width: 400,
        height: 400,
        unit: 'px' // Pixel
      },
      'american-letter': {
        width: 8.5,
        height: 11,
        unit: 'in' // Inch
      }
      // highlight-pageFormats
    }
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
