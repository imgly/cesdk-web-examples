<script>
  // other imports...

  import { browser } from "$app/environment"; // true only if the app is running in the browser
  // use the browser flag to conditionally render client-side components
  let isClient = browser;

  let CreativeEditorSDK;
  if (isClient) {
    // dynamically import the CreativeEditorSDK component only in the browser
    import("$lib").then(module => {
      CreativeEditorSDK = module.CreativeEditorSDK;
    });
  }
</script>

<main>
  <!-- other components... -->
  {#if isClient && CreativeEditorSDK}
    <CreativeEditorSDK
      config={{
        // Your custom configs here
      }}
    />
  {/if}
  <!-- other components... -->
</main>

<style>
  /* custom styling... */
</style>
