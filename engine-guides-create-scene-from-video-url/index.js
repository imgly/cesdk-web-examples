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
  await engine.scene.createFromVideo(
    'https://img.ly/static/ubq_video_samples/bbb.mp4'
  );

  // Find the automatically added graphic block in the scene that contains the video fill.
  const block = engine.block.findByType('graphic')[0];

  // Change its opacity.
  engine.block.setOpacity(block, 0.5);

  // Start playback
  engine.block.setPlaying(engine.scene.get(), true);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
