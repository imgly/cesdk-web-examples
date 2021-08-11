<template>
  <div id="cesdk_container" style="height: 100vh; width: 100vw"></div>
</template>

<script>
import CreativeEditorSDK from '@cesdk/cesdk-js';

export default {
  name: 'CreativeEditorSDK',

  props: [],
  _cesdk: null,

  mounted: function mounted() {
    this.load();
  },
  /**
   * Our component has these two methods — one to trigger document loading, and the other to unload and clean up
   * so the component is ready to load another document.
   */
  methods: {
    load: function load() {
      const config = {
        // baseURL: 'assets/'
      };

      CreativeEditorSDK.init('#cesdk_container', config).then((instance) => {
        this._cesdk = instance;
      });
    },
    unload: function unload() {
      if (this._cesdk) {
        this._cesdk.dipose();
        this._cesdk = null;
      }
    }
  },

  watch: {},

  beforeDestroy: function beforeDestroy() {
    this.unload();
  }
};
</script>
