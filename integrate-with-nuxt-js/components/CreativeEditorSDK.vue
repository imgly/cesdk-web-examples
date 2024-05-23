<template>
  <div id="cesdk_container" style="height: 100vh; width: 100vw"></div>
</template>

<script>
export default {
  name: 'CreativeEditorSDK',
  props: { config: Object },
  _cesdk: null,
  mounted: async function mounted() {
    if (process.client) {
      const CreativeEditorSDK = await import('@cesdk/cesdk-js');
      const myConfig = {
        ...this.config,
        license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
        userId: 'guides-user',
        callbacks: { onUpload: 'local' }
      }
      CreativeEditorSDK.default.create('#cesdk_container', myConfig).then((instance) => {
        // Do something with the instance of CreativeEditor SDK, for example:
        // Populate the asset library with default / demo asset sources.
        instance.addDefaultAssetSources();
        instance.addDemoAssetSources({ sceneMode: 'Design' });
        instance.createDesignScene();
      });
    }

  },
  methods: {},
  watch: {},
  beforeDestroy: function beforeDestroy() {
    if (this._cesdk) {
      this._cesdk.dispose();
      this._cesdk = null;
    }
  }
};
</script>