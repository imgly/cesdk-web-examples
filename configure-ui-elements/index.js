import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.9.0-preview.0/cesdk.umd.js';

const config = {
  ui: {
    // docs-ui-elements
    elements: {
      // docs-ui-view
      view: 'default', // 'default' or 'advanced'
      // docs-ui-view
      // docs-ui-navigation
      navigation: {
        show: true, // 'false' to hide the navigation completely
        position: 'top', // 'top' or 'bottom'
        // docs-ui-actions
        action: {
          close: true, // true or false
          back: true, // true or false
          load: true, // true or false
          save: true, // true or false
          export: {
            show: true,
            format: ['application/pdf']
          },
          download: true, // true  or false
          // docs-ui-actions
          // docs-ui-custom-actions
          custom: [
            {
              label: 'common.custom', // string or i18n key
              iconName: 'default', // one of 'default', 'download', 'upload', or 'save'
              callback: () => {
                // callback signature is `() => void | Promise<void>`
                // place custom functionality here
              }
            }
          ]
          // docs-ui-custom-actions
        }
      },
      // docs-ui-navigation
      // docs-ui-panels
      panels: {
        inspector: {
          show: true, // true or false
          position: 'left' // 'left' or 'right'
        },
        assetLibrary: {
          show: true, // true or false
          position: 'left' // 'left' or 'right'
        },
        settings: {
          show: true // true or false
        }
      },
      // docs-ui-panels
      // docs-ui-dock
      dock: {
        iconSize: 'large', // 'large' or 'normal'
        hideLabels: false, // false or true
        groups: [
          {
            id: 'ly.img.template', // string
            entryIds: ['ly.img.template'] // string[]
          },
          {
            id: 'ly.img.defaultGroup', // string
            showOverview: true // true or false
          }
        ],
        defaultGroupId: 'ly.img.defaultGroup' // string
      },
      // docs-ui-dock
      // docs-ui-libraries
      libraries: {
        insert: {
          entries: (defaultEntries) => defaultEntries,
          floating: true, // true or false
          autoClose: false // true or false
        },
        replace: {
          entries: (defaultEntries) => defaultEntries,
          floating: true, // true or false
          autoClose: false // true or false
        }
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
        },
        // docs-ui-pages
        '//ly.img.ubq/page': {
          manage: true,
          format: true
        }
        // docs-ui-pages
      }
      // docs-ui-blocks
    }
    // docs-ui-elements
  }
};

CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
  /** do something with the instance of CreativeEditor SDK * */
});
