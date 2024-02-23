import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.21.1-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.21.1-rc.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-save
  engine.scene
    .saveToString()
    .then((savedSceneString) => {
      // highlight-create-blob
      const blob = new Blob([savedSceneString], {
        type: 'text/plain'
      });
      // highlight-create-blob

      // highlight-create-form-data
      const formData = new FormData();
      formData.append('file', blob);
      fetch('/upload', {
        method: 'POST',
        body: formData
      });
      // highlight-create-form-data
    })
    .catch((error) => {
      console.error('Save failed', error);
    });
  // highlight-save
});
