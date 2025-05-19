import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.51.0-rc.5/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.51.0-rc.5/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  engine.scene
    .saveToString()
    .then((savedSceneString) => {
      const blob = new Blob([savedSceneString], {
        type: 'text/plain'
      });

      const formData = new FormData();
      formData.append('file', blob);
      fetch('/upload', {
        method: 'POST',
        body: formData
      });
    })
    .catch((error) => {
      console.error('Save failed', error);
    });
});
