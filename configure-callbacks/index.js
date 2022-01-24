import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.2/cesdk.umd.js';

let config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.2/assets',
  // highlight-callbacks
  callbacks: {
    // highlight-onlog
    log: (message, logLevel) => {
      switch (logLevel) {
        case "Info":
          console.info(message)
          break
        case "Warning":
          console.warn(message)
          break
        case "Error":
          console.error(message)
          break
        default:
          console.log(message);
      }
    },
    // highlight-onlog
    // highlight-onunsupportedbrowser
    onUnsupportedBrowser: () => {
      window.alert('Browser is not supported!');
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
      console.info(options.mimeType)
      console.info(options.quality)
      constole.info(options.pages)
      return Promise.resolve();
    },
    // highlight-onexport
    // highlight-onupload
    onUpload: (file, onProgress) => {
      window.alert('Upload callback!');
      let newImage = {
        id: 'exampleImageIdentifier',
        uri: 'https://YOURSERVER/images/file.jpg',
        thumbUri: 'https://YOURSERVER/images/thumb.jpg',
      }
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
          export: true,
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
