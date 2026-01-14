import CreativeEditorSDK from '@cesdk/cesdk-js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  }),
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
  // Expose for hero image capture
  window.cesdk = instance;
  // Do something with the instance of CreativeEditor SDK
  // Set scale using the new API
  instance.ui.setScale('normal');
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true
  });

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

  // Update crop presets library entry
  instance.ui.updateAssetLibraryEntry('ly.img.cropPresets', {
    sourceIds: [
      // 'ly.img.crop.presets',
      'my-custom-crop-presets'
    ]
  });

  await instance.createDesignScene();

  // Add an image and enable crop mode to show the presets
  const engine = instance.engine;
  const page = engine.scene.getCurrentPage();

  // Get page dimensions for relative sizing
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Create an image block at ~50% of page size
  const imageBlock = engine.block.create('graphic');
  engine.block.appendChild(page, imageBlock);

  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(imageBlock, rectShape);

  const imageWidth = pageWidth * 0.5;
  const imageHeight = pageHeight * 0.5;
  engine.block.setWidth(imageBlock, imageWidth);
  engine.block.setHeight(imageBlock, imageHeight);

  // Center the image on the page
  engine.block.setPositionX(imageBlock, (pageWidth - imageWidth) / 2);
  engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(imageBlock, imageFill);

  // Select the image and enter crop mode
  engine.block.select(imageBlock);
  engine.editor.setEditMode('Crop');
});
