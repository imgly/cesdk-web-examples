import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.10.6/assets',
  // highlight-callbacks
  callbacks: {
    // highlight-onlog
    log: (message, logLevel) => {
      switch (logLevel) {
        case 'Info':
          console.info(message);
          break;
        case 'Warning':
          console.warn(message);
          break;
        case 'Error':
          console.error(message);
          break;
        default:
          console.log(message);
      }
    },
    // highlight-onlog
    // highlight-onunsupportedbrowser
    onUnsupportedBrowser: () => {
      /* This is the default window alert which will be shown in case an unsupported
       * browser tries to run CE.SDK */
      window.alert(
        'Your current browser is not supported.\nPlease use one of the following:\n\n- Mozilla Firefox 86 or newer\n- Apple Safari 14.1 or newer\n- Microsoft Edge 88 or newer\n- Google Chrome 88 or newer'
      );
    },
    // highlight-onunsupportedbrowser
    // highlight-onback
    onBack: () => {
      window.alert('Back callback!');
    },
    // highlight-onback
    // highlight-onclose
    onClose: () => {
      window.alert('Close callback!');
    },
    // highlight-onclose
    // highlight-onsave
    onSave: (scene) => {
      window.alert('Save callback!');
      console.info(scene);
    },
    // highlight-onsave
    // highlight-onload
    onLoad: () => {
      window.alert('Load callback!');
      let scene = '...'; // Fill with sene
      return Promise.resolve(scene);
    },
    // highlight-onload
    // highlight-onexport
    onExport: (blobs, options) => {
      window.alert('Export callback!');
      console.info(options.mimeType);
      console.info(options.jpegQuality);
      console.info(options.pages);
      return Promise.resolve();
    },
    // highlight-onexport
    // highlight-onupload
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
    // highlight-onupload
  },
  ui: {
    elements: {
      // highlight-navigation
      navigation: {
        action: {
          close: true,
          back: true,
          save: true,
          load: true,
          export: true
        }
      }
      // highlight-navigation
    }
  }
};
// highlight-callbacks

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK **/
});
