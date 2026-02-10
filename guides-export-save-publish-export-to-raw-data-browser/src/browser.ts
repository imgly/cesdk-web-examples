import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from '../package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set explicit page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create a single image block to demonstrate raw data export
    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: 800, height: 600 }
    });
    engine.block.appendChild(page, imageBlock);
    engine.block.setPositionX(imageBlock, 0);
    engine.block.setPositionY(imageBlock, 0);

    // Add export button to navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: ['ly.img.exportImage.navigationBar']
    });

    // Override the built-in exportDesign action
    cesdk.actions.register('exportDesign', async () => {
      // Export to raw pixel data
      const width = Math.floor(engine.block.getWidth(imageBlock));
      const height = Math.floor(engine.block.getHeight(imageBlock));

      const blob = await engine.block.export(imageBlock, {
        mimeType: 'application/octet-stream',
        targetWidth: width,
        targetHeight: height
      });

      // Convert blob to raw pixel array
      const arrayBuffer = await blob.arrayBuffer();
      const pixelData = new Uint8Array(arrayBuffer);

      // Apply grayscale processing
      const processedData = this.toGrayscale(pixelData, width, height);

      // Download processed image
      await this.downloadProcessedImage(processedData, width, height);
    });
  }

  /**
   * Convert image to grayscale by averaging RGB channels
   */
  private toGrayscale(
    pixelData: Uint8Array,
    _width: number,
    _height: number
  ): Uint8Array {
    const result = new Uint8Array(pixelData);
    for (let i = 0; i < result.length; i += 4) {
      const avg = Math.round((result[i] + result[i + 1] + result[i + 2]) / 3);
      result[i] = avg; // R
      result[i + 1] = avg; // G
      result[i + 2] = avg; // B
      // Keep alpha unchanged: result[i + 3]
    }
    return result;
  }

  /**
   * Convert processed pixel data to PNG and trigger download
   */
  private async downloadProcessedImage(
    pixelData: Uint8Array,
    width: number,
    height: number
  ): Promise<void> {

    // Create canvas and render pixel data
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Create ImageData from pixel array
    const imageData = new ImageData(
      new Uint8ClampedArray(pixelData),
      width,
      height
    );
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/png',
        1.0
      );
    });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'processed-image.png';
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  }
}

export default Example;
