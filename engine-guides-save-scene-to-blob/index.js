import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.1/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.1/assets'
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
