<template>
  <div id="cesdk_container" style="height: 100vh; width: 100vw"></div>
</template>

<script>
import CreativeEditorSDK from '@cesdk/cesdk-js';

export default {
  name: 'CreativeEditor',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cesdkInstance: null
    };
  },
  async mounted() {
    this.cesdkInstance = await CreativeEditorSDK.create('#cesdk_container', this.config);
    await this.cesdkInstance.addDefaultAssetSources();
    await this.cesdkInstance.addDemoAssetSources({ sceneMode: 'Design' });
    await this.cesdkInstance.createDesignScene();
  },
  beforeUnmount() {
    if (this.cesdkInstance) {
      this.cesdkInstance.dispose();
      this.cesdkInstance = null;
    }
  }
};
</script>