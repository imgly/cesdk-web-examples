import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.1/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  ui: {
    stylesheets: {
      /* ... */
    },
    elements: {
      /* ... */
    }
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Set the UI scale using the new API method
  instance.ui.setScale('normal');

  instance.i18n.setTranslations({
    en: {
      'libraries.myDefaultPalette.label': 'My Default Palette'
    }
  });

  // Do something with the instance of CreativeEditor SDK
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true
  });
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

  // Update color library entry with custom source ID
  instance.ui.updateAssetLibraryEntry('ly.img.colors', {
    sourceIds: ['myDefaultPalette']
  });

  // Create custom page format source and add formats
  instance.engine.asset.addLocalSource('myPageFormats');

  // Add din-a6 format
  instance.engine.asset.addAssetToSource('myPageFormats', {
    id: 'din-a6',
    label: { en: 'DIN A6' },
    meta: {
      vectorPath: 'M10 10 H138 V95 H10 Z',
      fixedOrientation: false,
      default: true
    },
    payload: {
      transformPreset: {
        type: 'FixedSize',
        width: 148,
        height: 105,
        designUnit: 'Millimeter'
      }
    }
  });

  // Add twitter-profile format
  instance.engine.asset.addAssetToSource('myPageFormats', {
    id: 'twitter-profile',
    label: { en: 'Twitter Profile' },
    meta: {
      vectorPath: 'M10 10 H390 V390 H10 Z'
    },
    payload: {
      transformPreset: {
        type: 'FixedSize',
        width: 400,
        height: 400,
        designUnit: 'Pixel'
      }
    }
  });

  // Add american-letter format
  instance.engine.asset.addAssetToSource('myPageFormats', {
    id: 'american-letter',
    label: { en: 'American Letter' },
    meta: {
      vectorPath: 'M10 10 H8.5 V11 H10 Z'
    },
    payload: {
      transformPreset: {
        type: 'FixedSize',
        width: 8.5,
        height: 11,
        designUnit: 'Inch'
      }
    }
  });

  // Update page presets entry to use custom formats
  instance.ui.updateAssetLibraryEntry('ly.img.pagePresets', {
    sourceIds: ['myPageFormats']
  });

  await instance.createDesignScene();
});
