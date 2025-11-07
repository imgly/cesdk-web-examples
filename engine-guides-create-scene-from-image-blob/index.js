import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.0/index.js';

const blob = await fetch('https://img.ly/static/ubq_samples/sample_4.jpg').then(
  (response) => response.blob()
);
const objectURL = URL.createObjectURL(blob);

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  const scene = await engine.scene.createFromImage(objectURL);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
