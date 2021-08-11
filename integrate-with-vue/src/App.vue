<template>
  <div id="app">
    <CreativeEditorSDK />
  </div>
</template>

<script>
import CreativeEditorSDK from './components/CreativeEditorSDK.vue'

export default {
  name: 'App',
  components: {
    CreativeEditorSDK
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
