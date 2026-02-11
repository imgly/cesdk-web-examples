import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Export Overview Guide
 *
 * This example demonstrates:
 * - Exporting designs to different formats (PNG, JPEG, WebP, PDF)
 * - Configuring export options (compression, quality, target size)
 * - Exporting with color masks for print workflows
 * - Downloading exported files to user device
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load a template scene from a remote URL
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Get the page
    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found');
    }

    // Helper function to download blob
    const downloadBlob = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    };

    // Export to PNG with compression
    const exportToPng = async () => {
      const pngBlob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 5 // 0-9, higher = smaller file, slower
      });
      downloadBlob(pngBlob, 'design.png');
      cesdk.ui.showNotification({
        message: `PNG exported (${(pngBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export to JPEG with quality setting
    const exportToJpeg = async () => {
      const jpegBlob = await engine.block.export(page, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.9 // 0-1, higher = better quality, larger file
      });
      downloadBlob(jpegBlob, 'design.jpg');
      cesdk.ui.showNotification({
        message: `JPEG exported (${(jpegBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export to WebP with lossless quality
    const exportToWebp = async () => {
      const webpBlob = await engine.block.export(page, {
        mimeType: 'image/webp',
        webpQuality: 1.0 // 1.0 = lossless, smaller files than PNG
      });
      downloadBlob(webpBlob, 'design.webp');
      cesdk.ui.showNotification({
        message: `WebP exported (${(webpBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export to PDF
    const exportToPdf = async () => {
      const pdfBlob = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: true // Rasterize for broader viewer support
      });
      downloadBlob(pdfBlob, 'design.pdf');
      cesdk.ui.showNotification({
        message: `PDF exported (${(pdfBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export with target size
    const exportWithTargetSize = async () => {
      const blob = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 1920,
        targetHeight: 1080
      });
      downloadBlob(blob, 'design-hd.png');
      cesdk.ui.showNotification({
        message: `HD export complete (${(blob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export with color mask - removes specified RGB color and creates alpha mask
    const exportWithColorMask = async () => {
      // Export with color mask - RGB values are in 0.0-1.0 range
      // Pure magenta (1.0, 0.0, 1.0) is commonly used for registration marks
      const [maskedImage, alphaMask] = await engine.block.exportWithColorMask(
        page,
        1.0, // maskColorR - red component
        0.0, // maskColorG - green component
        1.0, // maskColorB - blue component (RGB: pure magenta)
        { mimeType: 'image/png' }
      );
      downloadBlob(maskedImage, 'design-masked.png');
      downloadBlob(alphaMask, 'design-alpha-mask.png');
      cesdk.ui.showNotification({
        message: `Color mask export: image (${(maskedImage.size / 1024).toFixed(1)} KB) + mask (${(alphaMask.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Configure navigation bar with export buttons
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportToPng,
        key: 'export-png',
        label: 'PNG',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportToJpeg,
        key: 'export-jpeg',
        label: 'JPEG',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportToWebp,
        key: 'export-webp',
        label: 'WebP',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportToPdf,
        key: 'export-pdf',
        label: 'PDF',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportWithTargetSize,
        key: 'export-hd',
        label: 'HD',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportWithColorMask,
        key: 'export-mask',
        label: 'Mask',
        icon: '@imgly/Save',
        variant: 'plain',
        color: 'accent'
      }
    ]);

    cesdk.ui.showNotification({
      message: 'Use the export buttons to export in different formats',
      type: 'info',
      duration: 'infinite'
    });
  }
}

export default Example;
