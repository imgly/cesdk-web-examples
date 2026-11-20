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
import type CreativeEngine from '@cesdk/engine';
import type { AssetResult } from '@cesdk/engine';
import type { LogMessage } from '@imgly/pptx-importer';
import { PPTXParser, addGfontsAssetLibrary } from '@imgly/pptx-importer';
import packageJson from './package.json';

const PPTX_SOURCE_ID = 'pptx-files';
const PPTX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.presentationml.presentation';

// Sample presentations from the PowerPoint Template Import starter kit.
const SAMPLE_BASE_URL =
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.87.0-rc.3/starterkit-pptx-template-import/cases/pptx-template-import';

const SAMPLE_PRESENTATIONS: AssetResult[] = [
  {
    id: 'example-1-skin',
    label: 'Skin Care',
    meta: {
      uri: `${SAMPLE_BASE_URL}/example-1-skin.pptx`,
      thumbUri: `${SAMPLE_BASE_URL}/example-1-skin-thumb.png`,
      mimeType: PPTX_MIME_TYPE
    }
  },
  {
    id: 'example-2-bike',
    label: 'Bike',
    meta: {
      uri: `${SAMPLE_BASE_URL}/example-2-bike.pptx`,
      thumbUri: `${SAMPLE_BASE_URL}/example-2-bike-thumb.png`,
      mimeType: PPTX_MIME_TYPE
    }
  },
  {
    id: 'example-3-social',
    label: 'Social Media',
    meta: {
      uri: `${SAMPLE_BASE_URL}/example-3-social.pptx`,
      thumbUri: `${SAMPLE_BASE_URL}/example-3-social-thumb.png`,
      mimeType: PPTX_MIME_TYPE
    }
  }
];

/**
 * CE.SDK Plugin: Import from PowerPoint
 *
 * Demonstrates `@imgly/pptx-importer` in the browser:
 * - Parsing a PPTX file into the editor's scene, one page per slide
 * - Reading the importer's warnings
 * - Saving the imported scene as an archive, or with stable URLs
 * - Offering sample presentations in the asset library
 * - Letting users upload their own PPTX file
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

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
        include: ['ly.img.templates.presentation.*', 'ly.img.image.*']
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

    // The importer matches slide fonts against the Google Fonts asset
    // library. `PPTXParser.fromFile()` registers it on the first import;
    // registering it here fetches the catalog before the user picks a file.
    await addGfontsAssetLibrary(engine);

    const importPptx = async (source: string | ArrayBuffer, name: string) => {
      let buffer: ArrayBuffer;
      if (typeof source === 'string') {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Could not load ${name}`);
        buffer = await response.arrayBuffer();
      } else {
        buffer = source;
      }

      // `fromFile()` validates the file before the user's design is touched.
      const parser = await PPTXParser.fromFile(engine, buffer);

      // `parse()` adds the slides to the current scene, so we start a new
      // one. The importer sets the scene to 96 DPI, the resolution of
      // PowerPoint's own pixel sizes.
      engine.scene.create('VerticalStack');
      const result = await parser.parse();

      const pages = engine.scene.getPages();
      console.log(`Imported ${pages.length} slide(s) from ${name}`);
      await cesdk.actions.run('zoom.toPage', { page: 'first', autoFit: true });

      // Each message has a stable `code`, a `type` and a readable `message`.
      const messages: LogMessage[] = result.logger.getMessages();
      const warnings = messages.filter((m) => m.type === 'warning');
      const errors = messages.filter((m) => m.type === 'error');
      for (const message of [...errors, ...warnings]) {
        console.warn(`[${message.code}] ${message.message}`);
      }
      if (warnings.length > 0 || errors.length > 0) {
        cesdk.ui.showNotification(
          `Imported with ${warnings.length} warning(s) and ${errors.length} error(s). See the console.`
        );
      }

      // The archive bundles the scene with the images the importer extracted
      // from the presentation. Upload this Blob to your storage.
      const archive = await engine.scene.saveToArchive();
      console.log(`Scene archive: ${archive.size} bytes`);
    };

    engine.asset.addSource({
      id: PPTX_SOURCE_ID,

      async findAssets(queryData) {
        let assets = SAMPLE_PRESENTATIONS;
        if (queryData.query) {
          const query = queryData.query.toLowerCase();
          assets = assets.filter((asset) =>
            asset.label?.toLowerCase().includes(query)
          );
        }
        return {
          assets,
          total: assets.length,
          currentPage: queryData.page,
          nextPage: undefined
        };
      },

      // Replaces the scene, so no block is returned.
      async applyAsset(asset) {
        const uri = asset.meta?.uri;
        if (typeof uri !== 'string') return undefined;
        try {
          await importPptx(uri, asset.label ?? asset.id);
        } catch (error) {
          cesdk.ui.showNotification(
            `Import failed: ${(error as Error).message}`
          );
        }
        return undefined;
      }
    });

    cesdk.i18n.setTranslations({
      en: {
        [`libraries.${PPTX_SOURCE_ID}.label`]: 'Presentations',
        'libraries.pptx-library-entry.label': 'Presentations'
      }
    });
    cesdk.ui.addAssetLibraryEntry({
      id: 'pptx-library-entry',
      sourceIds: [PPTX_SOURCE_ID],
      previewLength: 3,
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain',
      gridColumns: 2
    });
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'pptx-library-dock',
        label: 'Presentations',
        icon: '@imgly/Template',
        entries: ['pptx-library-entry']
      },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    cesdk.ui.registerComponent('pptx.uploadButton', ({ builder }) => {
      builder.Button('pptx.uploadButton', {
        label: 'Open PowerPoint File',
        icon: '@imgly/Upload',
        variant: 'regular',
        color: 'accent',
        onClick: async () => {
          let buffer: ArrayBuffer;
          try {
            buffer = await cesdk.utils.loadFile({
              accept: `.pptx,${PPTX_MIME_TYPE}`,
              returnType: 'arrayBuffer'
            });
          } catch {
            // `loadFile()` rejects when the user cancels the dialog or the
            // browser cannot read the file.
            return;
          }
          try {
            await importPptx(buffer, 'uploaded.pptx');
          } catch (error) {
            cesdk.ui.showNotification(
              `Import failed: ${(error as Error).message}`
            );
          }
        }
      });
    });
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' }),
      'pptx.uploadButton'
    ]);

    // Import the first sample through the asset source, as a click would.
    await engine.asset.apply(PPTX_SOURCE_ID, SAMPLE_PRESENTATIONS[0]);

    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: ['pptx-library-entry'], title: 'Presentations' }
    });
  }
}

// Optional: save the scene as a string with stable URLs instead of an
// archive. The importer stores slide images under transient `buffer://`
// URIs, which only an archive keeps. For `saveToString()`, upload each
// buffer first and point the scene at the uploaded file.
export async function saveWithStableUrls(
  engine: CreativeEngine
): Promise<string> {
  // Replace with the upload to your storage. Here an object URL stands
  // in for the permanent URL.
  const uploadToBackend = async (data: Uint8Array): Promise<string> => {
    const blob = new Blob([new Uint8Array(data)]);
    return URL.createObjectURL(blob);
  };

  // The list holds every transient resource, so keep only the importer's
  // `buffer://` URIs, the slide images.
  for (const resource of engine.editor.findAllTransientResources()) {
    const { URL: bufferUri, size } = resource;
    if (!bufferUri.startsWith('buffer://')) continue;
    const data = engine.editor.getBufferData(bufferUri, 0, size);
    const permanentUrl = await uploadToBackend(data);
    engine.editor.relocateResource(bufferUri, permanentUrl);
  }
  return engine.scene.saveToString();
}

export default Example;
