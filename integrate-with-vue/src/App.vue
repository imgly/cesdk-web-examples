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
        // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your actual CE.SDK license key
        userId: 'guides-user',
        // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.1/assets'
      }
    };
  }
};
</script>
