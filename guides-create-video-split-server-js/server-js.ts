import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

config(); // Load .env file

async function splitVideoExample() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page and track for video editing
    engine.scene.create('DepthStack', {
      page: { size: { width: 1920, height: 1080 } }
    });
    const page = engine.block.findByType('page')[0]!;
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    // Use a sample video URL
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create a video block to demonstrate basic splitting
    const videoBlock = engine.block.create('graphic');
    const videoFill = engine.block.createFill('video');
    engine.block.setString(videoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(videoBlock, videoFill);
    engine.block.setWidth(videoBlock, 1920);
    engine.block.setHeight(videoBlock, 1080);
    engine.block.appendChild(track, videoBlock);

    // Load video resource to access duration
    await engine.block.forceLoadAVResource(videoFill);

    // Set block duration for the timeline
    engine.block.setDuration(videoBlock, 10.0);

    // Split the video block at 5 seconds
    // Returns the ID of the newly created block (second segment)
    const newBlock = engine.block.split(videoBlock, 5.0);

    console.log(`Basic split - Original: ${videoBlock}, New: ${newBlock}`);

    // Create another video block to demonstrate split options
    const optionsBlock = engine.block.create('graphic');
    const optionsFill = engine.block.createFill('video');
    engine.block.setString(optionsFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(optionsBlock, optionsFill);
    engine.block.setWidth(optionsBlock, 1920);
    engine.block.setHeight(optionsBlock, 1080);
    engine.block.appendChild(track, optionsBlock);

    await engine.block.forceLoadAVResource(optionsFill);
    engine.block.setDuration(optionsBlock, 10.0);

    // Split with custom options
    const optionsNewBlock = engine.block.split(optionsBlock, 4.0, {
      attachToParent: true, // Attach to same parent (default: true)
      createParentTrackIfNeeded: false, // Don't create track (default: false)
      selectNewBlock: false // Don't select new block (default: true)
    });

    console.log(`Split with options - New block: ${optionsNewBlock}`);

    // Examine trim properties after split
    const originalFill = engine.block.getFill(videoBlock);
    const newBlockFill = engine.block.getFill(newBlock);

    const originalTrimOffset = engine.block.getTrimOffset(originalFill);
    const originalTrimLength = engine.block.getTrimLength(originalFill);
    const newTrimOffset = engine.block.getTrimOffset(newBlockFill);
    const newTrimLength = engine.block.getTrimLength(newBlockFill);

    console.log('Split results:');
    console.log(
      `  Original: offset=${originalTrimOffset}s, length=${originalTrimLength}s`
    );
    console.log(
      `  New block: offset=${newTrimOffset}s, length=${newTrimLength}s`
    );

    // Demonstrate split-and-delete workflow for removing middle section
    const deleteBlock = engine.block.create('graphic');
    const deleteFill = engine.block.createFill('video');
    engine.block.setString(deleteFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(deleteBlock, deleteFill);
    engine.block.setWidth(deleteBlock, 1920);
    engine.block.setHeight(deleteBlock, 1080);
    engine.block.appendChild(track, deleteBlock);

    await engine.block.forceLoadAVResource(deleteFill);
    engine.block.setDuration(deleteBlock, 10.0);

    // Split at start of section to remove (2s)
    const middleBlock = engine.block.split(deleteBlock, 2.0);

    // Split at end of section to remove (3s into middle = 5s total)
    const endBlock = engine.block.split(middleBlock, 3.0);

    // Delete the middle segment
    engine.block.destroy(middleBlock);

    console.log(
      `Split and delete - Removed middle, kept: ${deleteBlock}, ${endBlock}`
    );

    // Validate split time before splitting
    const validateBlock = engine.block.create('graphic');
    const validateFill = engine.block.createFill('video');
    engine.block.setString(validateFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(validateBlock, validateFill);
    engine.block.setWidth(validateBlock, 1920);
    engine.block.setHeight(validateBlock, 1080);
    engine.block.appendChild(track, validateBlock);

    await engine.block.forceLoadAVResource(validateFill);
    engine.block.setDuration(validateBlock, 8.0);

    const blockDuration = engine.block.getDuration(validateBlock);
    const splitTime = 4.0;

    // Validate split time is within bounds (must be > 0 and < duration)
    if (splitTime > 0 && splitTime < blockDuration) {
      const validatedNewBlock = engine.block.split(validateBlock, splitTime);
      console.log(
        `Validated split at ${splitTime}s, new block: ${validatedNewBlock}`
      );
    } else {
      console.log('Split time out of range');
    }

    // Export the scene archive to demonstrate the result
    const archiveBlob = await engine.scene.saveToArchive();
    const buffer = Buffer.from(await archiveBlob.arrayBuffer());

    // Ensure output directory exists
    if (!existsSync('./output')) {
      mkdirSync('./output', { recursive: true });
    }

    writeFileSync('./output/split-video.zip', buffer);
    console.log('Scene exported to ./output/split-video.zip');

  } finally {
    engine.dispose();
  }
}

splitVideoExample().catch(console.error);
