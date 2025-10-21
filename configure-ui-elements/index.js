import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.62.0-rc.2/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  ui: {
    // docs-ui-elements
    elements: {
      // docs-ui-view
      // docs-ui-view
      // docs-ui-navigation
      navigation: {
        show: true, // 'false' to hide the navigation completely
        position: 'top' // 'top' or 'bottom'
      },
      // docs-ui-navigation
      // docs-ui-panels
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
          autoClose: false // true or false
        },
        replace: {
          autoClose: false // true or false
        }
      }
      // docs-ui-libraries
    }
    // docs-ui-elements
  }
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // Set the editor view mode
  instance.ui.setView('default');

  // docs-ui-panels
  // Configure panels using the new feature and panel APIs

  // Enable inspector panel and configure position/floating
  instance.feature.enable('ly.img.inspector', () => true);
  instance.ui.setPanelPosition('//ly.img.panel/inspector', 'left');
  instance.ui.setPanelFloating('//ly.img.panel/inspector', false);

  // Enable asset library panel and configure position
  instance.feature.enable('ly.img.assetLibrary', () => true);
  instance.ui.setPanelPosition('//ly.img.panel/assetLibrary', 'left');
  instance.ui.setPanelFloating('//ly.img.panel/assetLibrary', true);
  instance.ui.setPanelFloating('//ly.img.panel/replaceAssetLibrary', true);

  // Enable settings panel
  instance.feature.enable('ly.img.settings', () => true);
  // docs-ui-panels

  // Configure block features using the Feature API
  instance.feature.enable('ly.img.opacity', false);
  instance.feature.enable('ly.img.transform.position', false);
  instance.feature.enable('ly.img.transform.size', false);
  instance.feature.enable('ly.img.transform.rotation', false);
  instance.feature.enable('ly.img.transform.flip', false);
  instance.feature.enable('ly.img.adjustment');
  instance.feature.enable('ly.img.filter', false);
  instance.feature.enable('ly.img.effect', false);
  instance.feature.enable('ly.img.blur');
  instance.feature.enable('ly.img.crop', false);
  instance.feature.enable('ly.img.page.add');
  instance.feature.enable('ly.img.page.move');
  instance.feature.enable('ly.img.duplicate');
  instance.feature.enable('ly.img.page.resize');

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
  instance.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true
  });
  await instance.createDesignScene();
});
