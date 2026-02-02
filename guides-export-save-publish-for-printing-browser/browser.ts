import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Export for Printing Guide
 *
 * This example demonstrates:
 * - Exporting designs as print-ready PDFs
 * - Configuring high compatibility mode for complex designs
 * - Generating underlayers for special media (DTF, fabric, glass)
 * - Setting scene DPI for print resolution
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load a template scene - this will be our print design
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Get the scene and page
    const scene = engine.scene.get();
    if (!scene) {
      throw new Error('No scene found');
    }
    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found');
    }

    // Set print resolution (DPI) on the scene
    // 300 DPI is standard for high-quality print output
    engine.block.setFloat(scene, 'scene/dpi', 300);

    // Helper function to download blob
    const downloadBlob = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    };

    // Export PDF with high compatibility mode
    const exportWithHighCompatibility = async () => {
      // Enable high compatibility mode for consistent rendering across PDF viewers
      // This rasterizes complex elements like gradients with transparency at the scene's DPI
      const pdfBlob = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: true
      });

      downloadBlob(pdfBlob, 'print-high-compatibility.pdf');
      cesdk.ui.showNotification({
        message: `PDF exported with high compatibility (${(pdfBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export PDF without high compatibility (faster, smaller files)
    const exportStandardPdf = async () => {
      // Disable high compatibility for faster exports when targeting modern PDF viewers
      // Complex elements remain as vectors but may render differently across viewers
      const pdfBlob = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: false
      });

      downloadBlob(pdfBlob, 'print-standard.pdf');
      cesdk.ui.showNotification({
        message: `Standard PDF exported (${(pdfBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Define underlayer spot color and export with underlayer
    const exportWithUnderlayer = async () => {
      // Define the underlayer spot color before export
      // This creates a named spot color that will be used for the underlayer ink
      // The RGB values (0.8, 0.8, 0.8) provide a preview representation
      engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

      // Export with underlayer enabled for DTF or special media printing
      // The underlayer generates a shape behind design elements filled with the spot color
      const pdfBlob = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: true,
        exportPdfWithUnderlayer: true,
        underlayerSpotColorName: 'RDG_WHITE',
        // Negative offset shrinks the underlayer inward to prevent visible edges
        underlayerOffset: -2.0
      });

      downloadBlob(pdfBlob, 'print-with-underlayer.pdf');
      cesdk.ui.showNotification({
        message: `PDF exported with underlayer (${(pdfBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Export with custom target size
    const exportWithTargetSize = async () => {
      // Export with specific dimensions for print output
      // targetWidth and targetHeight control the exported PDF dimensions in pixels
      const pdfBlob = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: true,
        targetWidth: 2480, // A4 at 300 DPI (210mm)
        targetHeight: 3508 // A4 at 300 DPI (297mm)
      });

      downloadBlob(pdfBlob, 'print-a4-300dpi.pdf');
      cesdk.ui.showNotification({
        message: `A4 PDF exported (${(pdfBlob.size / 1024).toFixed(1)} KB)`,
        type: 'success'
      });
    };

    // Configure navigation bar with export buttons
    cesdk.ui.setNavigationBarOrder([
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportWithHighCompatibility,
        key: 'export-high-compat',
        label: 'High Compat PDF',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportStandardPdf,
        key: 'export-standard',
        label: 'Standard PDF',
        icon: '@imgly/Save',
        variant: 'plain'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportWithUnderlayer,
        key: 'export-underlayer',
        label: 'With Underlayer',
        icon: '@imgly/Save',
        variant: 'plain',
        color: 'accent'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportWithTargetSize,
        key: 'export-a4',
        label: 'A4 @ 300 DPI',
        icon: '@imgly/Save',
        variant: 'plain'
      }
    ]);

    cesdk.ui.showNotification({
      message:
        'Use the export buttons to export print-ready PDFs with different options',
      type: 'info',
      duration: 'infinite'
    });
  }
}

export default Example;
