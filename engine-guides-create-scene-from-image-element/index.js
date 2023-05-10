import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.11.0/index.js';

// highlight-element
const element = document.getElementById("image-element");
const imageURL = element.src;
// highlight-element

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.11.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-initialImageURL
  let scene = await engine.scene.createFromImage(imageURL);
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
