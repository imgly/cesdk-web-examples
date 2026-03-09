import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

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
import type {
  AssetQueryData,
  AssetResult,
  AssetsQueryResult
} from '@cesdk/engine';
import type { TypefaceResolver } from '@imgly/psd-importer';
import {
  PSDParser,
  addGoogleFontsAssetLibrary,
  createWebEncodeBufferToPNG
} from '@imgly/psd-importer';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Import from Photoshop Guide
 *
 * Demonstrates how to import Adobe Photoshop (PSD) files into CE.SDK:
 * - Creating a custom asset source for PSD templates
 * - Adding a custom nav bar button to upload PSD files
 * - Parsing PSD files with the PSD importer
 * - Displaying import warnings to users
 *
 * Note: In-library file uploads for custom asset sources will be supported
 * in a future CE.SDK release. This guide demonstrates using a custom nav bar
 * button as an alternative approach for user file uploads.
 */

// Asset source ID for PSD library
const PSD_SOURCE_ID = 'psd-files';

// Base URL for PSD template files
const PSD_BASE_URL =
  'https://staticimgly.com/imgly/docs-reference-files-temp/psd-template-import';

// Sample PSD files from the CE.SDK showcases
const SAMPLE_PSD_FILES: AssetResult[] = [
  {
    id: 'showcase-file-1',
    label: 'Sample Design 1',
    tags: ['sample', 'psd'],
    meta: {
      uri: `${PSD_BASE_URL}/showcase-file-1.psd`,
      thumbUri: `${PSD_BASE_URL}/showcase-file-1-thumb.png`,
      mimeType: 'application/x-photoshop',
      width: 1920,
      height: 1080
    }
  },
  {
    id: 'showcase-file-2',
    label: 'Sample Design 2',
    tags: ['sample', 'psd'],
    meta: {
      uri: `${PSD_BASE_URL}/showcase-file-2.psd`,
      thumbUri: `${PSD_BASE_URL}/showcase-file-2-thumb.png`,
      mimeType: 'application/x-photoshop',
      width: 1920,
      height: 1080
    }
  },
  {
    id: 'showcase-file-3',
    label: 'Sample Design 3',
    tags: ['sample', 'psd'],
    meta: {
      uri: `${PSD_BASE_URL}/showcase-file-3.psd`,
      thumbUri: `${PSD_BASE_URL}/showcase-file-3-thumb.png`,
      mimeType: 'application/x-photoshop',
      width: 1920,
      height: 1080
    }
  }
];

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Initialize CE.SDK with Google Fonts support for PSD text matching
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

    // Register Google Fonts before parsing PSD files for best font matching
    await addGoogleFontsAssetLibrary(engine);

    // Optional: Create a custom font resolver for advanced font mapping
    // Use this when you need to map Photoshop fonts to specific alternatives,
    // use enterprise fonts, or implement custom fallback logic
    const customFontResolver: TypefaceResolver = async (fontParams, eng) => {
      const { family, style, weight } = fontParams;

      // Define font mappings from Photoshop fonts to available alternatives
      const fontMappings: Record<string, string> = {
        Arial: 'Open Sans',
        Helvetica: 'Inter',
        'Helvetica Neue': 'Inter',
        'Times New Roman': 'Lora',
        Georgia: 'Merriweather'
      };

      // Use mapped font or original family name
      const targetFamily = fontMappings[family] || family;

      // Search for the font in available typefaces
      const result = await eng.asset.findAssets('ly.img.typeface', {
        query: targetFamily,
        page: 0,
        perPage: 10
      });

      if (result.assets.length === 0) {
        console.warn(`Font "${family}" not found, using default fallback`);
        return null; // Let the parser use its default fallback
      }

      // Get the typeface from the asset payload
      const asset = result.assets[0];
      const typeface = asset.payload?.typeface;
      if (!typeface) return null;

      // Find the best matching font variant (weight and style)
      const matchingFont =
        typeface.fonts.find(
          (f: { weight?: string; style?: string }) =>
            f.weight === weight && f.style === style
        ) ||
        typeface.fonts.find((f: { weight?: string }) => f.weight === weight) ||
        typeface.fonts[0];

      return { typeface, font: matchingFont };
    };

    // Create an initial design scene
    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    // Helper function to import PSD from URL or buffer
    const importPsd = async (
      source: string | ArrayBuffer,
      sourceName: string
    ) => {
      console.log(`Processing PSD: ${sourceName}`);

      // Get buffer from URL or use directly
      let buffer: ArrayBuffer;
      if (typeof source === 'string') {
        const response = await fetch(source);
        buffer = await response.arrayBuffer();
      } else {
        buffer = source;
      }

      // Parse the PSD file using the PSD importer
      // The addGoogleFontsAssetLibrary() call above enables automatic font matching
      // For custom font mapping, pass fontResolver in options (see customFontResolver example)
      const parser = await PSDParser.fromFile(
        engine,
        buffer,
        createWebEncodeBufferToPNG()
        // Optional: { fontResolver: customFontResolver } for advanced font mapping
      );
      const result = await parser.parse();

      // Check for import warnings and errors
      const messages = result.logger.getMessages();
      const warnings = messages.filter((m) => m.type === 'warning');
      const errors = messages.filter((m) => m.type === 'error');

      if (errors.length > 0) {
        console.error('Import errors:', errors);
      }
      if (warnings.length > 0) {
        console.warn(
          'Import warnings:',
          warnings.map((w) => w.message)
        );
      }

      // Save the imported scene as an archive for editor loading
      const sceneArchive = await engine.scene.saveToArchive();
      const archiveUrl = URL.createObjectURL(sceneArchive);

      // Optional: Save scene as JSON string with stable URLs instead of archive
      // This is useful when storing scenes in a database or referencing CDN-hosted assets
      // By default, PSD images use transient buffer:// URLs that only work with saveToArchive()
      // To use saveToString(), relocate transient resources to permanent URLs first:

      // Mock upload function - replace with your actual backend upload logic
      const uploadToBackend = async (data: Uint8Array): Promise<string> => {
        // In production, upload the data to your CDN/storage and return the permanent URL
        // For this example, we create a blob URL to demonstrate the workflow
        const blob = new Blob([data], { type: 'image/png' });
        return URL.createObjectURL(blob);
      };

      const transientResources = engine.editor.findAllTransientResources();
      for (const resource of transientResources) {
        const { URL: bufferUri, size } = resource;
        const data = engine.editor.getBufferData(bufferUri, 0, size);
        const permanentUrl = await uploadToBackend(data);
        engine.editor.relocateResource(bufferUri, permanentUrl);
      }
      const sceneString = await engine.scene.saveToString();

      // Load the archived scene into the editor
      await cesdk.engine.scene.loadFromArchiveURL(archiveUrl);

      // Verify scene loaded correctly
      const pages = engine.scene.getPages();
      console.log(`PSD imported successfully with ${pages.length} page(s)`);

      // Zoom to fit the imported page
      await cesdk.actions.run('zoom.toPage', { page: 'first', autoFit: true });

      // Clean up object URL
      URL.revokeObjectURL(archiveUrl);
    };

    // Add custom asset source for PSD templates
    engine.asset.addSource({
      id: PSD_SOURCE_ID,

      async findAssets(
        queryData: AssetQueryData
      ): Promise<AssetsQueryResult<AssetResult>> {
        let assets = SAMPLE_PSD_FILES;

        // Filter by query if provided
        if (queryData.query) {
          const query = queryData.query.toLowerCase();
          assets = assets.filter(
            (a) =>
              a.label?.toLowerCase().includes(query) ||
              a.tags?.some((t) => t.toLowerCase().includes(query))
          );
        }

        return {
          assets,
          total: assets.length,
          currentPage: queryData.page,
          nextPage: undefined
        };
      },

      async applyAsset(asset: AssetResult): Promise<number | undefined> {
        if (!asset.meta?.uri) {
          console.error('Asset has no URI');
          return undefined;
        }

        await importPsd(asset.meta.uri as string, asset.label || asset.id);
        return undefined; // Scene replaced, no new block created
      }
    });

    // Set labels for the asset source and library entry
    cesdk.i18n.setTranslations({
      en: {
        [`libraries.${PSD_SOURCE_ID}.label`]: 'PSD Files',
        'libraries.psd-library-entry.label': 'PSD Templates'
      }
    });

    // Configure the asset library UI to show the PSD source
    cesdk.ui.addAssetLibraryEntry({
      id: 'psd-library-entry',
      sourceIds: [PSD_SOURCE_ID],
      previewLength: 3,
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain',
      gridColumns: 2
    });

    // Add PSD library to the dock and remove the default Templates entry
    const existingDockOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
    const filteredDockOrder = existingDockOrder.filter(
      (entry) => entry.key !== 'ly.img.template'
    );
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'psd-library-dock',
        label: 'PSD Templates',
        icon: '@imgly/Template',
        entries: ['psd-library-entry']
      },
      ...filteredDockOrder
    ]);

    // Add a custom nav bar button for uploading and importing PSD files
    // Uses cesdk.utils.loadFile() to open the browser's file picker
    cesdk.ui.registerComponent('psd.uploadButton', ({ builder }) => {
      builder.Button('psd.uploadButton', {
        label: 'Load PSD File',
        icon: '@imgly/Upload',
        variant: 'regular',
        color: 'accent',
        onClick: async () => {
          const buffer = await cesdk.utils.loadFile({
            accept: '.psd,application/x-photoshop,image/vnd.adobe.photoshop',
            returnType: 'arrayBuffer'
          });
          await importPsd(buffer, 'uploaded.psd');
        }
      });
    });

    // Add the upload button to the right side of the navigation bar
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' }),
      'psd.uploadButton'
    ]);

    // Open the PSD Templates library by default
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['psd-library-entry'],
        title: 'PSD Templates'
      }
    });

    // Override the importScene action to support PSD files alongside standard formats
    // This integrates PSD import with the default import workflow
    cesdk.actions.register(
      'importScene',
      async ({
        format = 'scene'
      }: {
        format?: 'scene' | 'archive' | 'psd';
      }) => {
        if (format === 'psd') {
          // Handle PSD import using cesdk.utils.loadFile
          const buffer = await cesdk.utils.loadFile({
            accept: '.psd,application/x-photoshop,image/vnd.adobe.photoshop',
            returnType: 'arrayBuffer'
          });
          await importPsd(buffer, 'imported.psd');
        } else if (format === 'scene') {
          // Handle standard .scene files
          const scene = await cesdk.utils.loadFile({
            accept: '.scene',
            returnType: 'text'
          });
          await cesdk.engine.scene.loadFromString(scene);
          await cesdk.actions.run('zoom.toPage', { page: 'first' });
        } else {
          // Handle archive files (.zip)
          const blobURL = await cesdk.utils.loadFile({
            accept: '.zip',
            returnType: 'objectURL'
          });
          try {
            await cesdk.engine.scene.loadFromArchiveURL(blobURL);
          } finally {
            URL.revokeObjectURL(blobURL);
          }
          await cesdk.actions.run('zoom.toPage', { page: 'first' });
        }
      }
    );
  }
}

export default Example;
