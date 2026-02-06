import CreativeEngine from '@cesdk/node';
import { writeFile, mkdir } from 'fs/promises';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Adjust Audio Playback Speed
 *
 * Demonstrates audio playback speed adjustment in CE.SDK:
 * - Loading audio files
 * - Adjusting playback speed with setPlaybackSpeed
 * - Three speed presets: slow-motion (0.5x), normal (1.0x), and maximum (3.0x)
 * - Understanding how speed affects duration
 */

const engine = await CreativeEngine.init({});

try {
  // Create a scene with a page for audio content
  engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(engine.scene.get()!, page);

  // Use a sample audio file
  const audioUri =
    'https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a';

  // Create an audio block and load the audio file
  const audioBlock = engine.block.create('audio');
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Wait for audio resource to load
  await engine.block.forceLoadAVResource(audioBlock);

  // Slow Motion Audio (0.5x - half speed, doubles duration)
  const slowAudioBlock = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, slowAudioBlock);
  engine.block.setTimeOffset(slowAudioBlock, 0);
  engine.block.setPlaybackSpeed(slowAudioBlock, 0.5);

  // Normal Speed Audio (1.0x - original playback rate)
  const normalAudioBlock = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, normalAudioBlock);
  engine.block.setTimeOffset(normalAudioBlock, 5);
  engine.block.setPlaybackSpeed(normalAudioBlock, 1.0);

  // Query current speed to verify the change
  const currentSpeed = engine.block.getPlaybackSpeed(normalAudioBlock);
  console.log(`Normal speed block set to: ${currentSpeed}x`);

  // Maximum Speed Audio (3.0x - triple speed, reduces duration to 1/3)
  const maxSpeedAudioBlock = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, maxSpeedAudioBlock);
  engine.block.setTimeOffset(maxSpeedAudioBlock, 10);
  engine.block.setPlaybackSpeed(maxSpeedAudioBlock, 3.0);

  // Log duration changes to demonstrate speed-duration relationship
  const slowDuration = engine.block.getDuration(slowAudioBlock);
  const normalDuration = engine.block.getDuration(normalAudioBlock);
  const maxDuration = engine.block.getDuration(maxSpeedAudioBlock);

  console.log(`Slow motion (0.5x) duration: ${slowDuration.toFixed(2)}s`);
  console.log(`Normal speed (1.0x) duration: ${normalDuration.toFixed(2)}s`);
  console.log(`Maximum speed (3.0x) duration: ${maxDuration.toFixed(2)}s`);

  // Remove the original audio block (we only need the duplicates)
  engine.block.destroy(audioBlock);

  // Export the scene to a .scene file
  const sceneContent = await engine.scene.saveToString();
  await mkdir('output', { recursive: true });
  await writeFile('output/audio-speed-adjustment.scene', sceneContent);
  console.log('Scene exported to output/audio-speed-adjustment.scene');

  console.log('Audio playback speed adjustment example complete');
} finally {
  engine.dispose();
}
