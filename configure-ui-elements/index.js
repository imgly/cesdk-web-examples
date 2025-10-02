import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.60.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  ui: {
    // docs-ui-elements
    elements: {
      // docs-ui-view
      view: 'default', // 'default' or 'advanced'
      // docs-ui-view
      // docs-ui-navigation
      navigation: {
        show: true, // 'false' to hide the navigation completely
        position: 'top' // 'top' or 'bottom'
      },
      // docs-ui-navigation
      // docs-ui-panels
      panels: {
        inspector: {
          show: true, // true or false
          position: 'left', // 'left' or 'right'
          floating: false // true or false
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
        hideLabels: false // false or true
      },
      // docs-ui-dock
      // docs-ui-libraries
      libraries: {
        insert: {
          floating: true, // true or false
          autoClose: false // true or false
        },
        replace: {
          floating: true, // true or false
          autoClose: false // true or false
        }
      },
      // docs-ui-libraries
      // docs-ui-blocks
      blocks: {
        opacity: false, // true  or false
        transform: false, // true  or false
        '//ly.img.ubq/graphic': {
          adjustments: true, // true  or false
          filters: false, // true  or false
          effects: false, // true  or false
          blur: true, // true  or false
          crop: false // true  or false
        },
        // docs-ui-pages
        '//ly.img.ubq/page': {
          manage: true,
          format: true,
          maxDuration: 30 * 60
        }
        // docs-ui-pages
      }
      // docs-ui-blocks
    }
    // docs-ui-elements
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // docs-ui-actions
  // Configure navigation bar actions using the new API

  // Back button
  instance.ui.insertNavigationBarOrderComponent(
    'first',
    {
      id: 'ly.img.back.navigationBar',
      onClick: () => {
        // Handle back action
      }
    },
    'before'
  );

  // Actions group with save, load, export, and download
  instance.ui.insertNavigationBarOrderComponent('last', {
    id: 'ly.img.actions.navigationBar',
    children: [
      'ly.img.importScene.navigationBar', // Load
      'ly.img.saveScene.navigationBar', // Save
      {
        id: 'ly.img.exportPDF.navigationBar',
        exportOptions: {
          mimeType: 'application/pdf'
        }
      },
      'ly.img.exportScene.navigationBar' // Download
    ]
  });

  // Close button
  instance.ui.insertNavigationBarOrderComponent('last', {
    id: 'ly.img.close.navigationBar',
    onClick: () => {
      // Handle close action
    }
  });

  // docs-ui-custom-actions
  // Custom action
  instance.ui.insertNavigationBarOrderComponent('last', {
    id: 'custom-action',
    label: 'common.custom',
    iconName: '@imgly/icons/Essentials/Download',
    onClick: () => {
      // place custom functionality here
    }
  });
  // docs-ui-custom-actions
  // docs-ui-actions

  // Do something with the instance of CreativeEditor SDK, for example:
  // Populate the asset library with default / demo asset sources.
  instance.addDefaultAssetSources();
  instance.addDemoAssetSources({ sceneMode: 'Design', withUploadAssetSources: true });
  await instance.createDesignScene();
});
