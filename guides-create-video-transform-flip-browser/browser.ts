import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { VideoEditorConfig } from './video-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Flip Videos Guide
 *
 * Demonstrates video flipping in CE.SDK:
 * - Flip videos horizontally and vertically
 * - Query flip states
 * - Toggle flips programmatically
 * - Flip multiple clips as a group
 * - Lock flip operations in templates
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
    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(
      new PagePresetsAssetSource({
        include: [
          'ly.img.page.presets.instagram.*',
          'ly.img.page.presets.facebook.*',
          'ly.img.page.presets.x.*',
          'ly.img.page.presets.linkedin.*',
          'ly.img.page.presets.pinterest.*',
          'ly.img.page.presets.tiktok.*',
          'ly.img.page.presets.youtube.*',
          'ly.img.page.presets.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 1280, height: 720, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Sample video URL
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Block dimensions
    const blockWidth = 280;
    const blockHeight = 160;

    // Centered grid layout (3 columns × 2 rows)
    const col1X = 180;
    const col2X = 500;
    const col3X = 820;
    const row1Y = 135;
    const row2Y = 385;
    const label1Y = 305;
    const label2Y = 555;
    const fontSize = 24;

    // Helper to create centered white label
    const createLabel = (text: string, x: number, y: number) => {
      const label = engine.block.create('text');
      engine.block.setString(label, 'text/text', text);
      engine.block.setFloat(label, 'text/fontSize', fontSize);
      engine.block.setEnum(label, 'text/horizontalAlignment', 'Center');
      engine.block.setWidth(label, blockWidth);
      engine.block.setPositionX(label, x);
      engine.block.setPositionY(label, y);
      // Set white text color
      engine.block.setTextColor(label, { r: 1, g: 1, b: 1, a: 1 });
      engine.block.appendChild(page, label);
      return label;
    };

    // Demo 1: Original video (no flip)
    const originalVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, originalVideo);
    engine.block.setPositionX(originalVideo, col1X);
    engine.block.setPositionY(originalVideo, row1Y);

    createLabel('Original', col1X, label1Y);

    // Demo 2: Horizontal flip
    const horizontalFlipVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, horizontalFlipVideo);
    engine.block.setPositionX(horizontalFlipVideo, col2X);
    engine.block.setPositionY(horizontalFlipVideo, row1Y);

    // Flip the video horizontally (mirrors left to right)
    engine.block.setFlipHorizontal(horizontalFlipVideo, true);

    createLabel('Horizontal', col2X, label1Y);

    // Demo 3: Vertical flip
    const verticalFlipVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, verticalFlipVideo);
    engine.block.setPositionX(verticalFlipVideo, col3X);
    engine.block.setPositionY(verticalFlipVideo, row1Y);

    // Flip the video vertically (mirrors top to bottom)
    engine.block.setFlipVertical(verticalFlipVideo, true);

    createLabel('Vertical', col3X, label1Y);

    // Demo 4: Both flips combined
    const bothFlipVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, bothFlipVideo);
    engine.block.setPositionX(bothFlipVideo, col1X);
    engine.block.setPositionY(bothFlipVideo, row2Y);

    // Combine horizontal and vertical flips
    engine.block.setFlipHorizontal(bothFlipVideo, true);
    engine.block.setFlipVertical(bothFlipVideo, true);

    createLabel('Both', col1X, label2Y);

    // Query flip states
    const isFlippedH = engine.block.getFlipHorizontal(horizontalFlipVideo);
    const isFlippedV = engine.block.getFlipVertical(verticalFlipVideo);
    console.log(`Horizontal flip state: ${isFlippedH}`);
    console.log(`Vertical flip state: ${isFlippedV}`);

    // Toggle flip by reading current state and setting opposite
    const currentFlip = engine.block.getFlipHorizontal(originalVideo);
    engine.block.setFlipHorizontal(originalVideo, !currentFlip);
    console.log(`Toggled original video flip: ${!currentFlip}`);
    // Toggle back to keep original state for demo
    engine.block.setFlipHorizontal(originalVideo, currentFlip);

    // Demo 5: Group flip - flip multiple videos together
    const smallWidth = blockWidth / 2;
    const smallHeight = blockHeight / 2;
    const groupGap = 10;
    // Center the pair horizontally within column 2
    const groupPairWidth = smallWidth * 2 + groupGap;
    const groupStartX = col2X + (blockWidth - groupPairWidth) / 2;
    // Center vertically within row 2 (smaller blocks)
    const groupY = row2Y + (blockHeight - smallHeight) / 2;

    const groupVideo1 = await engine.block.addVideo(
      videoUri,
      smallWidth,
      smallHeight
    );
    engine.block.appendChild(page, groupVideo1);
    engine.block.setPositionX(groupVideo1, groupStartX);
    engine.block.setPositionY(groupVideo1, groupY);

    const groupVideo2 = await engine.block.addVideo(
      videoUri,
      smallWidth,
      smallHeight
    );
    engine.block.appendChild(page, groupVideo2);
    engine.block.setPositionX(groupVideo2, groupStartX + smallWidth + groupGap);
    engine.block.setPositionY(groupVideo2, groupY);

    // Group the videos and flip them together
    const groupId = engine.block.group([groupVideo1, groupVideo2]);
    engine.block.setFlipHorizontal(groupId, true);

    createLabel('Group Flip', col2X, label2Y);

    // Demo 6: Lock flip scope
    const lockedVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, col3X);
    engine.block.setPositionY(lockedVideo, row2Y);

    // Disable flip operations for this block
    engine.block.setScopeEnabled(lockedVideo, 'layer/flip', false);

    // Verify scope is disabled
    const canFlip = engine.block.isScopeEnabled(lockedVideo, 'layer/flip');
    console.log(`Flip enabled for locked video: ${canFlip}`);

    createLabel('Flip Locked', col3X, label2Y);

    // Set playhead to 1 second to show video content in thumbnails
    engine.block.setPlaybackTime(page, 1.0);

    console.log(
      'Flip Videos guide initialized. Use the timeline to view and edit videos.'
    );
  }
}

export default Example;
