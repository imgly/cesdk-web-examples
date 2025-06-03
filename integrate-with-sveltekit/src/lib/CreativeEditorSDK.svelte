<script>
  import CreativeEditorSDK from '@cesdk/cesdk-js';
  import { onDestroy, onMount } from 'svelte';

  // reference to the container HTML element where CE.SDK will be initialized
  let container;
  // where to keep track of the CE.SDK instance
  let cesdk = null;

  // deafult CreativeEditor SDK configuration
  const defaultConfig = {
    license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu', // replace it with your license key
    userId: 'guides-user',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.53.0-rc.1/assets',
    callbacks: { onUpload: 'local' } // enable local file uploads in the Asset Library
    // other default configs...
  };

  // accessing the component's props
  const { el, children, class: _, config, ...props } = $props();

  // hook to initialize the CreativeEditorSDK component
  onMount(() => {
    // integrate the configs read from props with the default ones
    const ceSDKConfig = {
      ...defaultConfig,
      ...config
    };

    try {
      // initialize the CreativeEditorSDK instance in the container element
      // using the given config
      CreativeEditorSDK.create(container, ceSDKConfig).then(
        async (instance) => {
          cesdk = instance;

          // do something with the instance of CreativeEditor SDK (e.g., populate
          // the asset library with default / demo asset sources)
          await Promise.all([
            cesdk.addDefaultAssetSources(),
            cesdk.addDemoAssetSources({ sceneMode: 'Design' })
          ]);

          // create a new design scene in the editor
          await cesdk.createDesignScene();
        }
      );
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
