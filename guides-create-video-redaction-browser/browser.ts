import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

// Video URLs for demonstrating different redaction scenarios
const VIDEOS = {
  surfer:
    'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
  lifestyle1:
    'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-taryn-elliott-7108793.mp4',
  lifestyle2:
    'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-taryn-elliott-7108801.mp4',
  nature1:
    'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-taryn-elliott-8713109.mp4',
  nature2:
    'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-taryn-elliott-8713114.mp4'
};

// Labels for each redaction technique
const LABELS = [
  'Radial Blur',
  'Full-Block Blur',
  'Pixelization',
  'Solid Overlay',
  'Time-Based'
];

// Duration for each video segment (in seconds)
const SEGMENT_DURATION = 5.0;

/**
 * CE.SDK Plugin: Video Redaction Guide
 *
 * Demonstrates video redaction techniques in CE.SDK:
 * - Full-block blur for complete video obscuration
 * - Radial blur for circular redaction patterns
 * - Pixelization for mosaic-style censoring
 * - Solid overlays for complete blocking
 * - Time-based redactions
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');
    cesdk.feature.enable('ly.img.blur');
    cesdk.feature.enable('ly.img.effect');

    // Load assets and create a video scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    // Set 16:9 page dimensions (1920x1080)
    const pageWidth = 1920;
    const pageHeight = 1080;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Load all videos simultaneously
    const videoUrls = [
      VIDEOS.nature2,
      VIDEOS.surfer,
      VIDEOS.lifestyle1,
      VIDEOS.lifestyle2,
      VIDEOS.nature1
    ];

    const videos = await Promise.all(
      videoUrls.map((url) => engine.block.addVideo(url, pageWidth, pageHeight))
    );

    const [
      radialVideo,
      fullBlurVideo,
      pixelVideo,
      , // Base video for overlay segment (overlay is created separately)
      timedVideo
    ] = videos;

    // Position all videos at origin (they'll play sequentially)
    videos.forEach((video, index) => {
      engine.block.setPositionX(video, 0);
      engine.block.setPositionY(video, 0);
      engine.block.setDuration(video, SEGMENT_DURATION);
      engine.block.setTimeOffset(video, index * SEGMENT_DURATION);
      engine.block.appendChild(page, video);
    });

    // Full-Block Blur: Apply blur to entire video
    // Use this when the entire video content needs obscuring

    // Check if the block supports blur
    const supportsBlur = engine.block.supportsBlur(fullBlurVideo);
    // eslint-disable-next-line no-console
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
      r: 0.1, g: 0.1, b: 0.1, a: 1.0
    });
    engine.block.setFill(overlay, solidFill);

    // Position and size the overlay
    engine.block.setWidth(overlay, pageWidth * 0.4);
    engine.block.setHeight(overlay, pageHeight * 0.3);
    engine.block.setPositionX(overlay, pageWidth * 0.55);
    engine.block.setPositionY(overlay, pageHeight * 0.65);
    engine.block.appendChild(page, overlay);
    engine.block.setTimeOffset(overlay, 3 * SEGMENT_DURATION);
    engine.block.setDuration(overlay, SEGMENT_DURATION);

    // Time-Based Redaction: Redaction appears only during specific time range

    // Apply blur to the video
    const timedBlur = engine.block.createBlur('uniform');
    engine.block.setFloat(timedBlur, 'blur/uniform/intensity', 0.9);
    engine.block.setBlur(timedVideo, timedBlur);
    engine.block.setBlurEnabled(timedVideo, true);

    // The video is already timed to appear at a specific offset (set earlier)
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

    // Add text labels for each video segment (positioned top-right)
    const labelWidth = 400;
    const labelHeight = 60;
    const labelPadding = 20;
    const labelMargin = 30;

    videos.forEach((_, index) => {
      const label = LABELS[index];

      // Add background first (so it's behind text)
      const labelBg = engine.block.create('//ly.img.ubq/graphic');
      const labelBgShape = engine.block.createShape('//ly.img.ubq/shape/rect');
      engine.block.setShape(labelBg, labelBgShape);

      const labelBgFill = engine.block.createFill('//ly.img.ubq/fill/color');
      engine.block.setColor(labelBgFill, 'fill/color/value', {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.8
      });
      engine.block.setFill(labelBg, labelBgFill);

      engine.block.setWidth(labelBg, labelWidth);
      engine.block.setHeight(labelBg, labelHeight + labelPadding);
      engine.block.setPositionX(labelBg, pageWidth - labelWidth - labelMargin);
      engine.block.setPositionY(labelBg, labelMargin);
      engine.block.setTimeOffset(labelBg, index * SEGMENT_DURATION);
      engine.block.setDuration(labelBg, SEGMENT_DURATION);
      engine.block.appendChild(page, labelBg);

      // Create text block for label
      const textBlock = engine.block.create('//ly.img.ubq/text');
      engine.block.setString(textBlock, 'text/text', label);
      engine.block.setFloat(textBlock, 'text/fontSize', 48);
      engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
      engine.block.setEnum(textBlock, 'text/verticalAlignment', 'Center');

      // Set white text color
      engine.block.setTextColor(textBlock, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });

      // Position label at top right
      engine.block.setWidth(textBlock, labelWidth);
      engine.block.setHeight(textBlock, labelHeight);
      engine.block.setPositionX(textBlock, pageWidth - labelWidth - labelMargin);
      engine.block.setPositionY(textBlock, labelMargin + labelPadding / 2);
      engine.block.setTimeOffset(textBlock, index * SEGMENT_DURATION);
      engine.block.setDuration(textBlock, SEGMENT_DURATION);

      engine.block.appendChild(page, textBlock);
    });

    // Enable auto-fit to keep page in view
    cesdk.engine.scene.enableZoomAutoFit(page, 'Both', 40, 40, 40, 40);

    // Select first video to show timeline controls
    engine.block.select(fullBlurVideo);

    // eslint-disable-next-line no-console
    console.log(
      'Video redaction guide initialized. Videos play sequentially - press play to see each redaction technique.'
    );
  }
}

export default Example;
