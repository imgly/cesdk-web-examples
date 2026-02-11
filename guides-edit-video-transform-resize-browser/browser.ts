import CreativeEditorSDK, {
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

class Example implements EditorPlugin {
  name = 'guides-edit-video-transform-resize-browser';

  version = CreativeEditorSDK.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Setup: Load assets and create scene
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 800, height: 500, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : engine.scene.get();

    // Enable fill and set page fill color to #6686FF
    engine.block.setFillEnabled(page, true);
    engine.block.setColor(engine.block.getFill(page), 'fill/color/value', {
      r: 102 / 255,
      g: 134 / 255,
      b: 255 / 255,
      a: 1
    });

    // Layout constants for centered positioning
    // Page: 800x500, 3 columns of 200px each with 50px spacing
    // Total width: 700px, centered start X: 50px
    // Column centers: 150, 400, 650
    const videoWidth = 150;
    const videoHeight = 100;
    const columnWidth = 200;
    const startY = 165; // Vertically centered
    const labelY = startY + videoHeight + 10;
    const explanationY = labelY + 35;

    // Column 1 center: 150
    const col1X = 50;
    const col1VideoX = col1X + (columnWidth - videoWidth) / 2; // 75

    // Column 2 center: 400 (percentage video is 200px = 25% of 800)
    const col2X = 300;
    const col2VideoX = col2X; // 200px wide video centered at 400

    // Column 3 center: 650
    const col3X = 550;
    const col3VideoX = col3X + (columnWidth - videoWidth) / 2; // 575

    // Demo 1: Resizable Video - Can be freely resized by user
    const resizableVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      videoWidth,
      videoHeight
    );
    engine.block.appendChild(page, resizableVideo);
    engine.block.setPositionX(resizableVideo, col1VideoX);
    engine.block.setPositionY(resizableVideo, startY);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Resizable');
    engine.block.setFloat(text1, 'text/fontSize', 28);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, columnWidth);
    engine.block.setPositionX(text1, col1X);
    engine.block.setPositionY(text1, labelY);
    engine.block.setFillEnabled(text1, true);
    engine.block.setColor(engine.block.getFill(text1), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text1);

    // Add explanatory text below
    const explanation1 = engine.block.create('text');
    engine.block.setString(
      explanation1,
      'text/text',
      'Absolute pixel dimensions'
    );
    engine.block.setFloat(explanation1, 'text/fontSize', 12);
    engine.block.setEnum(explanation1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation1, columnWidth);
    engine.block.setPositionX(explanation1, col1X);
    engine.block.setPositionY(explanation1, explanationY);
    engine.block.setFillEnabled(explanation1, true);
    engine.block.setColor(
      engine.block.getFill(explanation1),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation1);

    // Demo 2: Percentage Sizing - Responsive layout
    const percentVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      videoWidth,
      videoHeight
    );
    engine.block.appendChild(page, percentVideo);

    // Set size mode to percentage (0.0 to 1.0)
    engine.block.setWidthMode(percentVideo, 'Percent');
    engine.block.setHeightMode(percentVideo, 'Percent');
    // Set to 25% width, 20% height of parent
    engine.block.setWidth(percentVideo, 0.25);
    engine.block.setHeight(percentVideo, 0.2);

    engine.block.setPositionX(percentVideo, col2VideoX);
    engine.block.setPositionY(percentVideo, startY);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Percentage');
    engine.block.setFloat(text2, 'text/fontSize', 28);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, columnWidth);
    engine.block.setPositionX(text2, col2X);
    engine.block.setPositionY(text2, labelY);
    engine.block.setFillEnabled(text2, true);
    engine.block.setColor(engine.block.getFill(text2), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text2);

    // Add explanatory text below
    const explanation2 = engine.block.create('text');
    engine.block.setString(explanation2, 'text/text', '25% width, 20% height');
    engine.block.setFloat(explanation2, 'text/fontSize', 12);
    engine.block.setEnum(explanation2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation2, columnWidth);
    engine.block.setPositionX(explanation2, col2X);
    engine.block.setPositionY(explanation2, explanationY);
    engine.block.setFillEnabled(explanation2, true);
    engine.block.setColor(
      engine.block.getFill(explanation2),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation2);

    // Demo 3: Resize-Locked Video - Cannot be resized
    const lockedVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      videoWidth,
      videoHeight
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, col3VideoX);
    engine.block.setPositionY(lockedVideo, startY);

    // Lock the transform to prevent resizing
    engine.block.setTransformLocked(lockedVideo, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Locked');
    engine.block.setFloat(text3, 'text/fontSize', 28);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, columnWidth);
    engine.block.setPositionX(text3, col3X);
    engine.block.setPositionY(text3, labelY);
    engine.block.setFillEnabled(text3, true);
    engine.block.setColor(engine.block.getFill(text3), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text3);

    // Add explanatory text below
    const explanation3 = engine.block.create('text');
    engine.block.setString(explanation3, 'text/text', 'Transform locked');
    engine.block.setFloat(explanation3, 'text/fontSize', 12);
    engine.block.setEnum(explanation3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation3, columnWidth);
    engine.block.setPositionX(explanation3, col3X);
    engine.block.setPositionY(explanation3, explanationY);
    engine.block.setFillEnabled(explanation3, true);
    engine.block.setColor(
      engine.block.getFill(explanation3),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation3);

    // Get current dimensions
    const currentWidth = engine.block.getWidth(resizableVideo);
    const currentHeight = engine.block.getHeight(resizableVideo);
    console.log('Current dimensions:', currentWidth, 'x', currentHeight);

    // Check size mode
    const widthMode = engine.block.getWidthMode(percentVideo);
    const heightMode = engine.block.getHeightMode(percentVideo);
    console.log('Size modes:', widthMode, heightMode);

    // Set playhead position to 2 seconds
    engine.block.setPlaybackTime(page, 2);
  }
}

export default Example;
