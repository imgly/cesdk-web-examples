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
    CreativeEditorSDK.init('#cesdk_container', this.config).then((instance) => {
      /** do something with the instance of CreativeEditor SDK **/
      this._cesdk = instance;
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
