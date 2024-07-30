import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.32.0-rc.2/index.js';

// Draw the text 'img.ly' to the demo canvas
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
ctx.font = '100px Arial';
ctx.fillText('img.ly', 120, 270);

// highlight-dataURL
const dataURL = canvas.toDataURL();
// highlight-dataURL

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.32.0-rc.2/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-initialImageURL
  let scene = await engine.scene.createFromImage(dataURL);
  // highlight-initialImageURL

  // highlight-find-block
  // Find the automatically added graphic block with an image fill in the scene.
  const block = engine.block.findByType('graphic')[0];
  // highlight-find-block

  // highlight-set-opacity
  // Change its opacity.
  engine.block.setOpacity(block, 0.5);
  // highlight-set-opacity

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
