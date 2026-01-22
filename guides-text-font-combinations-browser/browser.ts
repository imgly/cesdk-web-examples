import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
// Import the pre-generated thumbnail for the asset library
import customTitleThumbnail from './assets/custom-title-thumbnail.png';

/**
 * CE.SDK Plugin: Font Combinations Guide
 *
 * Demonstrates how to create and register custom font combinations (text components):
 * - Create styled text blocks programmatically
 * - Serialize text components with saveToArchive()
 * - Generate thumbnails with block.export()
 * - Register custom asset sources for the text components library
 *
 * The saveToArchive() method creates a zip archive containing the blocks.blocks file
 * and all referenced resources (fonts, images). For production, extract this archive
 * and host the files. Use block.loadFromURL() pointing to the blocks.blocks file.
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design'
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Create a styled text block that will become our custom component
    const textComponent = engine.block.create('text');
    engine.block.appendChild(page, textComponent);

    // Set text content and styling
    engine.block.replaceText(textComponent, 'Custom Title');
    engine.block.setFloat(textComponent, 'text/fontSize', 72);

    // Set text color to a brand color
    engine.block.setTextColor(textComponent, {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 1.0
    });

    // Configure dimensions - use fixed frame with clipping
    engine.block.setWidthMode(textComponent, 'Absolute');
    engine.block.setHeightMode(textComponent, 'Absolute');
    engine.block.setWidth(textComponent, 400);
    engine.block.setHeight(textComponent, 100);
    engine.block.setBool(textComponent, 'clipped', true);

    // Position the component on the page
    engine.block.setPositionX(textComponent, 50);
    engine.block.setPositionY(textComponent, 50);

    // Define a custom typeface
    // With saveToArchive(), fonts are automatically bundled in the archive
    // You can use any font - CDN URLs, bundle:// URIs, or custom fonts
    const caveatTypeface = {
      name: 'Caveat',
      fonts: [
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Caveat/Caveat-Regular.ttf',
          subFamily: 'Regular'
        },
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Caveat/Caveat-Bold.ttf',
          subFamily: 'Bold'
        }
      ]
    };

    // Set the font - saveToArchive() will include the font files in the archive
    engine.block.setFont(
      textComponent,
      caveatTypeface.fonts[0].uri,
      caveatTypeface
    );

    // Configure constraints for flexible resizing
    // These ensure the component maintains proper proportions when resized

    // Enable automatic font sizing within constraints
    engine.block.setBool(textComponent, 'text/automaticFontSizeEnabled', true);
    engine.block.setFloat(textComponent, 'text/minAutomaticFontSize', 24);
    engine.block.setFloat(textComponent, 'text/maxAutomaticFontSize', 120);

    // Add a background to visualize the text frame
    engine.block.setBool(textComponent, 'backgroundColor/enabled', true);
    engine.block.setColor(textComponent, 'backgroundColor/color', {
      r: 0.95,
      g: 0.95,
      b: 1.0,
      a: 1.0
    });

    // Serialize the text component using saveToArchive()
    // This creates a zip archive containing blocks.blocks and all resources (fonts, images)
    const archiveBlob = await engine.block.saveToArchive([textComponent]);
    console.log('Archive size:', archiveBlob.size, 'bytes');

    // Create a Blob URL for in-memory loading
    // In production, you would extract the archive and host the files on your server
    const archiveUrl = URL.createObjectURL(archiveBlob);

    // In production, generate thumbnails using block.export():
    //
    // const thumbnailBlob = await engine.block.export(textComponent, {
    //   mimeType: 'image/png',
    //   targetWidth: 400,
    //   targetHeight: 320
    // });
    //
    // For this example, we use a pre-generated thumbnail to avoid
    // watermarks when running without a license key.
    // Prepend origin to make it an absolute URL (CE.SDK prepends its base URL to relative paths)
    const thumbnailUri = window.location.origin + customTitleThumbnail;

    // Create the content.json structure for the custom component
    // In production, you would host the serialized component and thumbnail on your server
    const contentJson = {
      version: '3.0.0',
      id: 'my.custom.textComponents',
      assets: [
        {
          id: '//my.custom.textComponents/customTitle',
          label: {
            en: 'Custom Title'
          },
          meta: {
            // In production, these would be URLs to your hosted files
            // uri: 'https://your-server.com/textComponents/data/CustomTitle.blocks',
            // thumbUri: 'https://your-server.com/textComponents/thumbnails/customTitle.png',
            mimeType: 'application/ubq-blocks-string'
          }
        }
      ],
      blocks: []
    };
    console.log(
      'Content.json structure:',
      JSON.stringify(contentJson, null, 2)
    );

    // Register a custom asset source with an apply callback
    // The callback handles loading and inserting blocks when clicked

    // Store archive URLs in a Map for lookup when applying
    const archiveUrls = new Map<string, string>();
    archiveUrls.set('customTitle', archiveUrl);

    // Create local source with custom apply callback
    engine.asset.addLocalSource(
      'custom.textComponents',
      undefined, // No MIME type filter
      async (asset) => {
        // Get the archive URL for this asset
        const assetArchiveUrl = archiveUrls.get(asset.id);
        if (!assetArchiveUrl) return undefined;

        // Load the block from the archive using loadFromArchiveURL()
        const loadedBlocks = await engine.block.loadFromArchiveURL(
          assetArchiveUrl
        );
        const newBlock = loadedBlocks[0];
        if (!newBlock) return undefined;

        // Add to the current page and center it
        const currentPage = engine.scene.getCurrentPage();
        if (currentPage) {
          engine.block.appendChild(currentPage, newBlock);
          // Center the block on the page
          const pageWidth = engine.block.getWidth(currentPage);
          const pageHeight = engine.block.getHeight(currentPage);
          const blockWidth = engine.block.getWidth(newBlock);
          const blockHeight = engine.block.getHeight(newBlock);
          engine.block.setPositionX(newBlock, (pageWidth - blockWidth) / 2);
          engine.block.setPositionY(newBlock, (pageHeight - blockHeight) / 2);
        }

        engine.editor.addUndoStep();
        return newBlock;
      }
    );

    // Add the text component asset to the source
    engine.asset.addAssetToSource('custom.textComponents', {
      id: 'customTitle',
      label: { en: 'Custom Title' },
      meta: {
        thumbUri: thumbnailUri,
        mimeType: 'application/ubq-blocks-string'
      }
    });
    console.log('Custom text components asset source registered');

    // Configure the asset library to display the custom text components
    // Add translation for the library entry label
    cesdk.i18n.setTranslations({
      en: { 'libraries.text-components-entry.label': 'Text Components' }
    });

    // Add the text components source to the asset library
    cesdk.ui.addAssetLibraryEntry({
      id: 'text-components-entry',
      sourceIds: ['custom.textComponents'],
      sceneMode: 'Design',
      previewLength: 2,
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain',
      gridColumns: 2,
      cardLabelPosition: () => 'below'
    });

    // Add text components library to the dock for easy access
    cesdk.ui.setDockOrder([
      ...cesdk.ui.getDockOrder(),
      'ly.img.spacer',
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'text-components-dock',
        label: 'Text Components',
        icon: '@imgly/Type',
        entries: ['text-components-entry']
      }
    ]);

    // Open the text components panel to showcase the result
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: ['text-components-entry'] }
    });

    // Add a label explaining what this example demonstrates
    const label = engine.block.create('text');
    engine.block.appendChild(page, label);
    engine.block.setWidthMode(label, 'Auto');
    engine.block.setHeightMode(label, 'Auto');
    engine.block.replaceText(
      label,
      'This example creates a custom text component,\nserializes it, and registers it as an asset source.'
    );
    engine.block.setFloat(label, 'text/fontSize', 54);
    engine.block.setTextColor(label, { r: 0.4, g: 0.4, b: 0.4, a: 1.0 });
    engine.block.setPositionX(label, 50);
    engine.block.setPositionY(label, 200);

    // Create a second example component with different styling
    const promoComponent = engine.block.create('text');
    engine.block.appendChild(page, promoComponent);

    engine.block.replaceText(promoComponent, 'SALE');
    engine.block.setFloat(promoComponent, 'text/fontSize', 96);

    // Use a bold red color for the promo text
    engine.block.setTextColor(promoComponent, {
      r: 0.9,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });

    // Set a bold font for the promo component
    const robotoTypeface = {
      name: 'Roboto',
      fonts: [
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf',
          subFamily: 'Bold'
        }
      ]
    };
    engine.block.setFont(
      promoComponent,
      robotoTypeface.fonts[0].uri,
      robotoTypeface
    );

    engine.block.setWidthMode(promoComponent, 'Absolute');
    engine.block.setHeightMode(promoComponent, 'Absolute');
    engine.block.setWidth(promoComponent, 300);
    engine.block.setHeight(promoComponent, 120);
    engine.block.setBool(promoComponent, 'clipped', true);

    // Add background
    engine.block.setBool(promoComponent, 'backgroundColor/enabled', true);
    engine.block.setColor(promoComponent, 'backgroundColor/color', {
      r: 1.0,
      g: 0.95,
      b: 0.9,
      a: 1.0
    });

    engine.block.setPositionX(promoComponent, 50);
    engine.block.setPositionY(promoComponent, 350);

    // Select the first text component to show it in the inspector
    engine.block.select(textComponent);
  }
}

export default Example;
