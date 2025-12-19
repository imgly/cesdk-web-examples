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
  // Load default assets referenced in the scene
  engine.addDefaultAssetSources();

  const sceneUrl =
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene';
  const sceneString = await fetch(sceneUrl).then((response) => {
    return response.text();
  });

  const scene = await engine.scene
    .loadFromString(sceneString)
    .then(() => {
      console.log('Load succeeded');

      const text = engine.block.findByType('text')[0];
      engine.block.setDropShadowEnabled(text, true);
    })
    .catch((error) => {
      console.error('Load failed', error);
    });

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
