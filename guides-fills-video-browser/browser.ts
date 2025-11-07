import type {
  CreativeEngine,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Video Fills Guide
 *
 * Demonstrates video fills in CE.SDK:
 * - Creating video fills
 * - Setting video sources (single URI and source sets)
 * - Applying video fills to blocks
 * - Content fill modes (Cover, Contain)
 * - Loading video resources
 * - Getting video thumbnails
 * - Different use cases (backgrounds, shapes, text)
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Video fills require Video mode and video features enabled
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.fill');

    // Load assets and create video scene (required for video fills)
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine as CreativeEngine;
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : engine.scene.get();

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 8);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Use a sample video URL from demo assets
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create a sample block to demonstrate fill support checking
    const sampleBlock = engine.block.create('graphic');
    engine.block.setShape(sampleBlock, engine.block.createShape('rect'));

    // Check if the block supports fills
    const supportsFills = engine.block.supportsFill(sampleBlock);
    // eslint-disable-next-line no-console
    console.log('Block supports fills:', supportsFills); // true for graphic blocks

    // Verify we're in Video mode (required for video fills)
    const sceneMode = engine.scene.getMode();
    if (sceneMode !== 'Video') {
      throw new Error('Video fills require Video mode.');
    }
    // eslint-disable-next-line no-console
    console.log('Scene mode:', sceneMode); // "Video"

    // Pattern #1: Demonstrate Individual Before Combined
    // Create a basic video fill demonstration
    const basicBlock = engine.block.create('graphic');
    engine.block.setShape(basicBlock, engine.block.createShape('rect'));
    engine.block.setWidth(basicBlock, blockWidth);
    engine.block.setHeight(basicBlock, blockHeight);
    engine.block.appendChild(page, basicBlock);

    // Create a video fill
    const basicVideoFill = engine.block.createFill('video');
    // or using full type name: engine.block.createFill('//ly.img.ubq/fill/video');

    // Set the video source URI
    engine.block.setString(basicVideoFill, 'fill/video/fileURI', videoUri);

    // Apply the fill to the block
    engine.block.setFill(basicBlock, basicVideoFill);

    // Get and verify the current fill
    const fillId = engine.block.getFill(basicBlock);
    const fillType = engine.block.getType(fillId);
    // eslint-disable-next-line no-console
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/video'

    // Pattern #2: Content fill mode - Cover
    // Cover mode fills entire block, may crop video to fit
    const coverBlock = engine.block.create('graphic');
    engine.block.setShape(coverBlock, engine.block.createShape('rect'));
    engine.block.setWidth(coverBlock, blockWidth);
    engine.block.setHeight(coverBlock, blockHeight);
    engine.block.appendChild(page, coverBlock);

    const coverVideoFill = engine.block.createFill('video');
    engine.block.setString(coverVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(coverBlock, coverVideoFill);

    // Set content fill mode to Cover
    engine.block.setEnum(coverBlock, 'contentFill/mode', 'Cover');

    // Get current fill mode
    const coverMode = engine.block.getEnum(coverBlock, 'contentFill/mode');
    // eslint-disable-next-line no-console
    console.log('Cover block fill mode:', coverMode); // 'Cover'

    // Content fill mode - Contain
    // Contain mode fits entire video, may leave empty space
    const containBlock = engine.block.create('graphic');
    engine.block.setShape(containBlock, engine.block.createShape('rect'));
    engine.block.setWidth(containBlock, blockWidth);
    engine.block.setHeight(containBlock, blockHeight);
    engine.block.appendChild(page, containBlock);

    const containVideoFill = engine.block.createFill('video');
    engine.block.setString(containVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(containBlock, containVideoFill);

    // Set content fill mode to Contain
    engine.block.setEnum(containBlock, 'contentFill/mode', 'Contain');

    // Force load video resource to access metadata
    const resourceBlock = engine.block.create('graphic');
    engine.block.setShape(resourceBlock, engine.block.createShape('rect'));
    engine.block.setWidth(resourceBlock, blockWidth);
    engine.block.setHeight(resourceBlock, blockHeight);
    engine.block.appendChild(page, resourceBlock);

    const resourceVideoFill = engine.block.createFill('video');
    engine.block.setString(resourceVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(resourceBlock, resourceVideoFill);

    // Force load the video resource before accessing metadata
    await engine.block.forceLoadAVResource(resourceVideoFill);

    // Now we can access video metadata
    const totalDuration = engine.block.getDouble(
      resourceVideoFill,
      'fill/video/totalDuration'
    );
    // eslint-disable-next-line no-console
    console.log('Video total duration:', totalDuration, 'seconds');

    // Use case: Video as shape fill - Ellipse
    const ellipseBlock = engine.block.create('graphic');
    const ellipseShape = engine.block.createShape('//ly.img.ubq/shape/ellipse');
    engine.block.setShape(ellipseBlock, ellipseShape);
    engine.block.setWidth(ellipseBlock, blockWidth);
    engine.block.setHeight(ellipseBlock, blockHeight);
    engine.block.appendChild(page, ellipseBlock);

    const ellipseVideoFill = engine.block.createFill('video');
    engine.block.setString(ellipseVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(ellipseBlock, ellipseVideoFill);

    // Advanced: Video fill with opacity
    const opacityBlock = engine.block.create('graphic');
    engine.block.setShape(opacityBlock, engine.block.createShape('rect'));
    engine.block.setWidth(opacityBlock, blockWidth);
    engine.block.setHeight(opacityBlock, blockHeight);
    engine.block.appendChild(page, opacityBlock);

    const opacityVideoFill = engine.block.createFill('video');
    engine.block.setString(opacityVideoFill, 'fill/video/fileURI', videoUri);
    engine.block.setFill(opacityBlock, opacityVideoFill);

    // Set block opacity to 70%
    engine.block.setFloat(opacityBlock, 'opacity', 0.7);

    // Advanced: Share one video fill between multiple blocks
    const sharedFill = engine.block.createFill('video');
    engine.block.setString(sharedFill, 'fill/video/fileURI', videoUri);

    // First block using shared fill
    const sharedBlock1 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock1, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock1, blockWidth);
    engine.block.setHeight(sharedBlock1, blockHeight);
    engine.block.appendChild(page, sharedBlock1);
    engine.block.setFill(sharedBlock1, sharedFill);

    // Second block using the same shared fill
    const sharedBlock2 = engine.block.create('graphic');
    engine.block.setShape(sharedBlock2, engine.block.createShape('rect'));
    engine.block.setWidth(sharedBlock2, blockWidth * 0.8); // Slightly smaller
    engine.block.setHeight(sharedBlock2, blockHeight * 0.8);
    engine.block.appendChild(page, sharedBlock2);
    engine.block.setFill(sharedBlock2, sharedFill);

    // eslint-disable-next-line no-console
    console.log(
      'Shared fill - Two blocks using the same video fill instance for memory efficiency'
    );

    // ===== Position all blocks in grid layout =====
    const blocks = [
      basicBlock, // Position 0
      coverBlock, // Position 1
      containBlock, // Position 2
      resourceBlock, // Position 3
      ellipseBlock, // Position 4
      opacityBlock, // Position 5
      sharedBlock1, // Position 6
      sharedBlock2 // Position 7
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Select the first block so users can see the fill in action
    engine.block.setSelected(basicBlock, true);

    // Start playback automatically
    try {
      engine.block.setPlaying(page, true);
      // eslint-disable-next-line no-console
      console.log(
        'Video fills guide initialized. Playback started. Demonstrating various video fill techniques across the grid.'
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        'Video fills guide initialized. Click play to start video playback (browser autoplay restriction).'
      );
    }
  }
}

export default Example;
