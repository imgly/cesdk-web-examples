// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.23.0-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.23.0-rc.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  let scene = await engine.scene.createFromImage(
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );
  // get the graphic block with the image fill
  // Note: In this example we know that the first block since there is only one block in the scene
  // at this point. You might need to filter by fill type if you have multiple blocks.
  const block = engine.block.findByType('graphic')[0];
  // highlight-setup

  // highlight-setMetadata
  engine.block.setMetadata(scene, 'author', 'img.ly');
  engine.block.setMetadata(block, 'customer_id', '1234567890');

  /* We can even store complex objects */
  const payment = {
    id: 5,
    method: 'credit_card',
    received: true
  };
  engine.block.setMetadata(block, 'payment', JSON.stringify(payment));
  // highlight-setMetadata

  // highlight-getMetadata
  /* This will return 'img.ly' */
  engine.block.getMetadata(scene, 'author');

  /* This will return '1000000' */
  engine.block.getMetadata(block, 'customer_id');
  // highlight-getMetadata

  // highlight-findAllMetadata
  /* This will return ['customer_id'] */
  engine.block.findAllMetadata(block);
  // highlight-findAllMetadata

  // highlight-removeMetadata
  engine.block.removeMetadata(block, 'payment');

  /* This will return false */
  engine.block.hasMetadata(block, 'payment');
  // highlight-removeMetadata

  // highlight-persistence
  /* We save our scene and reload it from scratch */
  const sceneString = await engine.scene.saveToString();
  scene = await engine.scene.loadFromString(sceneString);

  /* This still returns 'img.ly' */
  engine.block.getMetadata(scene, 'author');

  /* And this still returns '1234567890' */
  engine.block.getMetadata(block, 'customer_id');
  // highlight-persistence

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
