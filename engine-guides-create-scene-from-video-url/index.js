import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.59.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.59.1/assets'
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

