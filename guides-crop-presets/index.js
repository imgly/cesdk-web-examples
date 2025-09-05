import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.60.0-rc.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.60.0-rc.0/assets',
  userId: 'guides-user',
  ui: {
    // Scale is now set via API after initialization
    stylesheets: {
      /* ... */
    },
    elements: {
      /* ... */
    },
    pagePresetLibraries: [
      // 'ly.img.crop.presets',
      'my-custom-crop-presets'
    ]
  },
  callbacks: { onUpload: 'local' } // Enable local uploads in Asset Library.
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Do something with the instance of CreativeEditor SDK
  // Set scale using the new API
  instance.ui.setScale('normal');
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });

  // Add a custom crop preset asset source.
  instance.engine.asset.addLocalSource('my-custom-crop-presets');

  instance.engine.asset.addAssetToSource(
    'my-custom-crop-presets',
    {
      id: 'aspect-ratio-free',
      label: {
        en: 'Free'
      },
      meta: {
        width: 80,
        height: 120,
        thumbUri: `${window.location.protocol}//${window.location.host}/ratio-free.png`
      },
      payload: {
        transformPreset: {
          type: 'FreeAspectRatio'
        }
      }
    }
  );

  instance.engine.asset.addAssetToSource(
    'my-custom-crop-presets',
    {
      id: 'aspect-ratio-16-9',
      label: {
        en: '16:9'
      },
      meta: {
        width: 80,
        height: 120,
        thumbUri: `${window.location.protocol}//${window.location.host}/ratio-16-9.png`
      },
      payload: {
        transformPreset: {
          type: 'FixedAspectRatio',
          width: 16,
          height: 9
        }
      }
    }
  );

  instance.engine.asset.addAssetToSource(
    'my-custom-crop-presets',
    {
      id: 'din-a1-portrait',
      label: {
        en: 'DIN A1 Portrait'
      },
      meta: {
        width: 80,
        height: 120,
        thumbUri: `${window.location.protocol}//${window.location.host}/din-a1-portrait.png`
      },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 594,
          height: 841,
          designUnit: 'Millimeter'
        }
      }
    }
  );

  await instance.createDesignScene();
});
