import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.56.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.56.0/assets',
  callbacks: {
    onUnsupportedBrowser: () => {
      /* This is the default window alert which will be shown in case an unsupported
       * browser tries to run CE.SDK */
      window.alert(
        'Your current browser is not supported.\nPlease use one of the following:\n\n- Mozilla Firefox 115 or newer\n- Apple Safari 15.6 or newer\n- Microsoft Edge 114 or newer\n- Google Chrome 114 or newer'
      );
    },
    onBack: () => {
      window.alert('Back callback!');
    },
    onClose: () => {
      window.alert('Close callback!');
    },
    onSave: (scene) => {
      window.alert('Save callback!');
      console.info(scene);
    },
    onDownload: (scene) => {
      window.alert('Download callback!');
      console.info(scene);
    },
    onLoad: () => {
      window.alert('Load callback!');
      const scene = '...'; // Fill with sene
      return Promise.resolve(scene);
    },
    onExport: (blobs, options) => {
      window.alert('Export callback!');
      console.info(options.mimeType);
      console.info(options.jpegQuality);
      console.info(options.pages);
      return Promise.resolve();
    },
    onUpload: (file, onProgress) => {
      window.alert('Upload callback!');
      const newImage = {
        id: 'exampleImageIdentifier',
        meta: {
          uri: 'https://YOURSERVER/images/file.jpg',
          thumbUri: 'https://YOURSERVER/images/thumb.jpg'
        }
      };
      return Promise.resolve(newImage);
    }
  },
  ui: {
    elements: {
      navigation: {
        action: {
          close: true,
          back: true,
          save: true,
          download: true,
          load: true,
          export: true
        }
      }
    }
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Do something with the instance of CreativeEditor SDK, for example:
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design' });
  await instance.createDesignScene();
});
