import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Split Video Guide
 *
 * Demonstrates splitting video clips in CE.SDK:
 * - Basic splitting at specific time points
 * - Configuring split options (attachToParent, selectNewBlock, createParentTrackIfNeeded)
 * - Splitting at playhead position
 * - Understanding split results (trim properties)
 * - Splitting multiple tracks at timeline position
 * - Split and delete workflow
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features in CE.SDK
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    // Load assets and create a video scene (required for splitting)
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }
    });

    const engine = cesdk.engine;
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Get a video from demo asset sources
    const videoAssets = await engine.asset.findAssets('ly.img.video', {
      page: 0,
      perPage: 1
    });
    const videoUri =
      videoAssets.assets[0]?.payload?.sourceSet?.[0]?.uri ??
      'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create a video block to demonstrate basic splitting
    const basicSplitVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    // Get the video fill and load resource to access duration
    const basicFill = engine.block.getFill(basicSplitVideo);
    await engine.block.forceLoadAVResource(basicFill);

    // Set block duration for the timeline
    engine.block.setDuration(basicSplitVideo, 10.0);

    // Split the video block at 5 seconds
    // Returns the ID of the newly created block (second segment)
    const splitResultBlock = engine.block.split(basicSplitVideo, 5.0);

    // eslint-disable-next-line no-console
    console.log(
      `Basic split - Original block: ${basicSplitVideo}, New block: ${splitResultBlock}`
    );

    // Create another video block to demonstrate split options
    const optionsSplitVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const optionsFill = engine.block.getFill(optionsSplitVideo);
    await engine.block.forceLoadAVResource(optionsFill);
    engine.block.setDuration(optionsSplitVideo, 10.0);

    // Split with custom options
    const optionsSplitResult = engine.block.split(optionsSplitVideo, 4.0, {
      attachToParent: true, // Attach new block to same parent (default: true)
      createParentTrackIfNeeded: false, // Don't create track if needed (default: false)
      selectNewBlock: false // Don't select the new block (default: true)
    });

    // eslint-disable-next-line no-console
    console.log(
      `Split with options - New block: ${optionsSplitResult}, selectNewBlock: false`
    );

    // Create a video block to demonstrate playhead-based splitting
    const playheadSplitVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const playheadFill = engine.block.getFill(playheadSplitVideo);
    await engine.block.forceLoadAVResource(playheadFill);
    engine.block.setDuration(playheadSplitVideo, 10.0);

    // Get the clip's start time on the timeline
    const clipStartTime = engine.block.getTimeOffset(playheadSplitVideo);

    // Simulate a playhead position (in a real app, use engine.block.getPlaybackTime(page))
    const simulatedPlayheadTime = clipStartTime + 3.0;

    // Calculate split time relative to the clip
    const splitTime = simulatedPlayheadTime - clipStartTime;

    // Perform the split at the calculated time
    const playheadSplitResult = engine.block.split(
      playheadSplitVideo,
      splitTime
    );

    // eslint-disable-next-line no-console
    console.log(
      `Playhead split - Split at ${splitTime}s into clip, New block: ${playheadSplitResult}`
    );

    // Create a video block to examine split results
    const resultsSplitVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const resultsFill = engine.block.getFill(resultsSplitVideo);
    await engine.block.forceLoadAVResource(resultsFill);
    engine.block.setDuration(resultsSplitVideo, 10.0);

    // Get trim values before split
    const originalTrimOffset = engine.block.getTrimOffset(resultsFill);
    const originalTrimLength = engine.block.getTrimLength(resultsFill);

    // Split at 6 seconds
    const resultsNewBlock = engine.block.split(resultsSplitVideo, 6.0);
    const newBlockFill = engine.block.getFill(resultsNewBlock);

    // Examine trim properties after split
    const originalAfterSplitOffset = engine.block.getTrimOffset(resultsFill);
    const originalAfterSplitLength = engine.block.getTrimLength(resultsFill);
    const newBlockTrimOffset = engine.block.getTrimOffset(newBlockFill);
    const newBlockTrimLength = engine.block.getTrimLength(newBlockFill);

    // eslint-disable-next-line no-console
    console.log('Split results:');
    // eslint-disable-next-line no-console
    console.log(
      `  Original before: offset=${originalTrimOffset}, length=${originalTrimLength}`
    );
    // eslint-disable-next-line no-console
    console.log(
      `  Original after: offset=${originalAfterSplitOffset}, length=${originalAfterSplitLength}`
    );
    // eslint-disable-next-line no-console
    console.log(
      `  New block: offset=${newBlockTrimOffset}, length=${newBlockTrimLength}`
    );

    // Create a video block to demonstrate split-and-delete workflow
    const deleteWorkflowVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const deleteFill = engine.block.getFill(deleteWorkflowVideo);
    await engine.block.forceLoadAVResource(deleteFill);
    engine.block.setDuration(deleteWorkflowVideo, 10.0);

    // Remove middle section: split at start of section to remove (2s)
    const middleBlock = engine.block.split(deleteWorkflowVideo, 2.0);

    // Split again at the end of the section to remove (at 3s into middle block = 5s total)
    const endBlock = engine.block.split(middleBlock, 3.0);

    // Delete the middle segment
    engine.block.destroy(middleBlock);

    // eslint-disable-next-line no-console
    console.log(
      `Split and delete - Removed middle 3s section, kept blocks: ${deleteWorkflowVideo}, ${endBlock}`
    );

    // Create a video block to demonstrate split time validation
    const validateVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const validateFill = engine.block.getFill(validateVideo);
    await engine.block.forceLoadAVResource(validateFill);
    engine.block.setDuration(validateVideo, 8.0);

    // Get block duration to validate split time
    const blockDuration = engine.block.getDuration(validateVideo);
    const desiredSplitTime = 4.0;

    // Validate split time is within bounds (must be > 0 and < duration)
    if (desiredSplitTime > 0 && desiredSplitTime < blockDuration) {
      const validatedSplitResult = engine.block.split(
        validateVideo,
        desiredSplitTime
      );
      // eslint-disable-next-line no-console
      console.log(
        `Validated split - Duration: ${blockDuration}s, Split at: ${desiredSplitTime}s, New block: ${validatedSplitResult}`
      );
    } else {
      // eslint-disable-next-line no-console
      console.log('Split time out of range');
    }

    // ===== Position all blocks in grid layout =====
    // Note: Some original blocks were modified by splits, position remaining visible blocks
    const blocks = [
      basicSplitVideo,
      splitResultBlock,
      optionsSplitVideo,
      optionsSplitResult,
      playheadSplitVideo,
      playheadSplitResult
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Select first block so timeline controls are visible
    engine.block.setSelected(basicSplitVideo, true);

    // Set playback time to 8 seconds for hero image
    engine.block.setPlaybackTime(page, 8.0);

    // Start playback automatically when the example loads
    try {
      engine.block.setPlaying(page, true);
      // eslint-disable-next-line no-console
      console.log(
        'Video split guide initialized. Playback started. Use timeline to see split results.'
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        'Video split guide initialized. Click play button to start playback.'
      );
    }
  }
}

export default Example;
