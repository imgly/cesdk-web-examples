import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Video Limitations Guide
 *
 * Demonstrates how to query video processing limitations in CE.SDK:
 * - Querying maximum export size
 * - Monitoring memory usage and availability
 * - Understanding resolution and duration constraints
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

    // Load assets and create a video scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;

    // Query the maximum export dimensions supported by this device
    const maxExportSize = engine.editor.getMaxExportSize();
    console.log('Maximum export size:', maxExportSize, 'pixels');
    // The maximum export size depends on the GPU texture size limit
    // Typical values: 4096, 8192, or 16384 pixels

    // Query current memory consumption
    const usedMemory = engine.editor.getUsedMemory();
    const usedMemoryMB = (usedMemory / (1024 * 1024)).toFixed(2);
    console.log('Memory used:', usedMemoryMB, 'MB');

    // Query available memory for video processing
    const availableMemory = engine.editor.getAvailableMemory();
    const availableMemoryMB = (availableMemory / (1024 * 1024)).toFixed(2);
    console.log('Memory available:', availableMemoryMB, 'MB');
    // Browser tabs typically cap around 2GB due to WebAssembly's 32-bit address space

    // Calculate memory utilization percentage
    const totalMemory = usedMemory + availableMemory;
    const memoryUtilization = ((usedMemory / totalMemory) * 100).toFixed(1);
    console.log('Memory utilization:', memoryUtilization, '%');

    // Check if a specific export size is feasible
    const desiredWidth = 3840; // 4K UHD
    const desiredHeight = 2160;
    const canExport4K =
      desiredWidth <= maxExportSize && desiredHeight <= maxExportSize;
    console.log(
      'Can export at 4K UHD (3840x2160):',
      canExport4K ? 'Yes' : 'No'
    );

    // Add a sample video to demonstrate the editor with video content
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : engine.scene.get();

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create a video block that fills the page
    const videoBlock = await engine.block.addVideo(
      videoUri,
      pageWidth,
      pageHeight
    );

    // Position the video at the center of the page
    engine.block.setPositionX(videoBlock, 0);
    engine.block.setPositionY(videoBlock, 0);

    // Select the video block
    engine.block.setSelected(videoBlock, true);

    // Re-check memory after loading video content
    const usedAfterLoad = engine.editor.getUsedMemory();
    const availableAfterLoad = engine.editor.getAvailableMemory();
    const usedAfterLoadMB = (usedAfterLoad / (1024 * 1024)).toFixed(2);
    const availableAfterLoadMB = (availableAfterLoad / (1024 * 1024)).toFixed(
      2
    );
    console.log('After loading video:');
    console.log('  Memory used:', usedAfterLoadMB, 'MB');
    console.log('  Memory available:', availableAfterLoadMB, 'MB');

    // Log summary of device capabilities
    console.log('--- Device Capabilities Summary ---');
    console.log('Max export dimension:', maxExportSize, 'px');
    console.log('4K UHD support:', canExport4K ? 'Supported' : 'Not supported');
    console.log(
      'Initial memory:',
      usedMemoryMB,
      'MB used /',
      availableMemoryMB,
      'MB available'
    );
    console.log(
      'Open the browser console to view detailed limitation information.'
    );
  }
}

export default Example;
