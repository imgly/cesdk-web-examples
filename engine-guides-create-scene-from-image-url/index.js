import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.17.0/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.17.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-createFromImage
  await engine.scene.createFromImage('https://img.ly/static/ubq_samples/sample_4.jpg');

  // highlight-findByType
  // Find the automatically added image block in the scene.
  const block = engine.block.findByType('image')[0];
  // highlight-findByType

  // highlight-setOpacity
  // Change its opacity.
  engine.block.setOpacity(block, 0.5);
  // highlight-setOpacity

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
