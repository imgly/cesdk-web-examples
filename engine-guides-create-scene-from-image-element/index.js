import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.1-rc.0/index.js';

const element = document.getElementById('image-element');
const imageURL = element.src;

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.1-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  const scene = await engine.scene.createFromImage(imageURL);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
