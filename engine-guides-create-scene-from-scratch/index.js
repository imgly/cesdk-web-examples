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
  const scene = await engine.scene.create();

  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('star'));
  engine.block.setFill(block, engine.block.createFill('color'));
  engine.block.appendChild(page, block);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
