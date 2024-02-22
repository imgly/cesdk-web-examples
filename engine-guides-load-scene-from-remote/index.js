import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.21.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.21.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // Load default assets referenced in the scene
  engine.addDefaultAssetSources();

  // highlight-url
  const sceneUrl =
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene';
  // highlight-url

  // highlight-load
  let scene = await engine.scene
    .loadFromURL(sceneUrl)
    .then(() => {
      console.log('Load succeeded');

      // highlight-set-text-dropshadow
      let text = engine.block.findByType('text')[0];
      engine.block.setDropShadowEnabled(text, true);
      // highlight-set-text-dropshadow
    })
    .catch((error) => {
      console.error('Load failed', error);
    });
  // highlight-load

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
