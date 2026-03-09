import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Add Captions
 *
 * Demonstrates adding synchronized captions to video projects:
 * - Importing captions from SRT/VTT files
 * - Creating captions programmatically
 * - Styling captions with typography and background
 * - Saving scenes with captions for later rendering
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a video scene with page configuration
  // The page option creates a page with specified dimensions
  engine.scene.createVideo({
    page: { size: { width: 1920, height: 1080 } }
  });

  const page = engine.block.findByType('page')[0];

  // Set page duration to accommodate video content
  engine.block.setDuration(page, 10);

  // Add a video clip as the base content
  const videoUrl =
    'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';

  const track = engine.block.create('track');
  engine.block.appendChild(page, track);

  const videoClip = await engine.block.addVideo(videoUrl, 1920, 1080, {
    timeline: { duration: 10, timeOffset: 0 }
  });
  engine.block.appendChild(track, videoClip);
  engine.block.fillParent(track);

  // Import captions from SRT file
  // createCaptionsFromURI parses SRT/VTT and creates caption blocks with timing
  const captionSrtUrl = 'https://img.ly/static/examples/captions.srt';
  const captionBlocks = await engine.block.createCaptionsFromURI(captionSrtUrl);

  console.log(`Imported ${captionBlocks.length} captions from SRT file`);

  // Create a caption track and add captions to it
  // Caption tracks organize captions in the timeline
  const captionTrack = engine.block.create('//ly.img.ubq/captionTrack');
  engine.block.appendChild(page, captionTrack);

  // Add each caption block to the track
  for (const captionId of captionBlocks) {
    engine.block.appendChild(captionTrack, captionId);
  }

  console.log(`Caption track created with ${captionBlocks.length} captions`);

  // Read caption properties (text, timing)
  if (captionBlocks.length > 0) {
    const firstCaption = captionBlocks[0];

    const text = engine.block.getString(firstCaption, 'caption/text');
    const offset = engine.block.getTimeOffset(firstCaption);
    const duration = engine.block.getDuration(firstCaption);

    console.log(`First caption: "${text}"`);
    console.log(`  Time: ${offset}s - ${offset + duration}s`);
  }

  // Style all captions with consistent formatting
  for (const captionId of captionBlocks) {
    // Set font size
    engine.block.setFloat(captionId, 'caption/fontSize', 48);

    // Center alignment
    engine.block.setEnum(captionId, 'caption/horizontalAlignment', 'Center');
    engine.block.setEnum(captionId, 'caption/verticalAlignment', 'Bottom');

    // Enable background for readability
    engine.block.setBool(captionId, 'backgroundColor/enabled', true);
    engine.block.setColor(captionId, 'backgroundColor/color', {
      r: 0,
      g: 0,
      b: 0,
      a: 0.7
    });
  }

  console.log('Applied styling to all captions');

  // Position captions at the bottom of the video frame
  // Caption position and size sync across all captions, so we only set it once
  if (captionBlocks.length > 0) {
    const firstCaption = captionBlocks[0];

    // Use percentage-based positioning for responsive layout
    engine.block.setPositionXMode(firstCaption, 'Percent');
    engine.block.setPositionYMode(firstCaption, 'Percent');
    engine.block.setWidthMode(firstCaption, 'Percent');
    engine.block.setHeightMode(firstCaption, 'Percent');

    // Position at bottom center with padding
    engine.block.setPositionX(firstCaption, 0.05); // 5% from left
    engine.block.setPositionY(firstCaption, 0.8); // 80% from top (near bottom)
    engine.block.setWidth(firstCaption, 0.9); // 90% width
    engine.block.setHeight(firstCaption, 0.15); // 15% height

    console.log('Positioned captions at bottom of frame');
  }

  // Create a caption programmatically (in addition to imported ones)
  const manualCaption = engine.block.create('//ly.img.ubq/caption');
  engine.block.appendChild(captionTrack, manualCaption);

  // Set caption text
  engine.block.setString(manualCaption, 'caption/text', 'Manual caption added');

  // Set timing - appears at 8 seconds for 2 seconds
  engine.block.setTimeOffset(manualCaption, 8);
  engine.block.setDuration(manualCaption, 2);

  // Apply same styling
  engine.block.setFloat(manualCaption, 'caption/fontSize', 48);
  engine.block.setEnum(manualCaption, 'caption/horizontalAlignment', 'Center');
  engine.block.setEnum(manualCaption, 'caption/verticalAlignment', 'Bottom');
  engine.block.setBool(manualCaption, 'backgroundColor/enabled', true);
  engine.block.setColor(manualCaption, 'backgroundColor/color', {
    r: 0,
    g: 0,
    b: 0,
    a: 0.7
  });

  console.log('Created manual caption at 8s');

  // Add entry animation to captions
  for (const captionId of captionBlocks) {
    const fadeIn = engine.block.createAnimation('fade');
    engine.block.setDuration(fadeIn, 0.2);
    engine.block.setInAnimation(captionId, fadeIn);
  }

  console.log('Added fade-in animations to captions');

  // Save scene to file for later rendering
  // The scene preserves all caption data, styling, and animations
  const sceneString = await engine.scene.saveToString();

  // Save to output directory
  const outputDir = join(process.cwd(), 'output');
  await mkdir(outputDir, { recursive: true });

  const outputPath = join(outputDir, 'video-with-captions.scene');
  await writeFile(outputPath, sceneString);

  console.log(`Scene saved: ${outputPath}`);

  console.log('');
  console.log('Add Captions guide complete.');
  console.log('Scene created with:');
  console.log(`  - ${captionBlocks.length} imported captions`);
  console.log('  - 1 manually created caption');
  console.log('  - Consistent styling across all captions');
  console.log('  - Fade-in animations');
  console.log('');
  console.log(
    'Use CE.SDK Renderer to export this scene as a video with burned-in captions.'
  );
} finally {
  // Always dispose of the engine to free resources
  engine.dispose();
}
