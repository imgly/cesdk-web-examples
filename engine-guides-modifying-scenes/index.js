import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.37.0-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.37.0-rc.1/assets'
};

CreativeEngine.init(config).then((engine) => {
  document.getElementById('cesdk_container').append(engine.element);
  // highlight-scene-get-create
  let scene = engine.scene.get();
  /* In engine only mode we have to create our own scene and page. */
  if (!scene) {
    scene = engine.scene.create();
    // highlight-scene-get-create
    // highlight-page-get-create
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
  }
  /* Find all pages in our scene. */
  const pages = engine.block.findByType('page');
  /* Use the first page we found. */
  const page = pages[0];
  // highlight-page-get-create

  // highlight-create-image
  /* Create an graphic block with an image fill and add it to the scene's page. */
  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setFill(block, imageFill);
  // highlight-create-image

  // highlight-image-properties
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );
  /* The content fill mode 'Contain' ensures the entire image is visible. */
  engine.block.setEnum(block, 'contentFill/mode', 'Contain');
  // highlight-image-properties

  // highlight-image-append
  engine.block.appendChild(page, block);
  // highlight-image-append

  // highlight-zoom-page
  /* Zoom the scene's camera on our page. */
  engine.scene.zoomToBlock(page);
  // highlight-zoom-page
});
