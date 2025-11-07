import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.0/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  engine.scene
    .saveToString()
    .then((sceneAsString) => {
      console.log('Save succeeded');
      console.log(sceneAsString);
    })
    .catch((error) => {
      console.error('Save failed', error);
    });
});
