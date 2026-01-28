import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import type {
  AssetResult,
  AssetQueryData,
  AssetsQueryResult
} from '@cesdk/engine';
import type { TypefaceResolver } from '@imgly/idml-importer';
import { IDMLParser, addGoogleFontsAssetLibrary } from '@imgly/idml-importer';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Import from InDesign Guide
 *
 * Demonstrates how to import Adobe InDesign IDML files into CE.SDK:
 * - Creating a custom asset source for IDML templates
 * - Adding a custom nav bar button to upload IDML files
 * - Parsing IDML files with the IDML importer
 * - Displaying import warnings to users
 *
 * Note: In-library file uploads for custom asset sources will be supported
 * in a future CE.SDK release. This guide demonstrates using a custom nav bar
 * button as an alternative approach for user file uploads.
 */

// Asset source ID for IDML library
const IDML_SOURCE_ID = 'idml-files';

// Base URL for IDML template files
const IDML_BASE_URL =
  'https://staticimgly.com/imgly/docs-reference-files-temp/indesign-template-import';

// Sample IDML files for the asset library
// These files are hosted on the IMG.LY CDN from the showcases-app public folder
const SAMPLE_IDML_FILES: AssetResult[] = [
  {
    id: 'idml-socialmedia',
    label: 'Social Media',
    tags: ['sample', 'idml', 'social', 'marketing'],
    meta: {
      uri: `${IDML_BASE_URL}/socialmedia.idml`,
      thumbUri: `${IDML_BASE_URL}/socialmedia-thumb@2x.png`,
      mimeType: 'application/vnd.adobe.indesign-idml-package',
      width: 1080,
      height: 1080
    }
  },
  {
    id: 'idml-poster',
    label: 'Poster',
    tags: ['sample', 'idml', 'poster', 'print'],
    meta: {
      uri: `${IDML_BASE_URL}/poster.idml`,
      thumbUri: `${IDML_BASE_URL}/poster-thumb@2x.png`,
      mimeType: 'application/vnd.adobe.indesign-idml-package',
      width: 1240,
      height: 1754
    }
  },
  {
    id: 'idml-postcard',
    label: 'Postcard',
    tags: ['sample', 'idml', 'postcard', 'print'],
    meta: {
      uri: `${IDML_BASE_URL}/postcard.idml`,
      thumbUri: `${IDML_BASE_URL}/postcard-thumb@2x.png`,
      mimeType: 'application/vnd.adobe.indesign-idml-package',
      width: 1050,
      height: 600
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

    // Initialize CE.SDK with Google Fonts support for IDML text matching
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Register Google Fonts before parsing IDML files for best font matching
    await addGoogleFontsAssetLibrary(engine);

    // Optional: Create a custom font resolver for advanced font mapping
    // Use this when you need to map InDesign fonts to specific alternatives,
    // use enterprise fonts, or implement custom fallback logic
    const customFontResolver: TypefaceResolver = async (fontParams, eng) => {
      const { family, style, weight } = fontParams;

      // Define font mappings from InDesign fonts to available alternatives
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
    await cesdk.createDesignScene();

    // Helper function to import IDML from URL or buffer
    const importIdml = async (
      source: string | ArrayBuffer,
      sourceName: string
    ) => {
      console.log(`Processing IDML: ${sourceName}`);

      // Get buffer from URL or use directly
      let buffer: ArrayBuffer;
      if (typeof source === 'string') {
        const response = await fetch(source);
        buffer = await response.arrayBuffer();
      } else {
        buffer = source;
      }

      // Parse the IDML file using the IDML importer
      // The addGoogleFontsAssetLibrary() call above enables automatic font matching
      // For custom font mapping, pass fontResolver as 4th parameter (see customFontResolver example)
      const parser = await IDMLParser.fromFile(
        engine,
        buffer,
        (content: string) =>
          new DOMParser().parseFromString(content, 'text/xml')
        // Optional: customFontResolver for advanced font mapping
      );
      await parser.parse();

      // Verify pages were imported successfully
      const pages = engine.scene.getPages();
      if (pages.length === 0) {
        console.error('No pages imported from IDML');
        throw new Error('No pages could be imported from the IDML file');
      }
      console.log(`Successfully imported ${pages.length} page(s)`);

      // Save the imported scene as an archive for editor loading
      const sceneArchive = await engine.scene.saveToArchive();
      const archiveUrl = URL.createObjectURL(sceneArchive);

      // Optional: Save scene as JSON string with stable URLs instead of archive
      // This is useful when storing scenes in a database or referencing CDN-hosted assets
      // By default, IDML images use transient buffer:// URLs that only work with saveToArchive()
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
      const loadedPages = engine.scene.getPages();
      console.log(
        `IDML imported successfully with ${loadedPages.length} page(s)`
      );

      // Zoom to fit the imported page
      await cesdk.actions.run('zoom.toPage', { page: 'first', autoFit: true });

      // Clean up object URL
      URL.revokeObjectURL(archiveUrl);
    };

    // Add custom asset source for IDML templates
    engine.asset.addSource({
      id: IDML_SOURCE_ID,

      async findAssets(
        queryData: AssetQueryData
      ): Promise<AssetsQueryResult<AssetResult>> {
        let assets = SAMPLE_IDML_FILES;

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

        await importIdml(asset.meta.uri as string, asset.label || asset.id);
        return undefined; // Scene replaced, no new block created
      }
    });

    // Set labels for the asset source and library entry
    cesdk.i18n.setTranslations({
      en: {
        [`libraries.${IDML_SOURCE_ID}.label`]: 'IDML Files',
        'libraries.idml-library-entry.label': 'InDesign Templates'
      }
    });

    // Configure the asset library UI to show the IDML source
    cesdk.ui.addAssetLibraryEntry({
      id: 'idml-library-entry',
      sourceIds: [IDML_SOURCE_ID],
      previewLength: 3,
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain',
      gridColumns: 2
    });

    // Add IDML library to the dock and remove the default Templates entry
    const existingDockOrder = cesdk.ui.getDockOrder();
    const filteredDockOrder = existingDockOrder.filter(
      (entry) => entry.key !== 'ly.img.template'
    );
    cesdk.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'idml-library-dock',
        label: 'InDesign Templates',
        icon: '@imgly/Template',
        entries: ['idml-library-entry']
      },
      ...filteredDockOrder
    ]);

    // Add a custom nav bar button for uploading and importing IDML files
    // Uses cesdk.utils.loadFile() to open the browser's file picker
    cesdk.ui.registerComponent('idml.uploadButton', ({ builder }) => {
      builder.Button('idml.uploadButton', {
        label: 'Load IDML File',
        icon: '@imgly/Upload',
        variant: 'regular',
        color: 'accent',
        onClick: async () => {
          const buffer = await cesdk.utils.loadFile({
            accept: '.idml,application/vnd.adobe.indesign-idml-package',
            returnType: 'arrayBuffer'
          });
          await importIdml(buffer, 'uploaded.idml');
        }
      });
    });

    // Add the upload button to the right side of the navigation bar
    cesdk.ui.setNavigationBarOrder([
      ...cesdk.ui.getNavigationBarOrder(),
      'idml.uploadButton'
    ]);

    // Open the IDML Templates library by default
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['idml-library-entry'],
        title: 'InDesign Templates'
      }
    });

    // Override the importScene action to support IDML files alongside standard formats
    // This integrates IDML import with the default import workflow
    cesdk.actions.register(
      'importScene',
      async ({
        format = 'scene'
      }: {
        format?: 'scene' | 'archive' | 'idml';
      }) => {
        if (format === 'idml') {
          // Handle IDML import using cesdk.utils.loadFile
          const buffer = await cesdk.utils.loadFile({
            accept: '.idml,application/vnd.adobe.indesign-idml-package',
            returnType: 'arrayBuffer'
          });
          await importIdml(buffer, 'imported.idml');
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
