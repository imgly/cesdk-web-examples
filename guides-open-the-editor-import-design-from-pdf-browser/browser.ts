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
import {
  PDFParser,
  addGfontsAssetLibrary,
  editableFirstStrategy
} from '@imgly/pdf-importer';
import packageJson from './package.json';

const PDF_SOURCE_ID = 'pdf-files';

// Sample documents from the PDF Template Import starter kit.
const SAMPLE_BASE_URL =
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.87.0-rc.1/starterkit-pdf-template-import/cases/pdf-template-import';

const SAMPLE_DOCUMENTS: AssetResult[] = [
  {
    id: 'postcard',
    label: 'Postcard',
    meta: {
      uri: `${SAMPLE_BASE_URL}/postcard.pdf`,
      thumbUri: `${SAMPLE_BASE_URL}/postcard-thumb.png`,
      mimeType: 'application/pdf'
    }
  },
  {
    id: 'poster',
    label: 'Poster',
    meta: {
      uri: `${SAMPLE_BASE_URL}/poster.pdf`,
      thumbUri: `${SAMPLE_BASE_URL}/poster-thumb.png`,
      mimeType: 'application/pdf'
    }
  },
  {
    id: 'socialmedia',
    label: 'Social Media',
    meta: {
      uri: `${SAMPLE_BASE_URL}/socialmedia.pdf`,
      thumbUri: `${SAMPLE_BASE_URL}/socialmedia-thumb.png`,
      mimeType: 'application/pdf'
    }
  }
];

/**
 * CE.SDK Plugin: Import from PDF
 *
 * Demonstrates `@imgly/pdf-importer` in the browser:
 * - Parsing a PDF into the editor's scene, one page per PDF page
 * - Choosing a font strategy and reading the importer's warnings
 * - Saving the imported scene as an archive, or with stable URLs
 * - Offering sample documents in the asset library
 * - Letting users upload their own PDF file
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
        include: ['ly.img.templates.print.*', 'ly.img.image.*']
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

    // Keep glyphs such as ♥ or ★ in the font the PDF embeds, instead of the
    // emoji font the engine substitutes by default.
    engine.editor.setSetting('forceSystemEmojis', false);

    // The importer resolves PDF fonts through the Google Fonts asset
    // library, so we register it before the first import.
    await addGfontsAssetLibrary(engine);

    // `editableFirstStrategy`, the default, prefers a typeface from the asset
    // library, then the font embedded in the PDF, then a substitute.
    // `exactFidelityStrategy` never substitutes and draws unmatched text as
    // vector outlines instead.
    const fontStrategy = editableFirstStrategy;

    const importPdf = async (source: string | ArrayBuffer, name: string) => {
      let buffer: ArrayBuffer;
      if (typeof source === 'string') {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Could not load ${name}`);
        buffer = await response.arrayBuffer();
      } else {
        buffer = source;
      }

      // `parse()` replaces the current scene with the PDF and fits the camera
      // to the first page.
      const parser = await PDFParser.fromFile(engine, buffer, { fontStrategy });
      const { logger } = await parser.parse();

      const pages = engine.scene.getPages();
      console.log(`Imported ${pages.length} page(s) from ${name}`);

      // Each message has a stable `code`, a `type` and a readable `message`.
      const messages = logger.getMessages();
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

      // The archive bundles the scene with the images and fonts the importer
      // extracted from the PDF. Upload this Blob to your storage.
      const archive = await engine.scene.saveToArchive();
      console.log(`Scene archive: ${archive.size} bytes`);
    };

    engine.asset.addSource({
      id: PDF_SOURCE_ID,

      async findAssets(queryData) {
        let assets = SAMPLE_DOCUMENTS;
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
          await importPdf(uri, asset.label ?? asset.id);
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
        [`libraries.${PDF_SOURCE_ID}.label`]: 'PDF Documents',
        'libraries.pdf-library-entry.label': 'PDF Documents'
      }
    });
    cesdk.ui.addAssetLibraryEntry({
      id: 'pdf-library-entry',
      sourceIds: [PDF_SOURCE_ID],
      previewLength: 3,
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain',
      gridColumns: 2
    });
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'pdf-library-dock',
        label: 'PDF Documents',
        icon: '@imgly/Template',
        entries: ['pdf-library-entry']
      },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    cesdk.ui.registerComponent('pdf.uploadButton', ({ builder }) => {
      builder.Button('pdf.uploadButton', {
        label: 'Open PDF File',
        icon: '@imgly/Upload',
        variant: 'regular',
        color: 'accent',
        onClick: async () => {
          let buffer: ArrayBuffer;
          try {
            buffer = await cesdk.utils.loadFile({
              accept: '.pdf,application/pdf',
              returnType: 'arrayBuffer'
            });
          } catch {
            // `loadFile()` rejects when the user cancels the dialog or the
            // browser cannot read the file.
            return;
          }
          try {
            await importPdf(buffer, 'uploaded.pdf');
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
      'pdf.uploadButton'
    ]);

    // Import the first sample through the asset source, as a click would.
    await engine.asset.apply(PDF_SOURCE_ID, SAMPLE_DOCUMENTS[0]);

    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: ['pdf-library-entry'], title: 'PDF Documents' }
    });
  }
}

// Optional: save the scene as a string with stable URLs instead of an
// archive. The importer stores extracted images and embedded fonts under
// transient `buffer://` URIs, which only an archive keeps. For
// `saveToString()`, upload each buffer first and point the scene at the
// uploaded file.
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
  // `buffer://` URIs, embedded fonts included.
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
