import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.12.2/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.12.2/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // Load default assets referenced in the scene
  engine.addDefaultAssetSources();

  // highlight-fetch-string
  const sceneUrl =
    'https://cdn.img.ly/packages/imgly/cesdk-js/1.12.2/assets/templates/cesdk_postcard_1.scene';
  const sceneString = await fetch(sceneUrl)
    .then((response) => { return response.text() });
  // highlight-fetch-string

  // highlight-load
  let scene = await engine.scene.loadFromString(sceneString).then(() => {
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
