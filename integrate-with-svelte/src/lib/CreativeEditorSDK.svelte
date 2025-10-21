<script>
  import CreativeEditorSDK from "@cesdk/cesdk-js";
  import { onDestroy, onMount } from "svelte";

  // reference to the container HTML element where CE.SDK will be initialized
  let container;
  // where to keep track of the CE.SDK instance
  let cesdk = null;
  export let config = {};

  // default CreativeEditor SDK configuration
  const defaultConfig = {
    license: "YOUR_LICENSE_KEY", // replace it with a valid CE.SDK license key
    callbacks: { onUpload: "local"}, // enable local file uploads in the Asset Library
    // other default configs...
  };

  // accessing the component's props
  //const { el, children, class: _, config, ...props } = $props();

  // hook to initialize the CreativeEditorSDK component
  onMount(() => {
    // integrate the configs read from props with the default ones
    const ceSDKConfig = {
      ...defaultConfig,
      ...config,
    }

    try {
      // initialize the CreativeEditorSDK instance in the container element
      // using the given config
      CreativeEditorSDK.create(container, ceSDKConfig).then(async (instance) => {
        cesdk = instance;

        // Do something with the instance of CreativeEditor SDK (e.g., populate
        // the asset library with default / demo asset sources)
        await Promise.all([
          cesdk.addDefaultAssetSources(),
          cesdk.addDemoAssetSources({ sceneMode: 'Design', withUploadAssetSources: true })
        ]);

        // Create a new design scene in the editor
        await cesdk.createDesignScene();
      });
    } catch (err) {
      console.warn(`CreativeEditor SDK failed to mount.`, { err });
    }
  });

  // hook to clean up when the component unmounts
  onDestroy(() => {
    try {
      // dispose of the CE.SDK instance if it exists
      if (cesdk) {
        cesdk.dispose();
        cesdk = null;
      }
    } catch (err) {
      // log error if CreativeEditor SDK fails to unmount
      console.warn(`CreativeEditor SDK failed to unmount.`, { err });
    }
  });
</script>

<!-- the container HTML element where the CE.SDK editor will be mounted -->
<div id="cesdk_container" bind:this={container}></div>

<style>
  /* styling for the CE.SDK container element to take full viewport size */
  #cesdk_container {
    height: 100vh;
    width: 100vw;
  }
</style>