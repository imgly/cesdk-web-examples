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
  data() {
    return {
      config: {
        license:
          'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
        userId: 'guides-user',
        baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.59.1/assets',
        callbacks: { onUpload: 'local' }
      },
      init: async (cesdk) => {
        await cesdk.addDefaultAssetSources();
        await cesdk.addDemoAssetSources({ sceneMode: 'Design' });
        await cesdk.createDesignScene();
      }
    };
  }
};
</script>
