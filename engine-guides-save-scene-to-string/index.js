import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.0-rc.4/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.0-rc.4/assets'
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
