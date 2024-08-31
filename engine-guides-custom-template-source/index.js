import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.34.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.34.0/assets',
  callbacks: { onUpload: 'local' } // Enable local uploads in Asset Library.
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  // highlight-demo
  instance.addDemoAssetSources({ sceneMode: 'Design' });
  // highlight-demo
  // highlight-add-local-source
  instance.engine.asset.addLocalSource(
    // highlight-sourceid
    'my-templates',
    undefined,
    // highlight-sourceid
    // highlight-applyasset
    function applyAsset(asset) {
      instance.engine.scene.applyTemplateFromURL(asset.meta.uri);
    }
    // highlight-applyasset
  );
  // highlight-add-local-source
  // highlight-add-asset
  instance.engine.asset.addAssetToSource('my-templates', {
    id: 'template1',
    label: 'Template 1',
    meta: {
      uri: `${window.location.protocol}//${window.location.host}/template.scene`,
      thumbUri: `${window.location.protocol}//${window.location.host}/template_thumb.png`
    }
  });
  // highlight-add-asset
  // highlight-ui-config
  instance.ui.addAssetLibraryEntry({
    id: 'my-templates-entry',
    sourceIds: ['my-templates'],
    sceneMode: 'Design',
    previewLength: 5,
    previewBackgroundType: 'cover',
    gridBackgroundType: 'cover',
    gridColumns: 3
  });
  instance.ui.setDockOrder([
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'my-templates-dock-entry',
      label: 'My Templates',
      icon: '@imgly/Template',
      entries: ['my-templates-entry']
    }
  ]);
  // highlight-ui-config
  instance.createDesignScene();
});
