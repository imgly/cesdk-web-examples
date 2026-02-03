import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

config();

/**
 * CE.SDK Server Guide: Loop Audio
 *
 * Demonstrates audio looping in CE.SDK:
 * - Enabling looping with setLooping
 * - Querying looping state with isLooping
 * - Disabling looping for one-time playback
 * - Combining looping with trim settings
 */

const engine = await CreativeEngine.init({});

try {
  // Create a scene with a page for audio content
  engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(engine.scene.get()!, page);

  // Set page duration for timeline content
  engine.block.setDuration(page, 30);

  // Use a sample audio file
  const audioUri =
    'https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a';

  // Create an audio block and load the audio file
  const audioBlock = engine.block.create('audio');
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Load the audio resource to access metadata
  await engine.block.forceLoadAVResource(audioBlock);

  // Get the total audio duration
  const audioDuration = engine.block.getDouble(
    audioBlock,
    'audio/totalDuration'
  );
  console.log(`Audio duration: ${audioDuration.toFixed(2)} seconds`);

  // Enable looping for seamless repeating playback
  const loopingAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, loopingAudio);
  engine.block.setTimeOffset(loopingAudio, 0);
  engine.block.setLooping(loopingAudio, true);
  engine.block.setDuration(loopingAudio, 15);

  console.log('Looping audio: enabled, duration 15 seconds');

  // Check if audio block is set to loop
  const isLooping = engine.block.isLooping(loopingAudio);
  console.log(`Is looping: ${isLooping}`);

  // Create non-looping audio for one-time playback
  const nonLoopingAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, nonLoopingAudio);
  engine.block.setTimeOffset(nonLoopingAudio, 16);
  engine.block.setLooping(nonLoopingAudio, false);
  engine.block.setDuration(nonLoopingAudio, 12);

  console.log('Non-looping audio: plays once and stops');

  // Combine looping with trim settings for short repeating segments
  const trimmedLoopAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, trimmedLoopAudio);
  engine.block.setTimeOffset(trimmedLoopAudio, 29);

  // Trim to a 2-second segment starting at 1 second
  engine.block.setTrimOffset(trimmedLoopAudio, 1.0);
  engine.block.setTrimLength(trimmedLoopAudio, 2.0);

  // Enable looping and set duration longer than trim length
  engine.block.setLooping(trimmedLoopAudio, true);
  engine.block.setDuration(trimmedLoopAudio, 8.0);

  console.log('Trimmed loop: 2s segment loops 4 times to fill 8s duration');

  // Remove the original audio block (we only need the duplicates)
  engine.block.destroy(audioBlock);

  // Display summary
  console.log('\n--- Audio Looping Summary ---');
  console.log(
    `Looping audio block: looping=${engine.block.isLooping(loopingAudio)}`
  );
  console.log(
    `Non-looping audio block: looping=${engine.block.isLooping(nonLoopingAudio)}`
  );
  console.log(
    `Trimmed looping audio block: looping=${engine.block.isLooping(trimmedLoopAudio)}`
  );

  // Save the scene as a .scene file for later use or rendering
  console.log('\nSaving scene...');

  const sceneString = await engine.scene.saveToString();

  // Ensure output directory exists
  if (!existsSync('output')) {
    mkdirSync('output');
  }

  // Save to file
  writeFileSync('output/audio-looping.scene', sceneString);
  console.log('Exported to output/audio-looping.scene');

  console.log('\nAudio looping example complete');
} finally {
  engine.dispose();
}
