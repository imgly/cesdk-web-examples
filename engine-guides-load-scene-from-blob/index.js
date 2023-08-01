import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.13.1-rc.0-republish-android/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.13.1-rc.0-republish-android/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // Load default assets referenced in the scene
  engine.addDefaultAssetSources();

  // highlight-fetch-blob
  const sceneUrl = 'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene';
  const sceneBlob = await fetch(sceneUrl)
    .then((response) => { return response.blob() });
  // highlight-fetch-blob

  // highlight-read-blob
  const blobString = await sceneBlob.text();
  // highlight-read-blob

  // highlight-load
  let scene = await engine.scene.loadFromString(blobString).then(() => {
    console.log('Load succeeded')

    // highlight-set-text-dropshadow
    let text = engine.block.findByType("text")[0];
    engine.block.setDropShadowEnabled(text, true);
    // highlight-set-text-dropshadow
  }).catch((error) => {
    console.error('Load failed', error)
  });
  // highlight-load

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
