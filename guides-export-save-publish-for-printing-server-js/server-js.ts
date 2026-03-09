import CreativeEngine from '@cesdk/node';
import { writeFileSync } from 'fs';

/**
 * CE.SDK Server Example: Export for Printing
 *
 * This example demonstrates:
 * - Exporting designs as print-ready PDFs
 * - Configuring high compatibility mode for complex designs
 * - Generating underlayers for special media (DTF, fabric, glass)
 * - Setting scene DPI for print resolution
 */
async function main(): Promise<void> {
  // Initialize the Creative Engine
  const engine = await CreativeEngine.init({
    license: process.env.CESDK_LICENSE ?? ''
  });

  try {
    // Load a template scene - this will be our print design
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
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

    // Enable high compatibility mode for consistent rendering across PDF viewers
    // This rasterizes complex elements like gradients with transparency at the scene's DPI
    const highCompatPdf = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true
    });

    // Convert blob to buffer and write to file system
    const highCompatBuffer = Buffer.from(await highCompatPdf.arrayBuffer());
    writeFileSync('print-high-compatibility.pdf', highCompatBuffer);
    console.log(
      `High compatibility PDF exported (${(highCompatBuffer.length / 1024).toFixed(1)} KB)`
    );

    // Disable high compatibility for faster exports when targeting modern PDF viewers
    // Complex elements remain as vectors but may render differently across viewers
    const standardPdf = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: false
    });

    const standardBuffer = Buffer.from(await standardPdf.arrayBuffer());
    writeFileSync('print-standard.pdf', standardBuffer);
    console.log(
      `Standard PDF exported (${(standardBuffer.length / 1024).toFixed(1)} KB)`
    );

    // Define the underlayer spot color before export
    // This creates a named spot color that will be used for the underlayer ink
    // The RGB values (0.8, 0.8, 0.8) provide a preview representation
    engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

    // Export with underlayer enabled for DTF or special media printing
    // The underlayer generates a shape behind design elements filled with the spot color
    const underlayerPdf = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true,
      exportPdfWithUnderlayer: true,
      underlayerSpotColorName: 'RDG_WHITE',
      // Negative offset shrinks the underlayer inward to prevent visible edges
      underlayerOffset: -2.0
    });

    const underlayerBuffer = Buffer.from(await underlayerPdf.arrayBuffer());
    writeFileSync('print-with-underlayer.pdf', underlayerBuffer);
    console.log(
      `PDF with underlayer exported (${(underlayerBuffer.length / 1024).toFixed(1)} KB)`
    );

    // Export with specific dimensions for print output
    // targetWidth and targetHeight control the exported PDF dimensions in pixels
    const targetSizePdf = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithHighCompatibility: true,
      targetWidth: 2480, // A4 at 300 DPI (210mm)
      targetHeight: 3508 // A4 at 300 DPI (297mm)
    });

    const targetSizeBuffer = Buffer.from(await targetSizePdf.arrayBuffer());
    writeFileSync('print-a4-300dpi.pdf', targetSizeBuffer);
    console.log(
      `A4 PDF exported (${(targetSizeBuffer.length / 1024).toFixed(1)} KB)`
    );

    console.log('\nAll PDFs exported successfully!');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
