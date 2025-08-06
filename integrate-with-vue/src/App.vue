<template>
  <CreativeEditor :config="editorConfig" />
</template>

<script>
import CreativeEditor from './components/CreativeEditor.vue';

export default {
  name: 'App',
  components: { CreativeEditor },
  data() {
    return {
      editorConfig: {
        license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
        userId: 'guides-user',
        baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.57.0/assets',
        callbacks: {
          onUpload: 'local'
        }
      }
    };
  }
};
</script>