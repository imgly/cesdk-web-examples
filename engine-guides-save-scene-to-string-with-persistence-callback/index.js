import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.58.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.58.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  var alreadyPersistedUris = {};
  engine.scene
    .saveToString(['http', 'https'], async (uri, hash) => {
      var persistedUri = alreadyPersistedUris[hash];
      if (!persistedUri) {
        persistedUri = 'http://example.com/' + uri.split('://')[1];
        alreadyPersistedUris[hash] = persistedUri;
        editor.getResourceData(uri, 10000000, async (blob) => {
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
