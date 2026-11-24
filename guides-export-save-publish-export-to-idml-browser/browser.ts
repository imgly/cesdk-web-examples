import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  ImageColorsAssetSource,
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

import { exportIdmlPackage } from '@imgly/idml-exporter';

import CreativeEngine, { type Configuration } from '@cesdk/engine';
import { exportPsd } from '@imgly/psd-exporter';
import JSZip from 'jszip';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  constructor(private readonly engineConfig: Partial<Configuration>) {}

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
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
    await engine.scene.loadFromArchiveURL(
      new URL('./assets/strategy-quote.imgly', import.meta.url).href,
      false,
      true
    );
    const page = engine.scene.getCurrentPage();
    if (page === null) throw new Error('The design has no page');
    await engine.scene.zoomToBlock(page, { padding: 40 });

    cesdk.ui.registerComponent(
      'ly.img.idml-export.navigationBar',
      ({ builder, state }) => {
        const exporting = state('exporting', false);
        const activeFormat = state('activeFormat', 'idml');

        builder.Dropdown('export-package', {
          label: exporting.value
            ? `Exporting ${activeFormat.value.toUpperCase()}…`
            : 'Export',
          color: 'accent',
          variant: 'regular',
          isLoading: exporting.value,
          isDisabled: exporting.value,
          children: ({ close }) => {
            builder.Button('download-idml-package', {
              label: 'IDML (InDesign)',
              variant: 'plain',
              isDisabled: exporting.value,
              onClick: async () => {
                if (exporting.value) return;
                close();
                activeFormat.setValue('idml');
                exporting.setValue(true);
                try {
                  const { zip, logger, skippedFonts } = await exportIdmlPackage(
                    engine,
                    { name: 'design' }
                  );

                  const messages = logger.getMessages();
                  const needsReview =
                    skippedFonts.length > 0 ||
                    messages.some((message) => message.type !== 'info');
                  if (needsReview) {
                    console.warn('IDML export needs review:', {
                      messages,
                      skippedFonts
                    });
                  }

                  downloadFile(
                    new Blob([zip.slice().buffer], { type: 'application/zip' }),
                    'design-idml.zip'
                  );

                  cesdk.ui.showNotification({
                    type: needsReview ? 'warning' : 'success',
                    message: needsReview
                      ? 'Download ready. Some content or fonts need review. Check the document in InDesign.'
                      : 'Download ready. Unzip the package and keep the fonts beside the document.',
                    duration: needsReview ? 'infinite' : 'medium'
                  });
                } catch (error) {
                  console.error('IDML export failed:', error);
                  cesdk.ui.showNotification({
                    type: 'error',
                    message:
                      'The design could not be exported. Please try again.'
                  });
                } finally {
                  exporting.setValue(false);
                }
              }
            });

            builder.Button('download-psd-package', {
              label: 'PSD (Photoshop)',
              tooltip: 'Download all pages as Photoshop documents',
              variant: 'plain',
              isDisabled: exporting.value,
              onClick: async () => {
                if (exporting.value) return;
                close();
                activeFormat.setValue('psd');
                exporting.setValue(true);
                try {
                  const { psds, logger } = await exportPsdFromCopy(
                    engine,
                    this.engineConfig
                  );

                  const messages = logger.getMessages();
                  const needsReview = messages.some(
                    (message) => message.type !== 'info'
                  );
                  if (needsReview) {
                    console.warn('PSD export needs review:', messages);
                  }

                  const zip = new JSZip();
                  psds.forEach(({ psd }, index) => {
                    zip.file(`page-${index + 1}.psd`, psd);
                  });
                  downloadFile(
                    await zip.generateAsync({ type: 'blob' }),
                    'design-psd.zip'
                  );

                  cesdk.ui.showNotification({
                    type: needsReview ? 'warning' : 'success',
                    message: needsReview
                      ? 'Download ready. Some content needs review. Check the documents in Photoshop.'
                      : 'Download ready. Unzip the package and open the documents in Photoshop.',
                    duration: needsReview ? 'infinite' : 'medium'
                  });
                } catch (error) {
                  console.error('PSD export failed:', error);
                  cesdk.ui.showNotification({
                    type: 'error',
                    message:
                      'The design could not be exported to PSD. Please try again.'
                  });
                } finally {
                  exporting.setValue(false);
                }
              }
            });
          }
        });
      }
    );
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      'ly.img.idml-export.navigationBar'
    ]);
  }
}

// The export changes the scene while it runs, so it works on a copy in a second engine.
async function exportPsdFromCopy(
  engine: CreativeEngine,
  engineConfig: Partial<Configuration>
) {
  const archiveUrl = URL.createObjectURL(await engine.scene.saveToArchive());
  try {
    const exportEngine = await CreativeEngine.init(engineConfig);
    try {
      await exportEngine.scene.loadFromArchiveURL(archiveUrl);
      return await exportPsd(exportEngine);
    } finally {
      exportEngine.dispose();
    }
  } finally {
    URL.revokeObjectURL(archiveUrl);
  }
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default Example;
