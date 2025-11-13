import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.1/index.js';

// Draw the text 'img.ly' to the demo canvas
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
ctx.font = '100px Arial';
ctx.fillText('img.ly', 120, 270);

const dataURL = canvas.toDataURL();

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  const scene = await engine.scene.createFromImage(dataURL);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
