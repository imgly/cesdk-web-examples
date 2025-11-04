import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.0-rc.4/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.0-rc.4/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  engine.scene
    .saveToArchive()
    .then((blob) => {
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
