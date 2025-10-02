<!-- docs-integrate-svelte-3 -->
<script>
  // docs-integrate-svelte-1
  import CreativeEditorSDK from '@cesdk/cesdk-js';
  // docs-integrate-svelte-1
  import { onDestroy, onMount } from 'svelte';

  let container;
  let cesdk = null;

  // docs-integrate-svelte-4
  onMount(() => {
    const { el, children, class: _, config, ...props } = $$props;
    try {
      CreativeEditorSDK.create(container, config).then(async (instance) => {
        cesdk = instance;
        // Do something with the instance of CreativeEditor SDK, for example:
        // Populate the asset library with default / demo asset sources.
        cesdk.addDefaultAssetSources();
        cesdk.addDemoAssetSources({ sceneMode: 'Design', withUploadAssetSources: true });
        await cesdk.createDesignScene();
      });
    } catch (err) {
      console.warn(`CreativeEditor SDK failed to mount.`, { err });
    }
  });
  // docs-integrate-svelte-4

  onDestroy(() => {
    try {
      if (cesdk) {
        cesdk.dispose();
        cesdk = null;
      }
    } catch (err) {
      console.warn(`CreativeEditor SDK failed to unmount.`, { err });
    }
  });
</script>

<!-- docs-integrate-svelte-2 -->
<div id="cesdk_container" bind:this={container} />

<!-- docs-integrate-svelte-2 -->
<style>
  #cesdk_container {
    height: 100vh;
    width: 100vw;
  }
</style>
<!-- docs-integrate-svelte-3 -->
