import {
  MimeType,
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
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
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Export to PDF Guide
 *
 * This example demonstrates:
 * - Exporting designs as PDF documents
 * - Configuring high compatibility mode for consistent rendering
 * - Generating underlayers for special media printing
 * - Controlling output dimensions
 * - Using the built-in export action
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());


    const engine = cesdk.engine;

    // Load a template scene and zoom to fit
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');

    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Register a custom export action with PDF-specific options
    cesdk.actions.register('exportDesign', async () => {
      // Export the scene block to include all pages in the PDF
      const scene = engine.scene.get()!;

      // Merge PDF-specific defaults with provided options
      const blob = await engine.block.export(scene, {
        mimeType: 'application/pdf',
        exportPdfWithHighCompatibility: true
      });

      await cesdk.utils.downloadFile(blob, 'application/pdf');
    });

    // Configure navigation bar with export buttons using insertOrderComponent
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-pdf',
          label: 'PDF',
          icon: '@imgly/Download',
          onClick: async () => {
            // Export scene to include all pages in the PDF
            const scene = engine.scene.get()!;
            // Export scene as PDF (includes all pages)
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf'
            });
            // Download using CE.SDK utils
            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-high-compat',
          label: 'High Compat',
          icon: '@imgly/Download',
          onClick: async () => {
            // Export scene to include all pages in the PDF
            const scene = engine.scene.get()!;
            // Enable high compatibility mode for consistent rendering across PDF viewers
            // This rasterizes complex elements like gradients with transparency at scene DPI
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf',
              exportPdfWithHighCompatibility: true
            });
            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-underlayer',
          label: 'Underlayer',
          icon: '@imgly/Download',
          onClick: async () => {
            // Export scene to include all pages in the PDF
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
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-a4',
          label: 'A4 @ 300 DPI',
          icon: '@imgly/Download',
          onClick: async () => {
            // Export scene to include all pages in the PDF
            const scene = engine.scene.get()!;
            // Export with specific dimensions for print output
            const pdfBlob = await engine.block.export(scene, {
              mimeType: 'application/pdf',
              targetWidth: 2480, // A4 at 300 DPI (210mm)
              targetHeight: 3508 // A4 at 300 DPI (297mm)
            });
            await cesdk.utils.downloadFile(pdfBlob, 'application/pdf');
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-action',
          label: 'Export',
          icon: '@imgly/Download',
          onClick: () => {
            // Run built-in export with PDF format
            cesdk.actions.run('exportDesign', { mimeType: 'application/pdf' });
          }
        }
      ]
    });
  }
}

export default Example;
