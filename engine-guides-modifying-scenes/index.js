import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.43.0-rc.3/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.43.0-rc.3/assets'
};

CreativeEngine.init(config).then((engine) => {
  document.getElementById('cesdk_container').append(engine.element);
  let scene = engine.scene.get();
  /* In engine only mode we have to create our own scene and page. */
  if (!scene) {
    scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
  }
  /* Find all pages in our scene. */
  const pages = engine.block.findByType('page');
  /* Use the first page we found. */
  const page = pages[0];

  /* Create an graphic block with an image fill and add it to the scene's page. */
  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setFill(block, imageFill);

  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );
  /* The content fill mode 'Contain' ensures the entire image is visible. */
  engine.block.setEnum(block, 'contentFill/mode', 'Contain');

  engine.block.appendChild(page, block);

  /* Zoom the scene's camera on our page. */
  engine.scene.zoomToBlock(page);
});
