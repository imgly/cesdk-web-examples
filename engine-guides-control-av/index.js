import CreativeEngine from '@cesdk/engine';

const config = {
  license: 'insert-your-license',
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  }),
};

async function controlAudioVideo() {
  const engine = await CreativeEngine.init(config);
  document.getElementById('cesdk_container')?.append(engine.element);

  // Setup a minimal video scene
  const scene = await engine.scene.createVideo();
  const page = engine.block.create('page');
  await engine.block.appendChild(scene, page);
  engine.block.setWidth(page, 1280);
  engine.block.setHeight(page, 720);

  // Create a video block in a track
  const videoBlock = engine.block.create('graphic');
  engine.block.setShape(videoBlock, engine.block.createShape('rect'));
  const videoFill = engine.block.createFill('video');
  engine.block.setString(
    videoFill,
    'fill/video/fileURI',
    'https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4'
  );
  engine.block.setFill(videoBlock, videoFill);
  const track = engine.block.create('track');
  await engine.block.appendChild(page, track);
  await engine.block.appendChild(track, videoBlock);
  engine.block.fillParent(track);

  // Create an audio block
  const audio = engine.block.create('audio');
  await engine.block.appendChild(page, audio);
  engine.block.setString(
    audio,
    'audio/fileURI',
    'https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a'
  );

  // Time offset and duration
  engine.block.supportsTimeOffset(audio);
  engine.block.setTimeOffset(audio, 2);
  engine.block.getTimeOffset(audio); /* Returns 2 */

  engine.block.supportsDuration(page);
  engine.block.setDuration(page, 10);
  engine.block.getDuration(page); /* Returns 10 */

  // Duration of the page can be that of a block
  engine.block.supportsPageDurationSource(page, block);
  engine.block.setPageDurationSource(page, block);
  engine.block.isPageDurationSource(block);
  engine.block.getDuration(page); /* Returns duration plus offset of the block */

  // Duration of the page can be the maximum end time of all page child blocks
  engine.block.removePageDurationSource(page);
  engine.block.getDuration(page); /* Returns the maximum end time of all page child blocks */

  // Trim
  engine.block.supportsTrim(videoFill);
  engine.block.setTrimOffset(videoFill, 1);
  engine.block.getTrimOffset(videoFill); /* Returns 1 */
  engine.block.setTrimLength(videoFill, 5);
  engine.block.getTrimLength(videoFill); /* Returns 5 */

  // Playback Control
  engine.block.setPlaying(page, true);
  engine.block.isPlaying(page);

  engine.block.setSoloPlaybackEnabled(videoFill, true);
  engine.block.isSoloPlaybackEnabled(videoFill);

  engine.block.supportsPlaybackTime(page);
  engine.block.setPlaybackTime(page, 1);
  engine.block.getPlaybackTime(page);
  engine.block.isVisibleAtCurrentPlaybackTime(block);

  engine.block.supportsPlaybackControl(videoFill);
  engine.block.setLooping(videoFill, true);
  engine.block.isLooping(videoFill);
  engine.block.setMuted(videoFill, true);
  engine.block.isMuted(videoFill);
  engine.block.setVolume(videoFill, 0.5); /* 50% volume */
  engine.block.getVolume(videoFill);

  // Playback Speed
  engine.block.setPlaybackSpeed(videoFill, 0.5); /* Half speed */
  const currentSpeed = engine.block.getPlaybackSpeed(videoFill); /* 0.5 */
  engine.block.setPlaybackSpeed(videoFill, 2.0); /* Double speed */
  engine.block.setPlaybackSpeed(videoFill, 1.0); /* Normal speed */

  // Resource Control
  await engine.block.forceLoadAVResource(videoFill);
  const isLoaded = engine.block.unstable_isAVResourceLoaded(videoFill);
  engine.block.getAVResourceTotalDuration(videoFill);
  const videoWidth = engine.block.getVideoWidth(videoFill);
  const videoHeight = engine.block.getVideoHeight(videoFill);

  // Thumbnail Previews
  const cancelVideoThumbnailGeneration = engine.block.generateVideoThumbnailSequence(
    videoFill /* video fill or any design block */,
    128 /* thumbnail height, width will be calculated from aspect ratio */,
    0.5 /* begin time */,
    9.5 /* end time */,
    10 /* number of thumbnails to generate */,
    async (frame, width, height, imageData) => {
      const image = await createImageBitmap(imageData);
      // Draw the image...
    }
  );
  const cancelAudioThumbnailGeneration = engine.block.generateAudioThumbnailSequence(
    audio /* audio or video fill */,
    20 /* number of samples per chunk */,
    0.5 /* begin time */,
    9.5 /* end time */,
    10 * 20 /* total number of samples, will produce 10 calls with 20 samples per chunk */,
    2, /* stereo, interleaved samples for the left and right channels */,
    (chunkIndex, chunkSamples) => {
      drawWavePattern(chunkSamples);
    }
  );

  // Piping a native camera stream into the engine
  const pixelStreamFill = engine.block.createFill('pixelStream');
  const video = document.createElement('video');
  engine.block.setNativePixelBuffer(pixelStreamFill, video);

  void cancelVideoThumbnailGeneration;
  void cancelAudioThumbnailGeneration;
}

controlAudioVideo();
