// docs-integrate-vue-2
<template>
  <div id="cesdk_container" style="height: 100vh; width: 100vw"></div>
</template>
// docs-integrate-vue-2

<script>
// docs-integrate-vue-1
import CreativeEditorSDK from '@cesdk/cesdk-js';
// docs-integrate-vue-1

// docs-integrate-vue-3
export default {
  name: 'CreativeEditorSDK',

  props: { config: Object },

  _cesdk: null,

  // docs-integrate-vue-4
  mounted: function mounted() {
    CreativeEditorSDK.create('#cesdk_container', this.config).then(async (instance) => {
      this._cesdk = instance;
      // Do something with the instance of CreativeEditor SDK, for example:
      // Populate the asset library with default / demo asset sources.
      instance.addDefaultAssetSources();
      instance.addDemoAssetSources({ sceneMode: 'Design' });
      await instance.createDesignScene();
    });
  },
  // docs-integrate-vue-4

  methods: {},

  watch: {},

  beforeDestroy: function beforeDestroy() {
    if (this._cesdk) {
      this._cesdk.dispose();
      this._cesdk = null;
    }
  }
};
// docs-integrate-vue-3
</script>
