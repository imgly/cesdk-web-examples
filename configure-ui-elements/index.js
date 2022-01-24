import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.2/cesdk.umd.js';

const config = {
  ui: {
    // docs-ui-elements
    elements: {
      // docs-ui-adopterview
      view: {
        adopter: {
          style: 'default' // 'default' or 'advanced'
        }
      },
      // docs-ui-adopterview
      // docs-ui-navigation
      navigation: {
        position: 'top', // 'top' or 'bottom'
        action: {
          close: true, // true  or false
          back: true, // true  or false
          load: true, // true  or false
          save: true, // true  or false
          export: true, // true  or false
          download: true // true  or false
        }
      },
      // docs-ui-navigation
      // docs-ui-panels
      panels: {
        inspector: {
          show: true, // true  or false
          position: 'right' // 'left' or 'right'
        },
        settings: {
          show: true // true  or false
        }
      },
      // docs-ui-panels
      // docs-ui-libraries
      libraries: {
        image: true, // true  or false
        text: true, // true  or false
        element: true // true  or false
      },
      // docs-ui-libraries
      // docs-ui-blocks
      blocks: {
        opacity: false, // true  or false
        transform: false, // true  or false
        '//ly.img.ubq/image': {
          adjustments: true, // true  or false
          filters: false, // true  or false
          effects: false, // true  or false
          blur: true, // true  or false
          crop: false // true  or false
        }
      }
      // docs-ui-blocks
    }
    // docs-ui-elements
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK * */
});
