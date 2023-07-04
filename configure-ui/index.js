import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.12.0/cesdk.umd.js';

const config = {
  ui: {
    // highlight-colorpalette
    colorPalette: [
      // highlight-hex
      '#FF0000',
      // highlight-hex
      // highlight-rgb
      { r: 0.0, g: 1.0, b: 0.0 },
      // highlight-rgb
      // highlight-rgba
      { r: 0.0, g: 0.0, b: 1.0, a: 1.0 }
      // highlight-rgba
    ],
    // highlight-colorpalette
    // highlight-pageformats
    pageFormats: {
      'din-a6': {
        // highlight-default
        default: true,
        // highlight-default
        // highlight-width
        width: 148,
        // highlight-width
        // highlight-height
        height: 105,
        // highlight-height
        // highlight-unit
        unit: 'Millimeter',
        // highlight-unit
        // highlight-fixedOrientation
        fixedOrientation: false
        // highlight-fixedOrientation
      },
      'twitter-profile': {
        width: 400,
        height: 400,
        unit: 'Pixel'
      },
      'american-letter': {
        width: 8.5,
        height: 11,
        unit: 'Inch'
      }
      // highlight-pageformats
    },
    // highlight-theming
    scale: 'normal',
    stylesheets: {
      /* ... */
    },
    // highlight-theming
    // highlight-elements
    elements: {
      /* ... */
    }
    // highlight-elements
  },
  callbacks: { onUpload: 'local' } // Enable local uploads in Asset Library.
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Do something with the instance of CreativeEditor SDK
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });
  await instance.createDesignScene();
});
