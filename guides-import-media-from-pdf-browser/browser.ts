import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  ColorPaletteAssetSource,
  DemoAssetSources,
  PagePresetsAssetSource,
  TextAssetSource,
  TypefaceAssetSource,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import { PDFParser, addGfontsAssetLibrary } from '@imgly/pdf-importer';
import packageJson from './package.json';

const PDF_SOURCE_ID = 'pdf-pages';

/**
 * CE.SDK Plugin: Place PDF Pages in a Design
 *
 * Demonstrates `PDFParser.loadAsBlocks()` from `@imgly/pdf-importer`:
 * - Parsing a PDF once on the editor's engine
 * - Listing its pages in a custom asset library
 * - Placing a page into the open design as one group
 * - Fitting the group to the page and reading parser warnings
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new DemoAssetSources());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 1080, height: 1080, unit: 'Pixel' }
    });
    const engine = cesdk.engine;

    // The importer resolves PDF fonts through the Google Fonts asset library.
    await addGfontsAssetLibrary(engine);

    const pdfURL = new URL(
      `${import.meta.env.BASE_URL}summer-market.pdf`,
      document.baseURI
    );
    const response = await fetch(pdfURL);
    if (!response.ok) throw new Error('Could not load the PDF');

    // Create the parser on the editor's engine: the blocks it returns live
    // in that engine. The importer bundles its own engine types, hence the cast.
    const parser = await PDFParser.fromFile(
      engine as any,
      await response.arrayBuffer()
    );

    // The first call parses the PDF. Later calls reuse the parsed document.
    const pageCount = await parser.getPageCount();
    const pdfPages = Array.from({ length: pageCount }, (_, pageIndex) => ({
      id: `summer-market-page-${pageIndex + 1}`,
      label: `Page ${pageIndex + 1}`,
      meta: {
        pageIndex: String(pageIndex),
        thumbUri: new URL(
          `${import.meta.env.BASE_URL}summer-market-page-${pageIndex + 1}.png`,
          document.baseURI
        ).href
      }
    }));

    // The parser keeps one logger for the parse and all imports, so we count
    // the messages we printed and print only the new ones.
    let printedMessages = 0;

    engine.asset.addSource({
      id: PDF_SOURCE_ID,

      async findAssets(queryData) {
        return {
          assets: pdfPages,
          total: pdfPages.length,
          currentPage: queryData.page,
          nextPage: undefined
        };
      },

      async applyAsset(asset) {
        // The engine returns asset metadata as strings.
        const pageIndex = Number(asset.meta?.pageIndex);
        const { blocks, logger, dispose } = await parser.loadAsBlocks({
          units: 'scene',
          pageIndex,
          maxBlocks: 10000
        });

        for (const message of logger.getMessages().slice(printedMessages)) {
          if (message.type !== 'info') {
            console.warn(`[${message.code}] ${message.message}`);
          }
        }
        printedMessages = logger.getMessages().length;
        // A page without content produces no group.
        const group = blocks[0];
        if (group === undefined) {
          cesdk.ui.showNotification(`PDF page ${pageIndex + 1} is empty.`);
          return undefined;
        }

        const page = engine.scene.getCurrentPage();
        if (page === null) {
          dispose();
          return undefined;
        }
        try {
          // Attach the group first: `scale()` throws for a block that is
          // not laid out in the scene yet.
          engine.block.appendChild(page, group);
          const pageWidth = engine.block.getWidth(page);
          const pageHeight = engine.block.getHeight(page);
          const factor = Math.min(
            (pageWidth * 0.8) / engine.block.getWidth(group),
            (pageHeight * 0.8) / engine.block.getHeight(group)
          );
          engine.block.scale(group, factor);
          engine.block.setPositionX(
            group,
            (pageWidth - engine.block.getWidth(group)) / 2
          );
          engine.block.setPositionY(
            group,
            (pageHeight - engine.block.getHeight(group)) / 2
          );
        } catch (error) {
          // Remove the imported blocks and their unused images.
          dispose();
          throw error;
        }
        // Select the group, so the user sees which block was added.
        engine.block.select(group);
        // A custom `applyAsset` records no undo step on its own.
        engine.editor.addUndoStep();
        return group;
      }
    });

    cesdk.i18n.setTranslations({
      en: {
        [`libraries.${PDF_SOURCE_ID}.label`]: 'PDF Pages',
        'libraries.pdf-pages-entry.label': 'PDF Pages'
      }
    });
    cesdk.ui.addAssetLibraryEntry({
      id: 'pdf-pages-entry',
      sourceIds: [PDF_SOURCE_ID],
      previewLength: 2,
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain',
      gridColumns: 2
    });
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'pdf-pages-dock',
        label: 'PDF Pages',
        icon: '@imgly/Template',
        entries: ['pdf-pages-entry']
      },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);

    // Place the first PDF page through the same source, as a click would.
    await engine.asset.apply(PDF_SOURCE_ID, pdfPages[0]);

    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: ['pdf-pages-entry'], title: 'PDF Pages' }
    });
  }
}

export default Example;
