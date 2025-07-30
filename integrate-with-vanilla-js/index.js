import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.56.0/index.js';

// Expose CE.SDK globally
window.CreativeEditorSDK = CreativeEditorSDK;

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu', // Replace with a valid license key
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.56.0/assets',
  callbacks: { onUpload: 'local' }
};

// Initialize CE.SDK
window.CreativeEditorSDK.create('#cesdk_container', config).then(
  async (editor) => {
    editor.addDefaultAssetSources();
    editor.addDemoAssetSources({ sceneMode: 'Design' });
    await editor.createDesignScene();

    // Access the engine via global variable
    window.editorEngine = editor.engine;

    // Dispose of the editor when done
    // editor.dispose();
  }
);
