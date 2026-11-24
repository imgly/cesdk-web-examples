import type {
  CreativeEngine,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
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
import {
  importFig,
  importFigmaFile,
  type ImportResult,
  type LogMessage
} from '@imgly/figma-importer';
import packageJson from './package.json';

const PANEL_ID = 'figma.importPanel';

// The companion exporter wrote this design, and Figma saved it again with
// two canvases. It shows the file format, not every Figma feature.
const SAMPLE_URL = new URL('./assets/sample.fig', import.meta.url).href;

type FigmaPanelPayload = {
  canvases: readonly string[];
  index: number;
  messages: LogMessage[];
};

/**
 * CE.SDK Plugin: Import From Figma
 *
 * Demonstrates `@imgly/figma-importer` in the browser:
 * - Importing a `.fig` file into the editor's engine
 * - Letting users pick their own `.fig` file
 * - Switching between the canvases of the file
 * - Showing the conversion notes
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
      new DemoAssetSources({ include: ['ly.img.image.*'] })
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

    // The open file, so another canvas imports without a new file pick.
    let fileBytes: Uint8Array | undefined;
    let importing = false;

    const importCanvas = async (bytes: Uint8Array, index: number) => {
      // One engine builds one scene at a time, so ask the user to retry
      // instead of starting a second import.
      if (importing) {
        cesdk.ui.showNotification({
          type: 'info',
          message: 'An import is running. Try again when it has finished.'
        });
        return;
      }
      importing = true;
      try {
        // The file is decoded before the editor's scene is replaced, so a
        // file that is not a `.fig` leaves the current design in place.
        const result = await importFig(engine, bytes, { canvas: index });
        fileBytes = bytes;
        // The default padding reads the camera size, which the new scene's
        // camera does not have yet, so pass a padding.
        await cesdk.actions.run('zoom.toPage', {
          page: 'first',
          padding: 40,
          autoFit: true
        });
        showConversionNotes(result, index);
      } catch (error) {
        cesdk.ui.showNotification({
          type: 'error',
          message: `Import failed: ${error instanceof Error ? error.message : String(error)}`
        });
      } finally {
        importing = false;
      }
    };

    const showConversionNotes = (result: ImportResult, index: number) => {
      // Each message has a `type`, a stable `code` and a readable `message`.
      const messages = result.logger.getMessages();
      const warnings = messages.filter((message) => message.type !== 'info');
      for (const message of warnings) {
        console.warn(`[${message.code}] ${message.message}`);
      }
      if (warnings.length > 0) {
        cesdk.ui.showNotification({
          type: 'warning',
          message: `Imported "${result.canvas}" with ${warnings.length} warning(s). See the Figma Import panel.`
        });
      }
      const payload: FigmaPanelPayload = {
        canvases: result.canvases,
        index,
        messages
      };
      cesdk.ui.openPanel(PANEL_ID, { payload });
    };

    cesdk.i18n.setTranslations({
      en: { [`panel.${PANEL_ID}`]: 'Figma Import' }
    });
    cesdk.ui.registerPanel<FigmaPanelPayload>(
      PANEL_ID,
      ({ builder, payload }) => {
        if (!payload) return;
        const { canvases, index, messages } = payload;

        builder.Section('figma.canvas', {
          title: 'Canvas',
          children: () => {
            builder.Select('figma.canvas.select', {
              inputLabel: 'Figma canvas',
              values: canvases.map((name, i) => ({
                id: String(i),
                label: name
              })),
              value: { id: String(index), label: canvases[index] },
              isDisabled: canvases.length < 2,
              setValue: ({ id }) => {
                if (fileBytes) void importCanvas(fileBytes, Number(id));
              }
            });
          }
        });

        // Group the notes by code, since one code can repeat for many layers.
        const notesByCode = new Map<string, LogMessage[]>();
        for (const message of messages) {
          notesByCode.set(message.code, [
            ...(notesByCode.get(message.code) ?? []),
            message
          ]);
        }
        builder.Section('figma.notes', {
          title: `Conversion Notes (${messages.length})`,
          children: () => {
            if (messages.length === 0) {
              builder.Text('figma.notes.none', {
                content: 'This canvas imported without conversion notes.'
              });
            }
            for (const [code, notes] of notesByCode) {
              builder.Text(`figma.notes.${code}`, {
                content: `${notes[0].type} ${code} (${notes.length}): ${notes[0].message}`
              });
            }
          }
        });
      }
    );

    cesdk.ui.registerComponent('figma.openFile', ({ builder }) => {
      builder.Button('figma.openFile', {
        label: 'Open Figma File',
        icon: '@imgly/Upload',
        variant: 'regular',
        color: 'accent',
        onClick: async () => {
          let buffer: ArrayBuffer;
          try {
            buffer = await cesdk.utils.loadFile({
              accept: '.fig',
              returnType: 'arrayBuffer'
            });
          } catch {
            // `loadFile()` rejects when the user cancels the dialog.
            return;
          }
          await importCanvas(new Uint8Array(buffer), 0);
        }
      });
    });
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' }),
      'figma.openFile'
    ]);

    const response = await fetch(SAMPLE_URL);
    if (!response.ok) throw new Error('Could not load the sample .fig file');
    await importCanvas(new Uint8Array(await response.arrayBuffer()), 0);
  }
}

// Optional: import through Figma's REST API. A token in a page is visible to
// everyone who uses the page, so pass only a token that the user supplies,
// such as their own personal access token.
export async function importFromFigmaApi(
  engine: CreativeEngine,
  fileKey: string,
  token: string,
  canvas: number | string = 0
): Promise<ImportResult> {
  return importFigmaFile(engine, {
    fileKey,
    token,
    canvas,
    // Report a rate limit at once: Figma's Retry-After can outlast the page.
    maxRetries: 0
  });
}

export default Example;
