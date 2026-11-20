import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  ImageColorsAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import { exportFig } from '@imgly/figma-exporter';
import packageJson from './package.json';

const TEMPLATE_URL =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

/**
 * CE.SDK Plugin: Export to Figma
 *
 * Demonstrates `@imgly/figma-exporter` in the browser:
 * - Exporting the editor's scene as a `.fig` file
 * - Downloading the file
 * - Reporting the conversion notes
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

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

    await engine.scene.loadFromURL(TEMPLATE_URL);
    await cesdk.actions.run('zoom.toPage', { page: 'first', autoFit: true });

    const exportToFigma = async () => {
      // The export reads the current scene, so it includes the user's edits.
      const { fig, logger } = await exportFig(engine, {
        fileName: 'CE.SDK design'
      });

      const url = URL.createObjectURL(new Blob([fig]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'design.fig';
      document.body.append(link);
      link.click();
      link.remove();
      // Keep the URL until the browser has started the download.
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      // Each message has a `type`, a stable `code` and a readable `message`.
      const messages = logger.getMessages();
      const counts = new Map<string, number>();
      for (const message of messages) {
        console.info(`${message.type}: [${message.code}] ${message.message}`);
        counts.set(message.code, (counts.get(message.code) ?? 0) + 1);
      }
      const needsReview = messages.some((message) => message.type !== 'info');
      const summary = [...counts]
        .map(([code, count]) => `${code} (${count})`)
        .join(', ');
      cesdk.ui.showNotification({
        type: needsReview ? 'warning' : 'success',
        message:
          messages.length > 0
            ? `Downloaded design.fig. Conversion notes: ${summary}.`
            : 'Downloaded design.fig.',
        duration: needsReview ? 'infinite' : 'long'
      });
    };

    cesdk.ui.registerComponent('figma.export', ({ builder, state }) => {
      const exporting = state('exporting', false);
      builder.Button('figma.export', {
        label: 'Export to Figma',
        icon: '@imgly/Download',
        variant: 'regular',
        color: 'accent',
        isLoading: exporting.value,
        isDisabled: exporting.value,
        onClick: async () => {
          exporting.setValue(true);
          // The export reads the scene while it runs, so the dialog blocks
          // the editor until the file is ready.
          const dialog = cesdk.utils.showLoadingDialog({
            title: 'Exporting to Figma',
            message: 'You can edit the design again when the download starts.',
            progress: 'indeterminate'
          });
          try {
            await exportToFigma();
          } catch (error) {
            cesdk.ui.showNotification({
              type: 'error',
              message: `Export failed: ${error instanceof Error ? error.message : String(error)}`
            });
          } finally {
            dialog.close();
            exporting.setValue(false);
          }
        }
      });
    });
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' }),
      'figma.export'
    ]);
  }
}

export default Example;
