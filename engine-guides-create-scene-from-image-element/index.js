import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.57.0/index.js';

const element = document.getElementById('image-element');
const imageURL = element.src;

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.57.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  let scene = await engine.scene.createFromImage(imageURL);

  // Find the automatically added graphic block with an image fill in the scene.
  const block = engine.block.findByType('graphic')[0];

  // Change its opacity.
  engine.block.setOpacity(block, 0.5);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
