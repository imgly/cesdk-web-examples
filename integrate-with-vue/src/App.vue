<script setup lang="ts">
import CreativeEditor from './components/CreativeEditor.vue';
</script>


<template>

  <CreativeEditor :config="{
    license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
    userId: 'guides-user',
    callbacks: { onUpload: 'local' } // Enables local uploads in Asset Library. 
  }" />

</template>