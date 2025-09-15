<template>
  <CreativeEditor :config="config" :init="init" width="100vw" height="100vh" />
</template>

<script>
import CreativeEditor from '@cesdk/cesdk-js/vue';

export default {
  name: 'CreativeEditorWrapper',
  components: {
    CreativeEditor
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      init: async (cesdk) => {
        await cesdk.addDefaultAssetSources();
        await cesdk.addDemoAssetSources({
          sceneMode: 'Design',
          withUploadAssetSources: true
        });
        await cesdk.createDesignScene();
      }
    };
  }
};
</script>
