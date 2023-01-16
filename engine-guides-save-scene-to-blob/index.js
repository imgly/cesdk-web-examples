import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.9.2/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.9.2/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-save
  engine.scene.saveToString().then((savedSceneString) => {
    // highlight-create-blob
    const blob = new Blob([savedSceneString], {
      type: 'text/plain'
    });
    // highlight-create-blob

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
