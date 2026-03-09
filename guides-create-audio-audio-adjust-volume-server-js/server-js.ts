import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Adjust Audio Volume
 *
 * Demonstrates audio volume control in CE.SDK:
 * - Setting volume levels with setVolume
 * - Muting and unmuting with setMuted
 * - Querying volume and mute states
 * - Volume levels for multiple audio sources
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
    'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';

  // Create an audio block and load the audio file
  const audioBlock = engine.block.create('audio');
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Wait for audio resource to load
  await engine.block.forceLoadAVResource(audioBlock);

  // Set volume to 80% (0.8 on a 0.0-1.0 scale)
  const fullVolumeAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, fullVolumeAudio);
  engine.block.setTimeOffset(fullVolumeAudio, 0);
  engine.block.setVolume(fullVolumeAudio, 0.8);

  // Set volume to 30% for background music
  const lowVolumeAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, lowVolumeAudio);
  engine.block.setTimeOffset(lowVolumeAudio, 5);
  engine.block.setVolume(lowVolumeAudio, 0.3);

  // Mute an audio block (preserves volume setting)
  const mutedAudio = engine.block.duplicate(audioBlock);
  engine.block.appendChild(page, mutedAudio);
  engine.block.setTimeOffset(mutedAudio, 10);
  engine.block.setVolume(mutedAudio, 1.0);
  engine.block.setMuted(mutedAudio, true);

  // Query current volume and mute states
  const currentVolume = engine.block.getVolume(fullVolumeAudio);
  const isMuted = engine.block.isMuted(mutedAudio);
  const isForceMuted = engine.block.isForceMuted(mutedAudio);

  console.log(`Full volume audio: ${(currentVolume * 100).toFixed(0)}%`);
  console.log(
    `Low volume audio: ${(engine.block.getVolume(lowVolumeAudio) * 100).toFixed(0)}%`
  );
  console.log(
    `Muted audio - isMuted: ${isMuted}, isForceMuted: ${isForceMuted}`
  );

  // Remove the original audio block (we only need the duplicates)
  engine.block.destroy(audioBlock);

  console.log('Audio volume adjustment example complete');
} finally {
  engine.dispose();
}
