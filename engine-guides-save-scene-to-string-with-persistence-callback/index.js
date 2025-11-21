import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  const alreadyPersistedUris = {};
  engine.scene
    .saveToString(['http', 'https'], async (uri, hash) => {
      let persistedUri = alreadyPersistedUris[hash];
      if (!persistedUri) {
        persistedUri = `http://example.com/${uri.split('://')[1]}`;
        alreadyPersistedUris[hash] = persistedUri;
        engine.getResourceData(uri, 10000000, async (blob) => {
          try {
            await fetch(persistedUri, {
              mode: 'no-cors',
              method: 'POST',
              body: blob
            });
          } catch (error) {
            console.error(`Failed to persist ${uri}:`, error);
            persistedUri = uri;
          }
        });
      }
      return persistedUri;
    })
    .then((sceneAsString) => {
      console.log('Save succeeded');
      console.log(sceneAsString);
    })
    .catch((error) => {
      console.error('Save failed', error);
    });
});
