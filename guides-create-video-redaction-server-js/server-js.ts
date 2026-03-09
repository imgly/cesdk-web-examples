import CreativeEngine from '@cesdk/node';
import { mkdir, writeFile } from 'fs/promises';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Video Redaction
 *
 * Demonstrates video redaction techniques in CE.SDK:
 * - Full-block blur for complete video obscuration
 * - Radial blur for circular redaction patterns
 * - Pixelization for mosaic-style censoring
 * - Solid overlays for complete blocking
 * - Time-based redactions
 */

// Video URL for demonstrating redaction scenarios
const VIDEO_URL =
  'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4';

// Duration for each video segment (in seconds)
const SEGMENT_DURATION = 5.0;

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a video scene - required for timeline-based editing
  const pageWidth = 1920;
  const pageHeight = 1080;
  const scene = await engine.scene.createVideo();

  // Create a page for the video scene
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  // Set page to 16:9 landscape (1920x1080 is standard HD video resolution)
  engine.block.setWidth(page, pageWidth);
  engine.block.setHeight(page, pageHeight);

  // Set page duration to accommodate all videos (5 segments x 5 seconds)
  engine.block.setDuration(page, 5 * SEGMENT_DURATION);

  // Create a track to hold the video clips
  const track = engine.block.create('track');
  engine.block.appendChild(page, track);

  // Create video blocks for each redaction technique demonstration
  console.log('Loading video blocks...');

  console.log('  Loading video 1/5 (radial blur)...');
  const radialVideo = await engine.block.addVideo(VIDEO_URL, pageWidth, pageHeight, {
    timeline: { duration: SEGMENT_DURATION, timeOffset: 0 }
  });
  engine.block.appendChild(track, radialVideo);

  console.log('  Loading video 2/5 (full-block blur)...');
  const fullBlurVideo = await engine.block.addVideo(VIDEO_URL, pageWidth, pageHeight, {
    timeline: { duration: SEGMENT_DURATION, timeOffset: SEGMENT_DURATION }
  });
  engine.block.appendChild(track, fullBlurVideo);

  console.log('  Loading video 3/5 (pixelization)...');
  const pixelVideo = await engine.block.addVideo(VIDEO_URL, pageWidth, pageHeight, {
    timeline: { duration: SEGMENT_DURATION, timeOffset: 2 * SEGMENT_DURATION }
  });
  engine.block.appendChild(track, pixelVideo);

  console.log('  Loading video 4/5 (solid overlay)...');
  const overlayVideo = await engine.block.addVideo(VIDEO_URL, pageWidth, pageHeight, {
    timeline: { duration: SEGMENT_DURATION, timeOffset: 3 * SEGMENT_DURATION }
  });
  engine.block.appendChild(track, overlayVideo);

  console.log('  Loading video 5/5 (time-based blur)...');
  const timedVideo = await engine.block.addVideo(VIDEO_URL, pageWidth, pageHeight, {
    timeline: { duration: SEGMENT_DURATION, timeOffset: 4 * SEGMENT_DURATION }
  });
  engine.block.appendChild(track, timedVideo);

  console.log('All videos loaded.');

  // Resize all track children to fill the page dimensions
  engine.block.fillParent(track);

  // Full-Block Blur: Apply blur to entire video
  // Use this when the entire video content needs obscuring
  console.log('Applying redaction effects...');

  // Check if the block supports blur
  const supportsBlur = engine.block.supportsBlur(fullBlurVideo);
  console.log('Video supports blur:', supportsBlur);

  // Create and apply uniform blur to entire video
  const uniformBlur = engine.block.createBlur('uniform');
  engine.block.setFloat(uniformBlur, 'blur/uniform/intensity', 0.7);
  engine.block.setBlur(fullBlurVideo, uniformBlur);
  engine.block.setBlurEnabled(fullBlurVideo, true);

  // Pixelization: Apply mosaic effect for clearly intentional censoring

  // Check if the block supports effects
  if (engine.block.supportsEffects(pixelVideo)) {
    // Create and apply pixelize effect
    const pixelizeEffect = engine.block.createEffect('pixelize');
    engine.block.setInt(pixelizeEffect, 'effect/pixelize/horizontalPixelSize', 24);
    engine.block.setInt(pixelizeEffect, 'effect/pixelize/verticalPixelSize', 24);
    engine.block.appendEffect(pixelVideo, pixelizeEffect);
    engine.block.setEffectEnabled(pixelizeEffect, true);
  }

  // Solid Overlay: Create opaque shape for complete blocking
  // Best for highly sensitive information like documents or credentials

  // Create a solid rectangle overlay
  const overlay = engine.block.create('//ly.img.ubq/graphic');
  const rectShape = engine.block.createShape('//ly.img.ubq/shape/rect');
  engine.block.setShape(overlay, rectShape);

  // Create solid black fill
  const solidFill = engine.block.createFill('//ly.img.ubq/fill/color');
  engine.block.setColor(solidFill, 'fill/color/value', {
    r: 0.1,
    g: 0.1,
    b: 0.1,
    a: 1.0
  });
  engine.block.setFill(overlay, solidFill);

  // Position and size the overlay
  engine.block.setWidth(overlay, pageWidth * 0.4);
  engine.block.setHeight(overlay, pageHeight * 0.3);
  engine.block.setPositionX(overlay, pageWidth * 0.55);
  engine.block.setPositionY(overlay, pageHeight * 0.65);
  engine.block.setTimeOffset(overlay, 3 * SEGMENT_DURATION);
  engine.block.setDuration(overlay, SEGMENT_DURATION);
  engine.block.appendChild(page, overlay);

  // Time-Based Redaction: Redaction appears only during specific time range

  // Apply blur to the video
  const timedBlur = engine.block.createBlur('uniform');
  engine.block.setFloat(timedBlur, 'blur/uniform/intensity', 0.9);
  engine.block.setBlur(timedVideo, timedBlur);
  engine.block.setBlurEnabled(timedVideo, true);

  // The video is already timed to appear at a specific offset
  // You can adjust timeOffset and duration to control when redaction is visible
  engine.block.setTimeOffset(timedVideo, 4 * SEGMENT_DURATION);
  engine.block.setDuration(timedVideo, SEGMENT_DURATION);

  // Radial Blur: Use radial blur for face-like regions

  // Apply radial blur for circular redaction effect
  const radialBlur = engine.block.createBlur('radial');
  engine.block.setFloat(radialBlur, 'blur/radial/blurRadius', 50);
  engine.block.setFloat(radialBlur, 'blur/radial/radius', 25);
  engine.block.setFloat(radialBlur, 'blur/radial/gradientRadius', 35);
  engine.block.setFloat(radialBlur, 'blur/radial/x', 0.5);
  engine.block.setFloat(radialBlur, 'blur/radial/y', 0.45);
  engine.block.setBlur(radialVideo, radialBlur);
  engine.block.setBlurEnabled(radialVideo, true);

  // Save the scene to a file for later use or export
  await mkdir('output', { recursive: true });
  const sceneData = await engine.scene.saveToString();
  await writeFile('output/redacted-video.scene', sceneData);
  console.log('Scene saved to output/redacted-video.scene');

  console.log('');
  console.log('Video redaction guide complete.');
  console.log('Created scene with 5 redaction techniques:');
  console.log('  1. Radial blur (0-5s)');
  console.log('  2. Full-block blur (5-10s)');
  console.log('  3. Pixelization (10-15s)');
  console.log('  4. Solid overlay (15-20s)');
  console.log('  5. Time-based blur (20-25s)');
} finally {
  // Always dispose of the engine to free resources
  engine.dispose();
}
