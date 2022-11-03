// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.8.0/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.8.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-setup
  // highlight-setupScene
  const scene = engine.scene.createVideo();
  const stack = engine.block.findByType('stack')[0];

  const page1 = engine.block.create('page');
  const page2 = engine.block.create('page');
  engine.block.appendChild(stack, page1);
  engine.block.appendChild(stack, page2);

  engine.block.setWidth(page1, 1280);
  engine.block.setHeight(page1, 720);
  engine.block.setWidth(page2, 1280);
  engine.block.setHeight(page2, 720);
  // highlight-setupScene

  // highlight-setPageDuration
  /* Show the first page for 4 seconds and the second page for 20 seconds. */
  engine.block.setDuration(page1, 4);
  engine.block.setDuration(page2, 20);
  // highlight-setPageDuration

  // highlight-assignVideoFill
  const rectShape = engine.block.create('shapes/rect');
  engine.block.destroy(engine.block.getFill(rectShape));
  const videoFill = engine.block.createFill('video');
  engine.block.setFill(rectShape, videoFill);

  engine.block.setString(
    videoFill,
    'fill/video/fileURI',
    'https://example.com/video.mp4'
  );

  engine.block.appendChild(page2, rectShape);
  engine.block.setPositionX(rectShape, 0);
  engine.block.setPositionY(rectShape, 0);
  engine.block.setWidth(engine.block.getWidth(page2));
  engine.block.setHeight(engine.block.getHeight(page2));
  // highlight-assignVideoFill

  // highlight-trim
  /* Make sure that the video is loaded before calling the trim APIs. */
  await engine.block.forceLoadAVResource(videoFill);
  engine.block.setTrimOffset(videoFill, 1);
  engine.block.setTrimOffset(videoFill, 10);
  // highlight-trim
  
  // highlight-mute-audio
  engine.block.setBool(videoFill, 'fill/video/muted', true);
  // highlight-mute-audio

  // highlight-audio
  const audio = engine.block.create('audio');
  engine.block.appendChild(scene, audio);
  engine.block.setString(
    audio,
    'audio/fileURI',
    'https://example.com/audio.mp3'
  );
  // highlight-audio
  
  // highlight-timeOffset
  /* Start the audio after two seconds of playback. */
  engine.block.setTimeOffset(audio, 2);
  // highlight-timeOffset
});
