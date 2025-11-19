<template>
    <ClientOnly>
        <CreativeEditor :config="editorConfig" />
    </ClientOnly>
</template>

<script setup>
import CreativeEditor from '~/components/CreativeEditor.vue';

const editorConfig = {
    // license: 'YOUR_CESDK_LICENSE_KEY', // Replace with your CE.SDK license key
    baseURL:
        'https://cdn.img.ly/packages/imgly/cesdk-js/1.64.0-rc.3/assets',
    callbacks: {
        onUpload: 'local',
    },
};
</script>