import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.0/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  await engine.scene.loadFromURL(
    'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
  );

  const reaction = engine.reactor.createReaction();

  const logSelectedElements = () => {
    reaction.track(() => {
      console.log('Selected Elements:', engine.block.findAllSelected());
    });
  };

  const unsubscribe = reaction.subscribe(logSelectedElements);

  logSelectedElements();

  function cleanup() {
    unsubscribe();
    reaction.dispose();
  }
});
