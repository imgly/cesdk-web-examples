import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

config();

async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a video scene (required for video fills)
    // Video fills only work in Video mode, not Design mode
    engine.scene.createVideo({
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    // Check if block supports fills before accessing fill APIs
    const testBlock = engine.block.create('graphic');
    const canHaveFill = engine.block.supportsFill(testBlock);
    console.log('Block supports fills:', canHaveFill);

    // Verify we're in Video mode (required for video fills)
    const sceneMode = engine.scene.getMode();
    console.log('Scene mode:', sceneMode); // "Video"
    if (sceneMode !== 'Video') {
      throw new Error('Video fills require Video mode.');
    }
    engine.block.destroy(testBlock);

    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // ===== Section 1: Create Video Fill =====
    // Create a graphic block with a video fill
    const basicBlock = engine.block.create('graphic');
    engine.block.setShape(basicBlock, engine.block.createShape('rect'));
    engine.block.setWidth(basicBlock, 200);
    engine.block.setHeight(basicBlock, 150);

    // Create a video fill
    const videoFill = engine.block.createFill('video');
    // or using full type name: engine.block.createFill('//ly.img.ubq/fill/video');

    // Set the video source URI
    engine.block.setString(videoFill, 'fill/video/fileURI', videoUri);

    // Apply the fill to the block
    engine.block.setFill(basicBlock, videoFill);
    engine.block.appendChild(page, basicBlock);

    // Get and verify the current fill
    const fillId = engine.block.getFill(basicBlock);
    const fillType = engine.block.getType(fillId);
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/video'

    // ===== Section 2: Content Fill Modes =====
    // Cover mode: Fill entire block, may crop video
    const coverBlock = engine.block.create('graphic');
    engine.block.setShape(coverBlock, engine.block.createShape('rect'));
    engine.block.setWidth(coverBlock, 200);
    engine.block.setHeight(coverBlock, 150);

    const coverVideoFill = engine.block.createFill('video');
    engine.block.setString(coverVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(coverBlock, coverVideoFill);
    engine.block.appendChild(page, coverBlock);

    // Set content fill mode to Cover
    engine.block.setEnum(coverBlock, 'contentFill/mode', 'Cover');

    // Get current fill mode
    const coverMode = engine.block.getEnum(coverBlock, 'contentFill/mode');
    console.log('Cover block fill mode:', coverMode); // 'Cover'

    // Contain mode: Fit entire video, may leave empty space
    const containBlock = engine.block.create('graphic');
    engine.block.setShape(containBlock, engine.block.createShape('rect'));
    engine.block.setWidth(containBlock, 200);
    engine.block.setHeight(containBlock, 150);

    const containVideoFill = engine.block.createFill('video');
    engine.block.setString(containVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(containBlock, containVideoFill);
    engine.block.appendChild(page, containBlock);

    // Set content fill mode to Contain
    engine.block.setEnum(containBlock, 'contentFill/mode', 'Contain');

    // Get current fill mode
    const currentMode = engine.block.getEnum(containBlock, 'contentFill/mode');
    console.log('Current fill mode:', currentMode);

    // ===== Section 3: Force Load Video Resource =====
    // Force load video resource to access metadata
    const metadataBlock = engine.block.create('graphic');
    engine.block.setShape(metadataBlock, engine.block.createShape('rect'));
    engine.block.setWidth(metadataBlock, 200);
    engine.block.setHeight(metadataBlock, 150);

    const metadataVideoFill = engine.block.createFill('video');
    engine.block.setString(metadataVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(metadataBlock, metadataVideoFill);
    engine.block.appendChild(page, metadataBlock);

    // Force load the video resource before accessing metadata
    await engine.block.forceLoadAVResource(metadataVideoFill);

    // Now we can access video metadata
    const totalDuration = engine.block.getDouble(
      metadataVideoFill,
      'fill/video/totalDuration'
    );
    console.log('Video total duration:', totalDuration, 'seconds');

    // ===== Section 4: Video as Shape Fill =====
    // Fill a shape with video content
    const ellipseBlock = engine.block.create('graphic');
    const ellipseShape = engine.block.createShape('//ly.img.ubq/shape/ellipse');
    engine.block.setShape(ellipseBlock, ellipseShape);
    engine.block.setWidth(ellipseBlock, 200);
    engine.block.setHeight(ellipseBlock, 150);

    const ellipseVideoFill = engine.block.createFill('video');
    engine.block.setString(ellipseVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(ellipseBlock, ellipseVideoFill);
    engine.block.appendChild(page, ellipseBlock);

    // ===== Section 5: Opacity =====
    // Control opacity for transparency effects
    const opacityBlock = engine.block.create('graphic');
    engine.block.setShape(opacityBlock, engine.block.createShape('rect'));
    engine.block.setWidth(opacityBlock, 200);
    engine.block.setHeight(opacityBlock, 150);

    const opacityVideoFill = engine.block.createFill('video');
    engine.block.setString(opacityVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(opacityBlock, opacityVideoFill);
    engine.block.appendChild(page, opacityBlock);

    // Set block opacity to 70%
    engine.block.setFloat(opacityBlock, 'opacity', 0.7);

    // ===== Section 6: Shared Video Fill =====
    // Share one video fill between multiple blocks for memory efficiency
    const sharedFill = engine.block.createFill('video');
    engine.block.setString(sharedFill, 'fill/video/fileURI', videoUri);

    // First block using shared fill
    const sharedBlock1 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock1, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock1, 200);
    engine.block.setHeight(sharedBlock1, 150);
    engine.block.setFill(sharedBlock1, sharedFill);
    engine.block.appendChild(page, sharedBlock1);

    // Second block using the same shared fill
    const sharedBlock2 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock2, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock2, 160);
    engine.block.setHeight(sharedBlock2, 120);
    engine.block.setFill(sharedBlock2, sharedFill);
    engine.block.appendChild(page, sharedBlock2);

    console.log('Shared fill - Two blocks using the same video fill instance');

    // ===== Position all blocks in grid layout =====
    const blocks = [
      basicBlock, // Position 0
      coverBlock, // Position 1
      containBlock, // Position 2
      metadataBlock, // Position 3
      ellipseBlock, // Position 4
      opacityBlock, // Position 5
      sharedBlock1, // Position 6
      sharedBlock2 // Position 7
    ];

    // Position blocks in a grid layout
    const cols = 4;
    const spacing = 10;
    const margin = 50;
    const blockWidth = 200;
    const blockHeight = 150;

    blocks.forEach((block, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      engine.block.setPositionX(block, margin + col * (blockWidth + spacing));
      engine.block.setPositionY(block, margin + row * (blockHeight + spacing));
    });

    console.log('Video fills demonstration complete.');
    console.log('Created', blocks.length, 'blocks with video fills.');

  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
