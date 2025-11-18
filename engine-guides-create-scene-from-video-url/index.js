import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.2/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.2/assets'
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
