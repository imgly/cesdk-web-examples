<script>
  import CreativeEditorSDK from '@cesdk/cesdk-js';

  function initCESDK(container) {
    const config = {};

    CreativeEditorSDK.init(container, config).then((instance) => {
      /** do something with the instance of CreativeEditor SDK **/
    });
  }
</script>

<div style="height:'100vh';width: '100vw'" use:initCESDK />
