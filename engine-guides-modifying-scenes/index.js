import CreativeEngine from '@cesdk/engine';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
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
