<template>
  <div id="app">
    <CreativeEditorSDK :config="{
      license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
      userId: 'guides-user',
      callbacks: { onUpload: 'local' } // Enables local uploads in Asset Library. 
    }" />
  </div>
</template>

<script>
import CreativeEditorSDK from './components/CreativeEditorSDK.vue';

export default {
  name: 'App',
  components: {
    CreativeEditorSDK
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
