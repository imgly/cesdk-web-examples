import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.62.0-rc.2/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.62.0-rc.2/assets'
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
