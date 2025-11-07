<script>
  import { onDestroy, onMount } from "svelte";
  import CreativeEditorSDK, { Configuration } from "@cesdk/cesdk-js";
  // import {
  //   DesignEditorConfig,
  //   // VideoEditorConfig,
  //   // PhotoEditorConfig
  // } from "@cesdk/cesdk-js/configs";

  // import {
  //   FiltersAssetSource,
  //   EffectsAssetSource,
  //   ColorPaletteAssetSource
  // } from "@cesdk/cesdk-js/plugins";

  // reference to the container HTML element where CE.SDK will be initialized
  let container;
  // where to keep track of the CE.SDK instance
  let cesdk = null;
  export let config = {};

  // default CreativeEditor SDK configuration
  const defaultConfig = {
    userId: "guides-user"
  };

  // hook to initialize the CreativeEditorSDK component
  onMount(async () => {
    // integrate the configs read from props with the default ones
    const ceSDKConfig = {
      ...defaultConfig,
      ...config,
    };

    try {
      cesdk = await CreativeEditorSDK.create(container, ceSDKConfig);

      // TODO: Uncomment when configs/plugins are released
      // Configure the editor
      // await cesdk.addPlugin(new DesignEditorConfig());
      // await cesdk.addPlugin(new VideoEditorConfig());
      // await cesdk.addPlugin(new PhotoEditorConfig());

      // Configure the asset sources
      // await cesdk.addPlugin(new FiltersAssetSource());
      // await cesdk.addPlugin(new EffectsAssetSource());
      // await cesdk.addPlugin(new ColorPaletteAssetSource());

      // Create the scene
      await cesdk.createDesignScene();
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