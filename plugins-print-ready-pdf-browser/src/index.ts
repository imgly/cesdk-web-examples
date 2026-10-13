import CreativeEditorSDK from '@cesdk/cesdk-js';
import { checkPDFX, convertToPDFX, exportPDFX } from '@imgly/pdfx-exporter';
import type { PDFXStandard } from '@imgly/pdfx-exporter';
import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  ImageColorsAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TypefaceAssetSource,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from '../design-editor/plugin';

type Editor = InstanceType<typeof CreativeEditorSDK>;

async function init() {
  const cesdk = await CreativeEditorSDK.create('#cesdk-container', {
    // license: 'YOUR_CESDK_LICENSE_KEY',
  });
  await cesdk.addPlugin(new DesignEditorConfig());
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new ImageColorsAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new DemoAssetSources());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.actions.run('scene.create', { mode: 'Design' });

  const engine = cesdk.engine;
  const scene = engine.scene.get();
  const page = engine.scene.getCurrentPage();
  if (scene == null || page == null) {
    throw new Error('No design page available');
  }

  engine.scene.setDesignUnit('Millimeter');
  engine.block.setFloat(scene, 'scene/dpi', 300);
  engine.block.setWidth(page, 148);
  engine.block.setHeight(page, 105);
  engine.block.setBool(page, 'page/marginEnabled', true);
  for (const side of ['top', 'bottom', 'left', 'right']) {
    engine.block.setFloat(page, `page/margin/${side}`, 3);
  }

  engine.block.setColor(page, 'fill/solid/color', {
    r: 0.08,
    g: 0.2,
    b: 0.4,
    a: 1
  });
  await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_1.jpg',
    {
      size: { width: 82, height: 111 },
      x: -3,
      y: -3
    }
  );
  const text = engine.block.create('text');
  engine.block.appendChild(page, text);
  engine.block.replaceText(text, 'READY\nFOR PRINT');
  engine.block.setPositionX(text, 86);
  engine.block.setPositionY(text, 22);
  engine.block.setWidth(text, 58);
  engine.block.setHeight(text, 60);
  engine.block.setTextFontSize(text, 22);
  engine.block.setColor(text, 'fill/solid/color', { r: 1, g: 1, b: 1, a: 1 });
  await engine.scene.zoomToBlock(page);

  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.navigation.bar', position: 'end' },
    {
      id: 'ly.img.actions.navigationBar',
      children: (['PDF/X-4', 'PDF/X-3', 'PDF/X-1a'] as const).map(
        (standard) => ({
          key: `export-${standard}`,
          id: 'ly.img.action.navigationBar',
          label: `Export ${standard}`,
          iconName: '@imgly/Download',
          onClick: () => exportPrintReadyPDF(cesdk, standard)
        })
      )
    }
  );
  (window as Window & { cesdk?: Editor }).cesdk = cesdk;
}

async function exportPrintReadyPDF(cesdk: Editor, standard: PDFXStandard) {
  const dialog = cesdk.ui.showDialog({
    type: 'loading',
    content: 'Exporting PDF/X',
    actions: []
  });
  try {
    const printReadyPDF = await exportPDFX(cesdk.engine, {
      outputStandard: standard,
      outputProfile: 'fogra39',
      nonPrinterProfile: 'reject',
      title: 'Print-Ready Export'
    });

    const findings = await checkPDFX(printReadyPDF, standard);
    if (findings.length > 0) {
      throw new Error(
        findings.map(({ rule, message }) => `${rule}: ${message}`).join('\n')
      );
    }

    const url = URL.createObjectURL(printReadyPDF);
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `design-${standard.replace('/', '-')}.pdf`;
      link.click();
    } finally {
      URL.revokeObjectURL(url);
    }
    cesdk.ui.showNotification({
      message: `${standard} exported`,
      type: 'success'
    });
  } catch (error) {
    cesdk.ui.showNotification({
      message: error instanceof Error ? error.message : 'PDF/X export failed',
      type: 'error'
    });
  } finally {
    cesdk.ui.closeDialog(dialog);
  }
}

export async function convertExistingPDF(pdfBlob: Blob) {
  return convertToPDFX(pdfBlob, {
    outputStandard: 'PDF/X-4',
    outputProfile: 'fogra39',
    nonPrinterProfile: 'reject'
  });
}

init().catch((error) => {
  console.error('Failed to initialize CE.SDK:', error);
});
