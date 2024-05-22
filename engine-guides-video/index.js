// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.26.1-rc.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.26.1-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
  // highlight-setup
  // highlight-setupScene
  const scene = engine.scene.createVideo();

  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  engine.block.setWidth(page, 1280);
  engine.block.setHeight(page, 720);
  // highlight-setupScene

  // highlight-setPageDuration
  engine.block.setDuration(page, 20);
  // highlight-setPageDuration

  // highlight-assignVideoFill
  const video1 = engine.block.create('graphic');
  engine.block.setShape(video1, engine.block.createShape('rect'));
  const videoFill = engine.block.createFill('video');
  engine.block.setString(
    videoFill,
    'fill/video/fileURI',
    'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4'
  );
  engine.block.setFill(video1, videoFill);

  const video2 = engine.block.create('graphic');
  engine.block.setShape(video2, engine.block.createShape('rect'));
  const videoFill2 = engine.block.createFill('video');
  engine.block.setString(
    videoFill2,
    'fill/video/fileURI',
    'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-kampus-production-8154913.mp4'
  );
  engine.block.setFill(video2, videoFill2);
  // highlight-assignVideoFill

  // highlight-addToTrack
  const track = engine.block.create('track');
  engine.block.appendChild(page, track);
  engine.block.appendChild(track, video1);
  engine.block.appendChild(track, video2);
  engine.block.fillParent(track);
  // highlight-addToTrack

  // highlight-setDuration
  engine.block.setDuration(video1, 15);
  // highlight-setDuration

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
  engine.block.appendChild(page, audio);
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
  /* Export page as mp4 video. */
  const mimeType = 'video/mp4';
  const progressCallback = (renderedFrames, encodedFrames, totalFrames) => {
    console.log(
      'Rendered',
      renderedFrames,
      'frames and encoded',
      encodedFrames,
      'frames out of',
      totalFrames
    );
  };
  const blob = await engine.block.exportVideo(
    page,
    mimeType,
    progressCallback,
    {}
  );

  /* Download blob. */
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'exported-video.mp4';
  anchor.click();
  // highlight-exportVideo
});
