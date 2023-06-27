import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.12.2-rc.0/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.12.2-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-createFromVideo
  await engine.scene.createFromVideo('https://img.ly/static/ubq_video_samples/bbb.mp4');

  // highlight-findByType
  // Find the automatically added rect block in the scene that contains the video fill.
  const block = engine.block.findByType('shapes/rect')[0];
  // highlight-findByType

  // highlight-setOpacity
  // Change its opacity.
  engine.block.setOpacity(block, 0.5);
  // highlight-setOpacity
  
  // Start playback
  engine.block.setPlaying(engine.scene.get(), true);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
