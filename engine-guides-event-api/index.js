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
  document.getElementById('cesdk_container').append(engine.element);

  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('star'));
  engine.block.setFill(block, engine.block.createFill('color'));
  engine.block.appendChild(page, block);

  const unsubscribe = engine.event.subscribe([block], (events) => {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      console.log('Event:', event.type, event.block);
      if (engine.block.isValid(event.block)) {
        console.log('Block type:', engine.block.getType(event.block));
      }
    }
  });

  await sleep(1000);
  engine.block.setRotation(block, 0.5 * Math.PI);
  await sleep(1000);
  engine.block.destroy(block);
  await sleep(1000);

  unsubscribe();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
