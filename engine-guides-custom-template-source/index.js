import CreativeEditorSDK from '@cesdk/cesdk-js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  instance.addDemoAssetSources({
    sceneMode: 'Design',
    withUploadAssetSources: true
  });
  instance.engine.asset.addLocalSource(
    'my-templates',
    undefined,
    function applyAsset(asset) {
      instance.engine.scene.applyTemplateFromURL(asset.meta.uri);
    }
  );
  instance.engine.asset.addAssetToSource('my-templates', {
    id: 'template1',
    label: 'Template 1',
    meta: {
      uri: `${window.location.protocol}//${window.location.host}/template.scene`,
      thumbUri: `${window.location.protocol}//${window.location.host}/template_thumb.png`
    }
  });
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
  instance.createDesignScene();
});
