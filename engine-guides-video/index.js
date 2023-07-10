// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.13.1-rc.0/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.13.1-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
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
    'https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4'
  );

  engine.block.appendChild(page2, rectShape);
  engine.block.setPositionX(rectShape, 0);
  engine.block.setPositionY(rectShape, 0);
  engine.block.setWidth(rectShape, engine.block.getWidth(page2));
  engine.block.setHeight(rectShape, engine.block.getHeight(page2));
  // highlight-assignVideoFill

  // highlight-trim
  /* Make sure that the video is loaded before calling the trim APIs. */
  await engine.block.forceLoadAVResource(videoFill);
  engine.block.setTrimOffset(videoFill, 1);
  engine.block.setTrimLength(videoFill, 10);
  // highlight-trim

  // highlight-looping
  engine.block.setLooping(videoFill, true);

  // highlight-mute-audio
  engine.block.setMuted(videoFill, true);

  // highlight-audio
  const audio = engine.block.create('audio');
  engine.block.appendChild(scene, audio);
  engine.block.setString(
    audio,
    'audio/fileURI',
    'https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a'
  );
  // highlight-audio

  // highlight-audio-volume
  /* Set the volume level to 70%. */
  engine.block.setVolume(audio, 0.7);
  // highlight-audio-volume

  // highlight-timeOffset
  /* Start the audio after two seconds of playback. */
  engine.block.setTimeOffset(audio, 2);
  // highlight-timeOffset

  // highlight-audioDuration
  /* Give the Audio block a duration of 7 seconds. */
  engine.block.setDuration(audio, 7);
  // highlight-audioDuration

  // highlight-exportVideo
  /* Export scene as mp4 video. */
  const mimeType = 'video/mp4';
  const progressCallback = (renderedFrames, encodedFrames, totalFrames) => {
    console.log('Rendered', renderedFrames, 'frames and encoded', encodedFrames, 'frames out of', totalFrames);
  };
  const blob = await engine.block.exportVideo(scene, mimeType, progressCallback, {});

  /* Download blob. */
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'exported-video.mp4';
  anchor.click();
  // highlight-exportVideo
});
