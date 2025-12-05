<template>
  <ClientOnly>
    <CreativeEditor :config="editorConfig" />
  </ClientOnly>
</template>

<script setup>
import CreativeEditor from '~/components/CreativeEditor.vue';

const editorConfig = {
  userId: 'guides-user',
  // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  }),
  callbacks: {
    onUpload: 'local'
  }
};
</script>
