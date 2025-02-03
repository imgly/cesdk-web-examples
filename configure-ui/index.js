import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.44.0-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  ui: {
    colorLibraries: ['myDefaultPalette'],
    i18n: {
      en: {
        'libraries.myDefaultPalette.label': 'My Default Palette'
      }
    },
    pageFormats: {
      'din-a6': {
        default: true,
        width: 148,
        height: 105,
        unit: 'Millimeter',
        fixedOrientation: false
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
    },
    scale: 'normal',
    stylesheets: {
      /* ... */
    },
    elements: {
      /* ... */
    }
  },
  callbacks: { onUpload: 'local' } // Enable local uploads in Asset Library.
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Do something with the instance of CreativeEditor SDK
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });
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
  await instance.createDesignScene();
});
