import CreativeEditorSDK from '@cesdk/cesdk-js';

// Expose CE.SDK globally
window.CreativeEditorSDK = CreativeEditorSDK;

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE, // Replace with a valid license key
  userId: 'guides-user',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

// Initialize CE.SDK
window.CreativeEditorSDK.create('#cesdk_container', config).then(
  async (editor) => {
    await editor.addDefaultAssetSources();
    await editor.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await editor.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    // Access the engine via global variable
    window.editorEngine = editor.engine;

    // Dispose of the editor when done
    // editor.dispose();
  }
);
