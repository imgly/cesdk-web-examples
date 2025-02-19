import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.6/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.6/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-save
  engine.scene.saveToArchive().then((blob) => {
    // highlight-create-form-data
    const formData = new FormData();
    formData.append("file", blob);
    fetch("/upload", {
      method: "POST",
      body: formData
    });
    // highlight-create-form-data
  }).catch((error) => {
    console.error('Save failed', error)
  });
  // highlight-save
});
