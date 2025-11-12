import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.1-rc.0/index.js';

// Expose CE.SDK globally
window.CreativeEditorSDK = CreativeEditorSDK;

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE, // Replace with a valid license key
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.1-rc.0/assets'
};

// Initialize CE.SDK
window.CreativeEditorSDK.create('#cesdk_container', config).then(
  async (editor) => {
    await editor.addDefaultAssetSources();
    await editor.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await editor.createDesignScene();

    // Access the engine via global variable
    window.editorEngine = editor.engine;

    // Dispose of the editor when done
    // editor.dispose();
  }
);
