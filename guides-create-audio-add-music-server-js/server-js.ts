import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Add Music
 *
 * Demonstrates adding background music to video projects:
 * - Creating audio blocks programmatically
 * - Setting audio source URIs
 * - Configuring timeline position and duration
 * - Setting volume levels
 * - Managing multiple audio blocks
 */

const engine = await CreativeEngine.init({});

try {
  // Create a scene with a page for audio content
  engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(engine.scene.get()!, page);

  // Set page duration for timeline (30 seconds)
  engine.block.setDuration(page, 30);

  // Create an audio block for background music
  const audioBlock = engine.block.create('audio');

  // Set the audio source file
  const audioUri =
    'https://cdn.img.ly/assets/demo/v2/ly.img.audio/audios/far_from_home.m4a';
  engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

  // Append audio to the page (makes it part of the timeline)
  engine.block.appendChild(page, audioBlock);

  // Wait for audio to load to get duration
  await engine.block.forceLoadAVResource(audioBlock);

  // Get the total duration of the audio file
  const totalDuration = engine.block.getAVResourceTotalDuration(audioBlock);
  console.log('Audio total duration:', totalDuration.toFixed(2), 'seconds');

  // Set when the audio starts on the timeline (0 = beginning)
  engine.block.setTimeOffset(audioBlock, 0);

  // Set how long the audio plays (use full duration or page duration)
  const playbackDuration = Math.min(totalDuration, 30);
  engine.block.setDuration(audioBlock, playbackDuration);

  // Set the audio volume (0.0 = mute, 1.0 = full volume)
  engine.block.setVolume(audioBlock, 0.8);

  // Get current volume
  const currentVolume = engine.block.getVolume(audioBlock);
  console.log('Audio volume:', `${(currentVolume * 100).toFixed(0)}%`);

  // Add a second audio track with different settings
  const secondAudioBlock = engine.block.create('audio');
  const secondAudioUri =
    'https://cdn.img.ly/assets/demo/v2/ly.img.audio/audios/dance_harder.m4a';
  engine.block.setString(secondAudioBlock, 'audio/fileURI', secondAudioUri);
  engine.block.appendChild(page, secondAudioBlock);

  // Load and configure the second audio
  await engine.block.forceLoadAVResource(secondAudioBlock);
  const secondDuration = engine.block.getAVResourceTotalDuration(secondAudioBlock);

  // Start second audio after the first one ends, at lower volume
  engine.block.setTimeOffset(secondAudioBlock, playbackDuration);
  engine.block.setDuration(secondAudioBlock, Math.min(secondDuration, 15));
  engine.block.setVolume(secondAudioBlock, 0.5);

  // Find all audio blocks in the scene
  const allAudioBlocks = engine.block.findByType('audio');
  console.log('\nTotal audio blocks:', allAudioBlocks.length);

  // Get information about each audio block
  allAudioBlocks.forEach((block, index) => {
    const uri = engine.block.getString(block, 'audio/fileURI');
    const timeOffset = engine.block.getTimeOffset(block);
    const duration = engine.block.getDuration(block);
    const volume = engine.block.getVolume(block);

    console.log(`\nAudio block ${index + 1}:`);
    console.log(`  File: ${uri.split('/').pop()}`);
    console.log(`  Time offset: ${timeOffset.toFixed(2)}s`);
    console.log(`  Duration: ${duration.toFixed(2)}s`);
    console.log(`  Volume: ${(volume * 100).toFixed(0)}%`);
  });

  // Demonstrate removing an audio block
  if (allAudioBlocks.length > 1) {
    const blockToRemove = allAudioBlocks[1];

    // Destroy the block to remove it and free resources
    engine.block.destroy(blockToRemove);

    console.log('\nRemoved second audio block');
    console.log(
      'Remaining audio blocks:',
      engine.block.findByType('audio').length
    );
  }

  // Export the scene to a file
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Save the scene as a .scene file for later use or rendering
  const sceneString = await engine.scene.saveToString();
  writeFileSync(`${outputDir}/scene-with-audio.scene`, sceneString);

  console.log('\nScene saved to output/scene-with-audio.scene');
  console.log(
    'The scene contains audio configuration that can be rendered using the CE.SDK Renderer.'
  );

  console.log('\nAdd Music guide complete!');
} finally {
  engine.dispose();
}
