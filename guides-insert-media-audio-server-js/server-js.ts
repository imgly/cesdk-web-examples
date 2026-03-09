import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Insert Audio
 *
 * Demonstrates inserting audio files into CE.SDK scenes:
 * - Creating audio blocks
 * - Setting audio source URIs
 * - Configuring timeline position (timeOffset, duration)
 * - Controlling playback (volume, mute, loop)
 * - Finding and managing audio blocks
 */

const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
});

try {
  // Create a video scene with a page
  // Audio blocks require a video scene mode
  engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(engine.scene.get()!, page);

  // Sample audio file URL
  const audioUri =
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';

  // Create an audio block
  const audioBlock = engine.block.create('audio');

  // Set the audio source file
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Add the audio block to the page
  engine.block.appendChild(page, audioBlock);

  // Load the audio resource to access its metadata
  await engine.block.forceLoadAVResource(audioBlock);

  // Get the total duration of the audio file
  const totalDuration = engine.block.getAVResourceTotalDuration(audioBlock);
  console.log(`Audio total duration: ${totalDuration.toFixed(2)} seconds`);

  // Set when the audio starts playing on the timeline (in seconds)
  engine.block.setTimeOffset(audioBlock, 0);

  // Set how long the audio plays (in seconds)
  // Here we use the full audio duration
  engine.block.setDuration(audioBlock, totalDuration);

  // Query current timeline position
  const timeOffset = engine.block.getTimeOffset(audioBlock);
  const duration = engine.block.getDuration(audioBlock);
  console.log(`Timeline position: starts at ${timeOffset}s, duration ${duration.toFixed(2)}s`);

  // Set audio volume (0.0 = silent, 1.0 = full volume)
  engine.block.setVolume(audioBlock, 0.8);

  // Query current volume
  const volume = engine.block.getVolume(audioBlock);
  console.log(`Volume: ${(volume * 100).toFixed(0)}%`);

  // Mute audio without changing volume setting
  engine.block.setMuted(audioBlock, true);

  // Check if audio is muted
  const isMuted = engine.block.isMuted(audioBlock);
  console.log(`Audio muted: ${isMuted}`);

  // Unmute the audio
  engine.block.setMuted(audioBlock, false);

  // Enable looping for continuous playback
  engine.block.setLooping(audioBlock, true);

  // Check if looping is enabled
  const isLooping = engine.block.isLooping(audioBlock);
  console.log(`Looping enabled: ${isLooping}`);

  // Find all audio blocks in the scene
  const audioBlocks = engine.block.findByType('audio');
  console.log(`Found ${audioBlocks.length} audio block(s)`);

  // Get the audio source URI from each block
  for (const block of audioBlocks) {
    const sourceUri = engine.block.getString(block, 'audio/fileURI');
    console.log(`Audio source: ${sourceUri}`);
  }

  // Create a second audio block to demonstrate removal
  const tempAudio = engine.block.create('audio');
  engine.block.setString(
    tempAudio,
    'audio/fileURI',
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a'
  );
  engine.block.appendChild(page, tempAudio);

  // Remove the temporary audio block
  engine.block.destroy(tempAudio);
  console.log('Temporary audio block removed');

  // Verify only the original audio block remains
  const remainingBlocks = engine.block.findByType('audio');
  console.log(`Remaining audio blocks: ${remainingBlocks.length}`);

  console.log('Insert audio guide completed successfully');
} finally {
  engine.dispose();
}
