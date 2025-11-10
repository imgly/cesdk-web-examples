<template>
  <div ref="cesdkContainer" style="height: 100vh; width: 100vw"></div>
</template>

<script setup>
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';
import { onMounted, onUnmounted, ref } from 'vue';
import {
  DesignEditorConfig,
  // VideoEditorConfig,
  // PhotoEditorConfig
} from '@cesdk/cesdk-js/configs';

import {
  FiltersAssetSource,
  EffectsAssetSource,
  ColorPaletteAssetSource
} from '@cesdk/cesdk-js/plugins';

const cesdkContainer = ref(null);
let cesdkInstance = null;

// Props for configuration
const props = defineProps({
  config: {
    type: Object,
    required: false,
    default: () => ({
      license: 'YOUR_CESDK_LICENSE_KEY',
      userId: 'guides-user'
    })
  }
});

// Initialize CE.SDK
onMounted(async () => {
  const cesdk = await CreativeEditorSDK.create(cesdkContainer.value, props.config);

  // Configure the editor
  await cesdk.addPlugin(new DesignEditorConfig());
  // await cesdk.addPlugin(new VideoEditorConfig());
  // await cesdk.addPlugin(new PhotoEditorConfig());

  // Configure the asset sources
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Create the scene
  await cesdk.createDesignScene();

  cesdkInstance = cesdk;
});

// Dispose of the editor when done
onUnmounted(() => {
  if (cesdkInstance) {
    cesdkInstance.dispose();
    cesdkInstance = null;
  }
});
</script>
