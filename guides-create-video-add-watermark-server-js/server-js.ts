import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Add Watermark to Video
 *
 * Demonstrates adding text and image watermarks to videos:
 * - Creating text watermarks with styling and drop shadows
 * - Creating image watermarks from logos
 * - Positioning watermarks on the canvas
 * - Setting watermark duration to match video timeline
 * - Configuring opacity and blend modes
 * - Saving the watermarked scene for rendering
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a video scene and load a sample video
  const videoUrl = 'https://img.ly/static/ubq_video_samples/bbb.mp4';
  await engine.scene.createFromVideo(videoUrl);

  // Get the page and its properties
  const page = engine.scene.getCurrentPage()!;
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);

  // Get the video duration from the page (set automatically from video)
  const videoDuration = engine.block.getDuration(page);
  console.log('Video duration:', videoDuration, 'seconds');
  console.log('Page dimensions:', pageWidth, 'x', pageHeight);

  // ===== TEXT WATERMARK =====

  // Create a text block for the watermark
  const textWatermark = engine.block.create('text');

  // Use Auto sizing so the text block grows to fit its content
  engine.block.setWidthMode(textWatermark, 'Auto');
  engine.block.setHeightMode(textWatermark, 'Auto');

  // Set the watermark text content
  engine.block.replaceText(textWatermark, 'All rights reserved 2025');

  // Position in bottom-left corner with padding
  const textPadding = 20;
  engine.block.setPositionX(textWatermark, textPadding);
  engine.block.setPositionY(textWatermark, pageHeight - textPadding - 20);

  // Style the text watermark
  engine.block.setFloat(textWatermark, 'text/fontSize', 14);
  engine.block.setTextColor(textWatermark, { r: 1, g: 1, b: 1, a: 1 }); // White text

  // Set text alignment
  engine.block.setEnum(textWatermark, 'text/horizontalAlignment', 'Left');

  // Set opacity for subtle appearance
  engine.block.setOpacity(textWatermark, 0.7);

  // Add drop shadow for visibility across different backgrounds
  engine.block.setDropShadowEnabled(textWatermark, true);
  engine.block.setDropShadowColor(textWatermark, { r: 0, g: 0, b: 0, a: 0.8 });
  engine.block.setDropShadowOffsetX(textWatermark, 2);
  engine.block.setDropShadowOffsetY(textWatermark, 2);
  engine.block.setDropShadowBlurRadiusX(textWatermark, 4);
  engine.block.setDropShadowBlurRadiusY(textWatermark, 4);

  // Set the text watermark duration to match the video
  engine.block.setDuration(textWatermark, videoDuration);
  engine.block.setTimeOffset(textWatermark, 0);

  // Add the text watermark to the page
  engine.block.appendChild(page, textWatermark);

  console.log('Text watermark created and added to timeline');

  // ===== IMAGE WATERMARK (LOGO) =====

  // Create a graphic block for the logo watermark
  const logoWatermark = engine.block.create('graphic');

  // Create a rectangular shape for the logo
  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(logoWatermark, rectShape);

  // Create an image fill with the logo
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/imgly_logo.jpg'
  );
  engine.block.setFill(logoWatermark, imageFill);

  // Set content fill mode to contain so the logo fits within bounds
  engine.block.setContentFillMode(logoWatermark, 'Contain');

  // Size and position the logo in the top-right corner
  const logoSize = 80;
  const logoPadding = 20;
  engine.block.setWidth(logoWatermark, logoSize);
  engine.block.setHeight(logoWatermark, logoSize);
  engine.block.setPositionX(logoWatermark, pageWidth - logoSize - logoPadding);
  engine.block.setPositionY(logoWatermark, logoPadding);

  // Set opacity for the logo watermark
  engine.block.setOpacity(logoWatermark, 0.6);

  // Set blend mode for better integration with video content
  engine.block.setBlendMode(logoWatermark, 'Normal');

  // Set the logo watermark duration to match the video
  engine.block.setDuration(logoWatermark, videoDuration);
  engine.block.setTimeOffset(logoWatermark, 0);

  // Add the logo watermark to the page
  engine.block.appendChild(page, logoWatermark);

  console.log('Logo watermark created and added to timeline');

  // Save the watermarked scene
  // Video export is not supported in Node.js, so we save the scene as JSON
  // The saved scene can be rendered using CE.SDK Renderer
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const sceneString = await engine.scene.saveToString();
  writeFileSync(`${outputDir}/watermarked-video.scene`, sceneString);

  console.log('');
  console.log(
    'Watermarked video scene saved to output/watermarked-video.scene'
  );
  console.log('');
  console.log('Scene contains:');
  console.log('  - Text watermark: "All rights reserved 2025" (bottom-left)');
  console.log('  - Logo watermark: IMG.LY logo (top-right)');
  console.log('  - Both watermarks span the full video duration');
  console.log('');
  console.log('To render the video, use CE.SDK Renderer:');
  console.log('  https://img.ly/docs/cesdk/renderer/');
} finally {
  // Always dispose of the engine to free resources
  engine.dispose();
}
