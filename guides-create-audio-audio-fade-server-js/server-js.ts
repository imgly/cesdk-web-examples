import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Fade Audio In and Out
 *
 * Demonstrates audio fades in CE.SDK:
 * - Fading audio in with setAudioFadeIn
 * - Fading audio out with setAudioFadeOut
 * - Shaping a fade with an easing curve
 * - Fading the embedded audio of a video fill
 * - Reading fade settings back through block properties
 */

const engine = await CreativeEngine.init({
});

try {
  // Create a scene with a page to hold the audio and video clips.
  engine.scene.create('DepthStack');
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.setDuration(page, 18);
  engine.block.appendChild(engine.scene.get()!, page);

  const audioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';
  const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

  // Create an audio block and load the audio file.
  const audioBlock = engine.block.create('audio');
  engine.block.appendChild(page, audioBlock);
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Wait for the resource so the block reports its real metadata.
  await engine.block.forceLoadAVResource(audioBlock);

  engine.block.setTimeOffset(audioBlock, 0);
  engine.block.setDuration(audioBlock, 8);

  // Ramp the audio up from silence over the first 2 seconds of the block.
  engine.block.setAudioFadeIn(audioBlock, 2);

  // Ramp the audio back down to silence over the last 3 seconds of the block.
  engine.block.setAudioFadeOut(audioBlock, 3);

  // Pass an easing curve to shape the ramp. The default is 'Linear'.
  const easedAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, easedAudio);
  engine.block.setTimeOffset(easedAudio, 9);
  engine.block.setDuration(easedAudio, 8);
  engine.block.setAudioFadeIn(easedAudio, 2, 'EaseInOut');
  engine.block.setAudioFadeOut(easedAudio, 2, 'EaseInOut');

  // Add a video clip on its own track.
  const track = engine.block.create('track');
  engine.block.appendChild(page, track);
  const videoClip = await engine.block.addVideo(videoUri, 1280, 720, {
    timeline: { duration: 8, timeOffset: 0 }
  });
  engine.block.appendChild(track, videoClip);
  engine.block.fillParent(track);

  // Video audio lives on the video fill, so the fade is set on the fill.
  const videoFill = engine.block.getFill(videoClip);
  await engine.block.forceLoadAVResource(videoFill);

  engine.block.setAudioFadeIn(videoFill, 1.5);
  engine.block.setAudioFadeOut(videoFill, 1.5);

  // Fades are block properties, so they read back through getDouble and getEnum.
  const fadeInDuration = engine.block.getDouble(
    easedAudio,
    'playback/fadeIn/duration'
  );
  const fadeInEasing = engine.block.getEnum(
    easedAudio,
    'playback/fadeIn/easing'
  );
  const fadeOutDuration = engine.block.getDouble(
    easedAudio,
    'playback/fadeOut/duration'
  );

  console.log(`Fade in: ${fadeInDuration}s (${fadeInEasing})`);
  console.log(`Fade out: ${fadeOutDuration}s`);

  // A duration of 0 removes a fade again.
  engine.block.setAudioFadeOut(easedAudio, 0);

  console.log('Audio fade example complete');
} finally {
  engine.dispose();
}
