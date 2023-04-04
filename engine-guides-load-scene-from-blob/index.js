import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.11.0-preview.2/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.11.0-preview.2/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-fetch-blob
  const sceneBlob = await fetch(sceneUrl)
    .then((response) => { return response.blob() });
  const sceneUrl =
    'https://cdn.img.ly/packages/imgly/cesdk-js/1.11.0-preview.2/assets/templates/cesdk_postcard_1.scene';
  // highlight-fetch-blob

  // highlight-read-blob
  const blobString = await sceneBlob.text();
  // highlight-read-blob

  // highlight-load
  let scene = await engine.scene.loadFromString(blobString).then(() => {
    console.log('Load succeeded')

    // highlight-set-text-dropshadow
    let text = cesdk.engine.block.findByType("text")[0];
    cesdk.engine.block.setDropShadowEnabled(text, true);
    // highlight-set-text-dropshadow
  }).catch((error) => {
    console.error('Load failed', error)
  });
  // highlight-load
});
