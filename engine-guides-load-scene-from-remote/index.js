import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.12.0-rc.0/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.12.0-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-url
  const sceneUrl =
    'https://cdn.img.ly/packages/imgly/cesdk-js/1.12.0-rc.0/assets/templates/cesdk_postcard_1.scene';
  // highlight-url

  // highlight-load
  let scene = await engine.scene.loadFromURL(sceneUrl).then(() => {
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
