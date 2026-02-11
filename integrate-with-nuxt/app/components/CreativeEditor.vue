<template>
  <div id="cesdk_container" style="height: 100vh; width: 100vw"></div>
</template>

<script setup>
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { onMounted, onUnmounted } from 'vue';

// Props for configuration
const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
});

let cesdkInstance = null;

// Initialize CE.SDK
onMounted(async () => {
  cesdkInstance = await CreativeEditorSDK.create(
    '#cesdk_container',
    props.config,
  );
  await cesdkInstance.addDefaultAssetSources();
  await cesdkInstance.addDemoAssetSources({ sceneMode: 'Design' });
  await cesdkInstance.actions.run('scene.create', { page: { sourceId: 'ly.img.page.presets', assetId: 'ly.img.page.presets.print.iso.a6.landscape' } });
});
// Dispose of the editor when done
onUnmounted(() => {
  if (cesdkInstance) {
    cesdkInstance.dispose();
    cesdkInstance = null;
  }
});
</script>