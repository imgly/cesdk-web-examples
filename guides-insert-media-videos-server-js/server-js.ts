import CreativeEngine from '@cesdk/node';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import 'dotenv/config';

// Helper to prompt user for confirmation
function confirmExport(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Export scene to PNG? (y/n): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  const config = {
    license: process.env.CESDK_LICENSE
  };

  const engine = await CreativeEngine.init(config);

  // Create a Video mode scene - required for the addVideo() convenience API
  engine.scene.createVideo();
  const page = engine.scene.getCurrentPage()!;

  try {
    // Video URL for demonstration
    const videoUrl =
      'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-drone-footage-of-a-surfer-702788.mp4';

    // Using the convenience API - creates a graphic block with video fill automatically
    // This API only works in Video mode scenes
    const videoBlock = await engine.block.addVideo(videoUrl, 800, 450);

    // Position the video on the canvas
    engine.block.setPositionX(videoBlock, 50);
    engine.block.setPositionY(videoBlock, 50);

    console.log('Added video using convenience API');

    // Manual video construction - works in both Design and Video modes
    // Create a graphic block container
    const manualBlock = engine.block.create('graphic');

    // Create and attach a rectangular shape
    const shape = engine.block.createShape('rect');
    engine.block.setShape(manualBlock, shape);

    // Create a video fill and set the source URI
    const fill = engine.block.createFill('video');
    engine.block.setString(fill, 'fill/video/fileURI', videoUrl);
    engine.block.setFill(manualBlock, fill);

    // Set dimensions and position
    engine.block.setWidth(manualBlock, 400);
    engine.block.setHeight(manualBlock, 225);
    engine.block.setPositionX(manualBlock, 50);
    engine.block.setPositionY(manualBlock, 520);

    // Add the block to the page
    engine.block.appendChild(page, manualBlock);

    console.log('Added video using manual construction');

    // Load video metadata before configuring trim
    // This is required to query the total duration
    await engine.block.forceLoadAVResource(fill);

    // Get the total video duration
    const totalDuration = engine.block.getAVResourceTotalDuration(fill);
    console.log(`Video total duration: ${totalDuration} seconds`);

    // Configure trim settings on the fill (not the block)
    // Start playback 2 seconds into the video
    engine.block.setTrimOffset(fill, 2.0);

    // Play for 5 seconds (or remaining duration if video is shorter)
    const trimLength = Math.min(5.0, totalDuration - 2.0);
    engine.block.setTrimLength(fill, trimLength);

    console.log(`Configured trim: offset=2s, length=${trimLength}s`);

    // Export the scene to PNG
    const shouldExport = await confirmExport();

    if (shouldExport) {
      // Export the page to PNG
      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save to output directory
      const outputDir = path.join(process.cwd(), 'output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = path.join(outputDir, 'video-thumbnails.png');
      fs.writeFileSync(outputPath, buffer);
      console.log(`Exported to: ${outputPath}`);
    } else {
      console.log('Export skipped');
    }
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
    console.log('Engine disposed');
  }
}

main().catch(console.error);
