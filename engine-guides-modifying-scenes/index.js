import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.17.0-rc.0/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.17.0-rc.0/assets'
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
    /* Create an image block and add it to the scene's page. */
    const image = instance.block.create('image');
    // highlight-create-image

    // highlight-image-properties
    instance.block.setString(
      image,
      'image/imageFileURI',
      'https://img.ly/static/ubq_samples/imgly_logo.jpg'
    );
    /* The content fill mode 'Contain' ensures the entire image is visible. */
    instance.block.setEnum(image, 'contentFill/mode', 'Contain');
    // highlight-image-properties

    // highlight-image-append
    instance.block.appendChild(page, image);

    // highlight-zoom-page
    /* Zoom the scene's camera on our page. */
    instance.scene.zoomToBlock(page);
    // highlight-zoom-page
  }
);
