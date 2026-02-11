import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: To PDF Guide
 *
 * This example demonstrates:
 * - Exporting designs as PDF documents
 * - Configuring PDF output settings (DPI, compatibility, underlayer)
 * - Adding a custom PDF export button to the navigation bar
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) throw new Error('CE.SDK instance is required');

    const engine = cesdk.engine;

    // Load a template scene
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage()!;
    await engine.scene.zoomToBlock(page);

    // Add PDF export buttons to the navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-pdf',
          label: 'PDF',
          icon: '@imgly/Download',
          onClick: async () => {
            // Export scene as PDF (includes all pages)
            const scene = engine.scene.get()!;
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf'
            });

            // Download using CE.SDK utils
            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');

            cesdk.ui.showNotification({
              message: 'PDF exported successfully',
              type: 'success'
            });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-high-compat',
          label: 'High Compat',
          icon: '@imgly/Download',
          onClick: async () => {
            const scene = engine.scene.get()!;

            // Enable high compatibility mode for consistent rendering across PDF viewers
            // This rasterizes complex elements like gradients with transparency at scene DPI
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf',
              exportPdfWithHighCompatibility: true
            });

            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
            cesdk.ui.showNotification({
              message: 'High compatibility PDF exported',
              type: 'success'
            });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-underlayer',
          label: 'Underlayer',
          icon: '@imgly/Download',
          onClick: async () => {
            const scene = engine.scene.get()!;

            // Define the underlayer spot color before export
            // RGB values (0.8, 0.8, 0.8) provide a preview representation
            engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);

            // Export with underlayer for special media printing
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf',
              exportPdfWithHighCompatibility: true,
              exportPdfWithUnderlayer: true,
              underlayerSpotColorName: 'RDG_WHITE',
              // Negative offset shrinks underlayer to prevent visible edges
              underlayerOffset: -2.0
            });

            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
            cesdk.ui.showNotification({
              message: 'PDF with underlayer exported',
              type: 'success'
            });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-dpi',
          label: 'Custom DPI',
          icon: '@imgly/Download',
          onClick: async () => {
            const scene = engine.scene.get()!;

            // Adjust the scene DPI for print-ready output
            // Higher DPI = better quality but larger file size
            engine.block.setFloat(scene, 'scene/dpi', 150);

            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf'
            });

            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
            cesdk.ui.showNotification({
              message: 'PDF exported at 150 DPI',
              type: 'success'
            });
          }
        }
      ]
    });
  }
}

export default Example;
