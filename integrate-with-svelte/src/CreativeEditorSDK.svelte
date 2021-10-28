// docs-integrate-svelte-3
<script>
  // docs-integrate-svelte-1
  import CreativeEditorSDK from '@cesdk/cesdk-js';
  // docs-integrate-svelte-1
  import { onMount, onDestroy } from 'svelte';

  let container;
  let cesdk = null;
  
  // docs-integrate-svelte-4
  onMount(() => {
    const { el, children, class: _, config, ...props } = $$props;
    try {
      CreativeEditorSDK.init(container, config).then((instance) => {
        /** do something with the instance of CreativeEditor SDK **/
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

// docs-integrate-svelte-2
<div
  id="cesdk_container"
  bind:this={container}
/>
// docs-integrate-svelte-2

<style>
  #cesdk_container {
    height: 100vh;
    width: 100vw;
  }
</style>
// docs-integrate-svelte-3
