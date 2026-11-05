import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  ColorPaletteAssetSource,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import { EPSImportError, placeEPS, replaceEPS } from '@imgly/eps-importer';
import { createConversionRuntime } from '@imgly/pdf-conversion-utils';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) throw new Error('CE.SDK is required for this example');

    await cesdk.addPlugin(new DesignEditorConfig());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());
    const engine = cesdk.engine;

    const templateURL = new URL(
      `${import.meta.env.BASE_URL}template.scene`,
      document.baseURI
    );
    const templateResponse = await fetch(templateURL);
    if (!templateResponse.ok) throw new Error('Could not load the template');
    await engine.scene.loadFromString(await templateResponse.text());
    let page = engine.block.findByType('page')[0];
    await cesdk.actions.run('zoom.toPage', { autoFit: true });

    const runtime = createConversionRuntime({
      assetBaseURL: new URL(
        `${import.meta.env.BASE_URL}pdf-conversion/`,
        document.baseURI
      )
    });
    // No worker or WASM request is made until the first import.
    // Call await runtime.preload() here only if you intend to warm it eagerly.
    let active: AbortController | undefined;

    const importArtwork = async (replace: boolean) => {
      if (active) return;
      const controller = new AbortController();
      active = controller;
      try {
        const matches = engine.block.findByName('Artwork');
        if (replace && matches.length !== 1) {
          throw new Error(
            'The template must contain exactly one Artwork placeholder.'
          );
        }
        const target = matches[0];
        // The imported group keeps the name, so a second replace finds a group.
        if (
          replace &&
          engine.block.getType(target) !== '//ly.img.ubq/graphic'
        ) {
          throw new Error(
            'The Artwork placeholder was already replaced. Undo the replacement to try again.'
          );
        }
        if (replace) {
          let ancestor: number | null = target;
          while (
            ancestor !== null &&
            engine.block.getType(ancestor) !== '//ly.img.ubq/page'
          ) {
            ancestor = engine.block.getParent(ancestor);
          }
          if (ancestor === null)
            throw new Error('Artwork must belong to a page');
          page = ancestor;
        }
        // Capture the target before fetching or converting the file.

        const response = await fetch(
          new URL(`${import.meta.env.BASE_URL}artwork.eps`, document.baseURI),
          {
            signal: controller.signal
          }
        );
        if (!response.ok) throw new Error('Could not load the EPS artwork');
        const bytes = new Uint8Array(await response.arrayBuffer());
        const options = { runtime, signal: controller.signal };
        const result = replace
          ? await replaceEPS(engine, bytes, { ...options, target })
          : await placeEPS(engine, bytes, {
              ...options,
              parent: page,
              // The free band between the header and the placeholder.
              frame: { x: 54, y: 110, width: 360, height: 60 }
            });
        engine.block.select(result.group);

        // Info diagnostics include the Ghostscript banner.
        const warnings = result.diagnostics.filter(
          (diagnostic) => diagnostic.severity !== 'info'
        );
        for (const diagnostic of warnings) {
          console.warn(`[${diagnostic.stage}] ${diagnostic.message}`);
        }
        cesdk.ui.showNotification('EPS artwork imported as one movable group.');
      } catch (error) {
        if (controller.signal.aborted) {
          cesdk.ui.showNotification('Import cancelled. You can retry.');
        } else {
          if (error instanceof EPSImportError)
            console.error(error.code, error.diagnostics);
          cesdk.ui.showNotification(
            error instanceof Error ? error.message : 'EPS import failed'
          );
        }
      } finally {
        active = undefined;
      }
    };

    const exportPDF = async () => {
      const pdf = await engine.block.export(page, {
        mimeType: 'application/pdf',
        exportPdfWithDeviceCMYK: true
      });
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'eps-artwork.pdf';
      link.click();
      URL.revokeObjectURL(url);
    };

    cesdk.ui.registerComponent('guide.eps', ({ builder }) => {
      builder.Button('replace-eps', {
        label: 'Replace with EPS',
        color: 'accent',
        onClick: () => void importArtwork(true)
      });
      builder.Button('place-eps', {
        label: 'Add EPS',
        onClick: () => void importArtwork(false)
      });
      builder.Button('cancel-eps', {
        label: 'Cancel import',
        onClick: () => active?.abort()
      });
      builder.Button('export-eps', {
        label: 'Export PDF',
        onClick: () =>
          void exportPDF().catch((error) =>
            cesdk.ui.showNotification(String(error))
          )
      });
    });
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' }),
      'guide.eps'
    ]);

    window.addEventListener(
      'pagehide',
      () => {
        active?.abort();
        runtime.dispose();
        cesdk.dispose();
      },
      { once: true }
    );
  }
}

export default Example;
