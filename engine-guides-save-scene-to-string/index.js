import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.26.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.26.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-save
  engine.scene
    .saveToString()
    .then((sceneAsString) => {
      console.log('Save succeeded');
      // highlight-result
      console.log(sceneAsString);
      // highlight-result
    })
    .catch((error) => {
      console.error('Save failed', error);
    });
  // highlight-save
});
