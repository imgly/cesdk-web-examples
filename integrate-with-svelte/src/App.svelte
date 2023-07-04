<script>
  import CreativeEditorSDK from './lib/CreativeEditorSDK.svelte';
  const config = {
    // Enable local uploads in Asset Library
    callbacks: { onUpload: 'local' }
  }
</script>

<CreativeEditorSDK config={config}/>