import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.18.1-rc.1/cesdk.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.18.1-rc.1/assets',
  // highlight-ui-config
  ui: {
    elements: {
      dock: {
        groups: [
          {
            id: 'my-templates-group',
            entryIds: ['my-templates-entry']
          }
        ]
      },
      libraries: {
        insert: {
          entries: [
            {
              id: 'my-templates-entry',
              sourceIds: ['my-templates'],
              title: 'My Templates'
            }
          ]
        }
      }
    }
  },
  // highlight-ui-config
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
  instance.createDesignScene();
});
