<template>
  <CreativeEditor :config="config" />
</template>

<script>
import CreativeEditor from './components/CreativeEditor.vue';

export default {
  name: 'App',
  components: { CreativeEditor },
  data() {
    return {
      config: {
        userId: 'guides-user',
        // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
        // Use local assets when developing with local packages
        ...(import.meta.env.CESDK_USE_LOCAL && {
          baseURL: '/assets/'
        })
      }
    };
  }
};
</script>
