import CreativeEngine from '@cesdk/engine';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
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
