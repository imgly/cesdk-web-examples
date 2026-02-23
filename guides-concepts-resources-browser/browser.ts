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
 * CE.SDK Plugin: Resources Guide
 *
 * Demonstrates resource management in CE.SDK:
 * - On-demand resource loading
 * - Preloading resources with forceLoadResources()
 * - Preloading audio/video with forceLoadAVResource()
 * - Finding transient resources
 * - Persisting transient resources during save
 * - Relocating resources when URLs change
 * - Finding all media URIs in a scene
 * - Detecting MIME types
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Video mode (required for video resources)
    cesdk.feature.enable('ly.img.video');
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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }
    });

    const engine = cesdk.engine;

    // Get the current scene and page
    const scene = engine.scene.get();
    if (scene === null) {
      throw new Error('No scene available');
    }

    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Layout configuration: two blocks with equal margins
    const margin = 30;
    const gap = 20;
    const blockWidth = 300;
    const blockHeight = 200;

    // Set page dimensions to hug the blocks
    const pageWidth = margin + blockWidth + gap + blockWidth + margin;
    const pageHeight = margin + blockHeight + margin;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Create a graphic block with an image fill
    // Resources are loaded on-demand when the engine renders the block
    const imageBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);
    engine.block.setPositionX(imageBlock, margin);
    engine.block.setPositionY(imageBlock, margin);
    engine.block.setWidth(imageBlock, blockWidth);
    engine.block.setHeight(imageBlock, blockHeight);

    // Create an image fill - the image loads when the block is rendered
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_4.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setEnum(imageBlock, 'contentFill/mode', 'Cover');
    engine.block.appendChild(page, imageBlock);
    console.log('Created image block - resource loads on-demand when rendered');

    // Preload all resources in the scene before rendering
    // This ensures resources are cached and ready for display
    console.log('Preloading all resources in the scene...');
    await engine.block.forceLoadResources([scene]);
    console.log('All resources preloaded successfully');

    // Preload specific blocks only (useful for optimizing load order)
    await engine.block.forceLoadResources([imageBlock]);
    console.log('Image block resources preloaded');

    // Create a second graphic block for video
    const videoBlock = engine.block.create('graphic');
    const videoShape = engine.block.createShape('rect');
    engine.block.setShape(videoBlock, videoShape);
    engine.block.setPositionX(videoBlock, margin + blockWidth + gap);
    engine.block.setPositionY(videoBlock, margin);
    engine.block.setWidth(videoBlock, blockWidth);
    engine.block.setHeight(videoBlock, blockHeight);

    // Create a video fill
    const videoFill = engine.block.createFill('video');
    engine.block.setString(
      videoFill,
      'fill/video/fileURI',
      'https://img.ly/static/ubq_video_samples/bbb.mp4'
    );
    engine.block.setFill(videoBlock, videoFill);
    engine.block.setEnum(videoBlock, 'contentFill/mode', 'Cover');
    engine.block.appendChild(page, videoBlock);

    // Preload video resource to query its properties
    console.log('Preloading video resource...');
    await engine.block.forceLoadAVResource(videoFill);
    console.log('Video resource preloaded');

    // Now we can query video properties
    const videoDuration = engine.block.getAVResourceTotalDuration(videoFill);
    const videoWidth = engine.block.getVideoWidth(videoFill);
    const videoHeight = engine.block.getVideoHeight(videoFill);
    console.log(
      `Video properties - Duration: ${videoDuration}s, Size: ${videoWidth}x${videoHeight}`
    );

    // Find all transient resources that need persistence before export
    // Transient resources include buffers and blobs that won't survive serialization
    const transientResources = engine.editor.findAllTransientResources();
    console.log(`Found ${transientResources.length} transient resources`);
    for (const resource of transientResources) {
      console.log(
        `Transient: URL=${resource.URL}, Size=${resource.size} bytes`
      );
    }

    // Get all media URIs referenced in the scene
    // Useful for pre-fetching or validating resource availability
    const mediaURIs = engine.editor.findAllMediaURIs();
    console.log(`Scene contains ${mediaURIs.length} media URIs:`);
    for (const uri of mediaURIs) {
      console.log(`  - ${uri}`);
    }

    // Detect the MIME type of a resource
    // This downloads the resource if not already cached
    const imageUri = 'https://img.ly/static/ubq_samples/sample_4.jpg';
    const mimeType = await engine.editor.getMimeType(imageUri);
    console.log(`MIME type of ${imageUri}: ${mimeType}`);

    // Relocate a resource when its URL changes
    // This updates the internal cache mapping without modifying scene data
    const oldUrl = 'https://example.com/old-location/image.jpg';
    const newUrl = 'https://cdn.example.com/new-location/image.jpg';

    // In a real scenario, you would relocate after uploading to a new location:
    // engine.editor.relocateResource(oldUrl, newUrl);
    console.log(`Resource relocation example: ${oldUrl} -> ${newUrl}`);
    console.log('Use relocateResource() after uploading to a CDN');

    // When saving, use onDisallowedResourceScheme to handle transient resources
    // This callback is called for each resource with a disallowed scheme (like buffer: or blob:)
    const sceneString = await engine.block.saveToString(
      [scene],
      ['http', 'https'], // Only allow http and https URLs
      async (url: string) => {
        // In a real app, upload the resource and return the permanent URL
        // const response = await uploadToCDN(url);
        // return response.permanentUrl;

        // For this example, we'll just log the URL
        console.log(`Would upload transient resource: ${url}`);
        // Return the original URL since we're not actually uploading
        return url;
      }
    );
    console.log(`Scene saved to string (${sceneString.length} characters)`);

    // Set playback time to show video content in the scene
    engine.block.setPlaybackTime(page, 2);

    console.log('Resources guide initialized successfully.');
    console.log(
      'Demonstrated: on-demand loading, preloading, transient resources, and relocation.'
    );
  }
}

export default Example;
