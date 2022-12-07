import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.9.0/index.js';

// highlight-blob
const blob = await fetch('https://img.ly/static/ubq_samples/sample_4.jpg').then((response) => response.blob());
// highlight-blob
// highlight-objectURL
const objectURL = URL.createObjectURL(blob);
// highlight-objectURL

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.9.0/assets',
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-initialImageURL
  let scene = await engine.scene.createFromImage(objectURL);
  // highlight-initialImageURL

  // highlight-find-image
  // Find the automatically added image element in the scene.
  const image = cesdk.engine.block.findByType('image')[0];
  // highlight-find-image

  // highlight-set-opacity
  // Change its opacity.
  cesdk.engine.block.setOpacity(image, 0.5);
  // highlight-set-opacity
});
