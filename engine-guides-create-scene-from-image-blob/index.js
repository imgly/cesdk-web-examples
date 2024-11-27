import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.40.0-rc.2/index.js';

const blob = await fetch('https://img.ly/static/ubq_samples/sample_4.jpg').then(
  (response) => response.blob()
);
const objectURL = URL.createObjectURL(blob);

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.40.0-rc.2/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  let scene = await engine.scene.createFromImage(objectURL);

  // Find the automatically added graphic block in the scene that contains the image fill.
  const block = engine.block.findByType('graphic')[0];

  // Change its opacity.
  engine.block.setOpacity(block, 0.5);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
