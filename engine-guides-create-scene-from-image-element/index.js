import CreativeEngine from '@cesdk/engine';

const element = document.getElementById('image-element');
const imageURL = element.src;

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEngine.init(config).then(async (engine) => {
  const scene = await engine.scene.createFromImage(imageURL);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
