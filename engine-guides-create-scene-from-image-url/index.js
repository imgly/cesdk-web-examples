import CreativeEngine from '@cesdk/engine';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEngine.init(config).then(async (engine) => {
  await engine.scene.createFromImage(
    'https://img.ly/static/ubq_samples/sample_4.jpg'
  );

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
