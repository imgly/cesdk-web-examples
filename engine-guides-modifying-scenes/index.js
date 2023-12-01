import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.18.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.18.0/assets'
};

CreativeEngine.init(config, document.getElementById('cesdk_canvas')).then(
  (instance) => {
    // highlight-scene-get-create
    let scene = instance.scene.get();
    /* In engine only mode we have to create our own scene and page. */
    if (!scene) {
      scene = instance.scene.create();
      // highlight-scene-get-create
      // highlight-page-get-create
      const page = instance.block.create('page');
      instance.block.appendChild(scene, page);
    }
    /* Find all pages in our scene. */
    const pages = instance.block.findByType('page');
    /* Use the first page we found. */
    const page = pages[0];
    // highlight-page-get-create

    // highlight-create-image
    /* Create an graphic block with an image fill and add it to the scene's page. */
    const block = instance.block.create('graphic');
    instance.block.setShape(block, instance.block.createShape('rect'));
    instance.block.setFill(block, instance.block.createFill('image'));
    // highlight-create-image

    // highlight-image-properties
    instance.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/imgly_logo.jpg'
    );
    /* The content fill mode 'Contain' ensures the entire image is visible. */
    instance.block.setEnum(block, 'contentFill/mode', 'Contain');
    // highlight-image-properties

    // highlight-image-append
    instance.block.appendChild(page, block);
    // highlight-image-append

    // highlight-zoom-page
    /* Zoom the scene's camera on our page. */
    instance.scene.zoomToBlock(page);
    // highlight-zoom-page
  }
);
