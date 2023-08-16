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
      const CreativeEditorSDK = await import('@cesdk/cesdk-js')
      CreativeEditorSDK.default.init('#cesdk_container', this.config).then((instance) => {
        /** do something with the instance of CreativeEditor SDK **/
        this._cesdk = instance;
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