<template>
  <div id="cesdk_container" style="width: 100vw; height: 100vh;"></div>
</template>

<script>
export default {
  name: 'CreativeEditor',
  mounted() {
    import('https://cdn.img.ly/packages/imgly/cesdk-js/1.51.0-rc.5/index.js')
      .then(async ({ default: CreativeEditorSDK }) => {
        const config = {
          license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
          userId: 'guides-user',
          baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.51.0-rc.5/assets',
          callbacks: { onUpload: 'local' }
        };

        const instance = await CreativeEditorSDK.create('#cesdk_container', config);
        await instance.addDefaultAssetSources();
        await instance.addDemoAssetSources({ sceneMode: 'Design' });
        await instance.createDesignScene();
      });
  }
};
</script>
