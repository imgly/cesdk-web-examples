import CreativeEngine from '@cesdk/engine';

// Draw the text 'img.ly' to the demo canvas
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
ctx.font = '100px Arial';
ctx.fillText('img.ly', 120, 270);

const dataURL = canvas.toDataURL();

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEngine.init(config).then(async (engine) => {
  const scene = await engine.scene.createFromImage(dataURL);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
