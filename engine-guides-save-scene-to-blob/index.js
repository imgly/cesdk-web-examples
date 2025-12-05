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
