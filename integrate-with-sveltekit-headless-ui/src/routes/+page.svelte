<script>
  // other imports...

  import { browser } from "$app/environment"; // true only if the app is running in the browser

  // use the browser flag to conditionally render client-side components
  let isClient = browser;

  let CustomEditor;
  if (isClient) {
    // dynamically import the CustomEditor component only in the browser
    import("$lib").then((module) => {
      CustomEditor = module.CustomEditor;
    });
  }
</script>

<main>
  <!-- other components... -->
  {#if isClient && CustomEditor}
    <CustomEditor />
  {/if}
  <!-- other components... -->
</main>

<style>
  /* custom styling... */
</style>
