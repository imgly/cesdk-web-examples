import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.39.0/index.js';

// highlight-blob
const blob = await fetch('https://img.ly/static/ubq_samples/sample_4.jpg').then(
  (response) => response.blob()
);
// highlight-blob
// highlight-objectURL
const objectURL = URL.createObjectURL(blob);
// highlight-objectURL

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.39.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-initialImageURL
  let scene = await engine.scene.createFromImage(objectURL);
  // highlight-initialImageURL

  // highlight-find-findByType
  // Find the automatically added graphic block in the scene that contains the image fill.
  const block = engine.block.findByType('graphic')[0];
  // highlight-find-findByType

  // highlight-set-opacity
  // Change its opacity.
  engine.block.setOpacity(block, 0.5);
  // highlight-set-opacity

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
