import CreativeEditorSDK, {
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

class Example implements EditorPlugin {
  name = 'guides-create-video-transform-scale-browser';

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
    await cesdk.createVideoScene();

    const engine = cesdk.engine;
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : engine.scene.get();

    // Set page dimensions and fill color
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 500);

    // Enable fill and set page fill color to #6686FF
    engine.block.setFillEnabled(page, true);
    engine.block.setColor(engine.block.getFill(page), 'fill/color/value', {
      r: 102 / 255,
      g: 134 / 255,
      b: 255 / 255,
      a: 1
    });

    // Centered 2x2 grid layout for 800x500 canvas
    // Videos: 120x90, scaled to 180x135
    // Grid positions are where videos APPEAR after scaling
    // Left column visual X=200, Right column visual X=420
    // Top row visual Y=50, Bottom row visual Y=265
    const leftColumnX = 200;
    const rightColumnX = 420;
    const topRowY = 50;
    const bottomRowY = 265;
    const titleOffsetY = 145; // 135 (video height) + 10 (gap)
    const subtitleOffsetY = 172; // title + 27

    // For center-scaled video, compensate for position shift
    // Center scaling shifts top-left by (-30, -22.5) for 1.5x scale on 120x90
    const centerScaleOffsetX = 30;
    const centerScaleOffsetY = 22.5;

    // Demo 1: Uniform scaling from top-left (default anchor)
    const uniformVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, uniformVideo);
    engine.block.setPositionX(uniformVideo, leftColumnX);
    engine.block.setPositionY(uniformVideo, topRowY);

    // Scale the video to 150% from the default top-left anchor
    engine.block.scale(uniformVideo, 1.5);

    const text1 = engine.block.create('text');
    engine.block.setString(text1, 'text/text', 'Uniform Scale');
    engine.block.setFloat(text1, 'text/fontSize', 24);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text1, 180);
    engine.block.setPositionX(text1, leftColumnX);
    engine.block.setPositionY(text1, topRowY + titleOffsetY);
    engine.block.setFillEnabled(text1, true);
    engine.block.setColor(engine.block.getFill(text1), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text1);

    const explanation1 = engine.block.create('text');
    engine.block.setString(
      explanation1,
      'text/text',
      '150% from top-left anchor'
    );
    engine.block.setFloat(explanation1, 'text/fontSize', 12);
    engine.block.setEnum(explanation1, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation1, 180);
    engine.block.setPositionX(explanation1, leftColumnX);
    engine.block.setPositionY(explanation1, topRowY + subtitleOffsetY);
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

    // Demo 2: Scaling from center anchor
    const centerVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, centerVideo);
    // Position compensates for center scaling shift so final position aligns with grid
    engine.block.setPositionX(centerVideo, rightColumnX + centerScaleOffsetX);
    engine.block.setPositionY(centerVideo, topRowY + centerScaleOffsetY);

    // Scale from center anchor (0.5, 0.5)
    engine.block.scale(centerVideo, 1.5, 0.5, 0.5);

    const text2 = engine.block.create('text');
    engine.block.setString(text2, 'text/text', 'Center Scale');
    engine.block.setFloat(text2, 'text/fontSize', 24);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text2, 180);
    engine.block.setPositionX(text2, rightColumnX);
    engine.block.setPositionY(text2, topRowY + titleOffsetY);
    engine.block.setFillEnabled(text2, true);
    engine.block.setColor(engine.block.getFill(text2), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text2);

    const explanation2 = engine.block.create('text');
    engine.block.setString(
      explanation2,
      'text/text',
      '150% from center anchor'
    );
    engine.block.setFloat(explanation2, 'text/fontSize', 12);
    engine.block.setEnum(explanation2, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation2, 180);
    engine.block.setPositionX(explanation2, rightColumnX);
    engine.block.setPositionY(explanation2, topRowY + subtitleOffsetY);
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

    // Demo 3: Non-uniform scaling (width only)
    const stretchVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, stretchVideo);
    engine.block.setPositionX(stretchVideo, leftColumnX);
    engine.block.setPositionY(stretchVideo, bottomRowY);

    // Stretch only the width by 1.5x
    engine.block.setWidthMode(stretchVideo, 'Absolute');
    const currentWidth = engine.block.getWidth(stretchVideo);
    engine.block.setWidth(stretchVideo, currentWidth * 1.5, true);

    const text3 = engine.block.create('text');
    engine.block.setString(text3, 'text/text', 'Width Stretch');
    engine.block.setFloat(text3, 'text/fontSize', 24);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text3, 180);
    engine.block.setPositionX(text3, leftColumnX);
    engine.block.setPositionY(text3, bottomRowY + titleOffsetY);
    engine.block.setFillEnabled(text3, true);
    engine.block.setColor(engine.block.getFill(text3), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text3);

    const explanation3 = engine.block.create('text');
    engine.block.setString(
      explanation3,
      'text/text',
      '150% width, height unchanged'
    );
    engine.block.setFloat(explanation3, 'text/fontSize', 12);
    engine.block.setEnum(explanation3, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation3, 180);
    engine.block.setPositionX(explanation3, leftColumnX);
    engine.block.setPositionY(explanation3, bottomRowY + subtitleOffsetY);
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

    // Demo 4: Locked scaling
    const lockedVideo = await engine.block.addVideo(
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      120,
      90
    );
    engine.block.appendChild(page, lockedVideo);
    engine.block.setPositionX(lockedVideo, rightColumnX);
    engine.block.setPositionY(lockedVideo, bottomRowY);

    // Lock all transforms to prevent scaling
    engine.block.setTransformLocked(lockedVideo, true);

    const text4 = engine.block.create('text');
    engine.block.setString(text4, 'text/text', 'Scale Locked');
    engine.block.setFloat(text4, 'text/fontSize', 24);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text4, 180);
    engine.block.setPositionX(text4, rightColumnX);
    engine.block.setPositionY(text4, bottomRowY + titleOffsetY);
    engine.block.setFillEnabled(text4, true);
    engine.block.setColor(engine.block.getFill(text4), 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.appendChild(page, text4);

    const explanation4 = engine.block.create('text');
    engine.block.setString(
      explanation4,
      'text/text',
      'Transform locked - cannot scale'
    );
    engine.block.setFloat(explanation4, 'text/fontSize', 12);
    engine.block.setEnum(explanation4, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(explanation4, 180);
    engine.block.setPositionX(explanation4, rightColumnX);
    engine.block.setPositionY(explanation4, bottomRowY + subtitleOffsetY);
    engine.block.setFillEnabled(explanation4, true);
    engine.block.setColor(
      engine.block.getFill(explanation4),
      'fill/color/value',
      {
        r: 1,
        g: 1,
        b: 1,
        a: 1
      }
    );
    engine.block.appendChild(page, explanation4);

    // Set playhead position to 2 seconds
    engine.block.setPlaybackTime(page, 2);
  }
}

export default Example;
