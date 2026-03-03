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
 * CE.SDK Plugin: Add Watermark to Video Guide
 *
 * Demonstrates adding text and image watermarks to videos:
 * - Creating text watermarks with styling
 * - Creating image watermarks from logos
 * - Positioning watermarks on the canvas
 * - Setting watermark duration to match video
 * - Adding drop shadows for visibility
 * - Configuring opacity and blend modes
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
    // Create a video scene from a sample video
    const videoUrl = 'https://img.ly/static/ubq_video_samples/bbb.mp4';
    await cesdk.engine.scene.createFromVideo(videoUrl);

    const engine = cesdk.engine;
    const page = engine.scene.getCurrentPage()!;

    // Get page dimensions for watermark positioning
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Get the page duration (set automatically from the video)
    const videoDuration = engine.block.getDuration(page);
    // eslint-disable-next-line no-console
    console.log('Video duration from page:', videoDuration);

    // ===== TEXT WATERMARK =====

    // Create a text watermark for copyright notice
    const textWatermark = engine.block.create('text');

    // Use Auto sizing so the text block grows to fit its content
    engine.block.setWidthMode(textWatermark, 'Auto');
    engine.block.setHeightMode(textWatermark, 'Auto');

    // Set the watermark text content using replaceText
    engine.block.replaceText(textWatermark, 'All rights reserved © 2025');

    // Position in bottom-left corner with padding
    const textPadding = 20;
    engine.block.setPositionX(textWatermark, textPadding);
    engine.block.setPositionY(textWatermark, pageHeight - textPadding - 20);

    // Style the text watermark with a subtle font size
    engine.block.setFloat(textWatermark, 'text/fontSize', 4);
    engine.block.setTextColor(textWatermark, { r: 1, g: 1, b: 1, a: 1 }); // White text

    // Set text alignment to left
    engine.block.setEnum(textWatermark, 'text/horizontalAlignment', 'Left');

    // Set watermark opacity for subtle appearance
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

    // Select the page to show the timeline
    engine.block.setSelected(page, true);

    // Zoom to fit the page and enable auto-fit for responsive resizing
    await engine.scene.zoomToBlock(page, {
      padding: { left: 40, top: 40, right: 40, bottom: 40 }
    });
    engine.scene.enableZoomAutoFit(page, 'Horizontal', 40, 40);

    // Start playback automatically
    try {
      engine.block.setPlaying(page, true);
      // eslint-disable-next-line no-console
      console.log(
        'Video watermark guide initialized. Playback started with text and logo watermarks visible.'
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        'Video watermark guide initialized. Click play button to start playback.'
      );
    }
  }
}

export default Example;
