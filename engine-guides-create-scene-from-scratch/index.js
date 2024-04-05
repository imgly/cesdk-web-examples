import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.24.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.24.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-create
  let scene = await engine.scene.create();
  // highlight-create

  // highlight-add-page
  let page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  // highlight-add-page

  // highlight-add-block-with-star-shape
  let block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('star'));
  engine.block.setFill(block, engine.block.createFill('color'));
  engine.block.appendChild(page, block);
  // highlight-add-block-with-star-shape

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
