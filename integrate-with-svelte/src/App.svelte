<script>
  import CreativeEditorSDK from './lib/CreativeEditorSDK.svelte';
  const config = {
    license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
    userId: 'guides-user',
    // Enable local uploads in Asset Library
    callbacks: { onUpload: 'local' }
  };
</script>

<CreativeEditorSDK {config} />
