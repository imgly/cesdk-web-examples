import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.46.0-rc.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.46.0-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // Load default assets referenced in the scene
  engine.addDefaultAssetSources();

  const sceneUrl =
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene';
  const sceneString = await fetch(sceneUrl).then((response) => {
    return response.text();
  });

  let scene = await engine.scene
    .loadFromString(sceneString)
    .then(() => {
      console.log('Load succeeded');

      let text = engine.block.findByType('text')[0];
      engine.block.setDropShadowEnabled(text, true);
    })
    .catch((error) => {
      console.error('Load failed', error);
    });

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
