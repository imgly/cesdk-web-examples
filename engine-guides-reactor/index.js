import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.56.0-rc.2/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.56.0-rc.2/assets'
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
