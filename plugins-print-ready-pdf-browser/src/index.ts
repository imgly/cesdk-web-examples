import CreativeEditorSDK from '@cesdk/cesdk-js';
// @ts-expect-error - Plugin types will be available in future release
import { convertToPDFX3 } from '@imgly/plugin-print-ready-pdfs-web';

let cesdk: CreativeEditorSDK;

const config = {
  // By default, CE.SDK runs with a watermark.
  // Get a free trial license at https://img.ly/forms/free-trial to remove it.
  // Uncomment the line below and add your license key:
  // license: 'your-license-key-here',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...((import.meta as any).env?.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  })
};

async function init() {
  // Initialize CE.SDK
  cesdk = await CreativeEditorSDK.create('#cesdk-container', config);

  cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
    id: 'ly.img.actions.navigationBar',
    children: [
      {
        key: 'export-print-ready-pdf',
        id: 'ly.img.action.navigationBar',
        label: 'Export Print-Ready PDF',
        iconName: '@imgly/Download',
        onClick: async () => {
          await exportPrintReadyPDF();
        }
      }
    ]
  });

  // Load default scene
  await cesdk.actions.run('scene.create', { page: { sourceId: 'ly.img.page.presets', assetId: 'ly.img.page.presets.print.iso.a6.landscape' } });
  await cesdk.addDefaultAssetSources();
  await cesdk.addDemoAssetSources();
}

async function exportPrintReadyPDF() {
  try {
    // Check if CE.SDK is initialized
    if (!cesdk) {
      throw new Error('CE.SDK not initialized');
    }

    // Get current scene ID
    const scene = cesdk.engine.scene.get();

    if (scene == null) {
      throw new Error('No scene loaded');
    }

    // Get all pages in the scene
    const pages = cesdk.engine.block.findByType('page');

    if (pages.length === 0) {
      throw new Error('No pages found in scene');
    }

    // Export first page as PDF
    const pdfBlob = await cesdk.engine.block.export(pages[0], {
      mimeType: 'application/pdf'
    });

    // Convert to print-ready PDF/X-3 format
    const printReadyPDF = await convertToPDFX3(pdfBlob, {
      outputProfile: 'fogra39', // European printing standard
      title: 'Print-Ready Export'
    });

    // Download the print-ready PDF
    const url = URL.createObjectURL(printReadyPDF);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design-print-ready.pdf';
    link.click();
    URL.revokeObjectURL(url);

    console.log('Print-ready PDF exported successfully!');
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export print-ready PDF. Please try again.');
  }
}

// Initialize when page loads
init().catch((error) => {
  console.error('Failed to initialize CE.SDK:', error);
});
