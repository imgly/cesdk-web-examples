// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.18.1/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.18.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  let scene = await engine.scene.createFromImage('https://img.ly/static/ubq_samples/imgly_logo.jpg');
  const image = engine.block.findByType('image')[0];
  // highlight-setup

  // highlight-setMetadata
  engine.block.setMetadata(scene, 'author', 'img.ly');
  engine.block.setMetadata(image, 'customer_id', '1234567890');

  /* We can even store complex objects */
  const payment = {
    id: 5,
    method: 'credit_card',
    received: true
  };
  engine.block.setMetadata(image, 'payment', JSON.stringify(payment));
  // highlight-setMetadata

  // highlight-getMetadata
  /* This will return 'img.ly' */
  engine.block.getMetadata(scene, 'author');

  /* This will return '1000000' */
  engine.block.getMetadata(image, 'customer_id');
  // highlight-getMetadata

  // highlight-findAllMetadata
  /* This will return ['customer_id'] */
  engine.block.findAllMetadata(image);
  // highlight-findAllMetadata

  // highlight-removeMetadata
  engine.block.removeMetadata(image, 'payment');

  /* This will return false */
  engine.block.hasMetadata(image, 'payment');
  // highlight-removeMetadata

  // highlight-persistence
  /* We save our scene and reload it from scratch */
  const sceneString = await engine.scene.saveToString();
  scene = await engine.scene.loadFromString(sceneString);

  /* This still returns 'img.ly' */
  engine.block.getMetadata(scene, 'author');

  /* And this still returns '1234567890' */
  engine.block.getMetadata(image, 'customer_id');
  // highlight-persistence

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
