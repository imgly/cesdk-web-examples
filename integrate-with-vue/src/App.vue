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
        userId: 'guides-user',
        // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.64.0-rc.1/assets'
      }
    };
  }
};
</script>
