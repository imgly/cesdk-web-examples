import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.22.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  ui: {
    // highlight-colorlibraries-config
    colorLibraries: ['myDefaultPalette'],
    i18n: {
      en: {
        'libraries.myDefaultPalette.label': 'My Default Palette'
      }
    },
    // highlight-colorlibraries-config
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
  // highlight-colorlibraries-source
  // Add an asset source with your own colors:
  instance.engine.asset.addLocalSource('myDefaultPalette');
  instance.engine.asset.addAssetToSource('myDefaultPalette', {
    id: 'red',
    label: { en: 'red' },
    tags: { en: ['red'] },
    payload: {
      color: {
        colorSpace: 'sRGB',
        r: 1,
        g: 0,
        b: 0
      }
    }
  });
  // highlight-colorlibraries-source
  await instance.createDesignScene();
});
