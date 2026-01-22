import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import type CreativeEngine from '@cesdk/cesdk-js/node_modules/@cesdk/engine';
import packageJson from './package.json';

class CustomFontsExample implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load assets
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // Create the typeface with resolved font URIs
    const orbitronTypeface = createOrbitronTypeface();

    // Create a local asset source for custom typefaces
    engine.asset.addLocalSource('my-custom-typefaces');

    // Add a typeface with multiple font variants
    engine.asset.addAssetToSource('my-custom-typefaces', {
      id: 'orbitron',
      label: {
        en: 'Orbitron'
      },
      payload: {
        typeface: orbitronTypeface
      }
    });

    // Replace the default typefaces with the custom source
    cesdk.ui.updateAssetLibraryEntry('ly.img.typefaces', {
      sourceIds: ['my-custom-typefaces']
    });

    // Create a design scene to display the editor
    await cesdk.createDesignScene();

    // Create a text block and apply the custom font
    const page = engine.block.findByType('page')[0];
    if (page) {
      const textBlock = engine.block.create('text');
      engine.block.appendChild(page, textBlock);

      // Set the text content
      engine.block.replaceText(textBlock, 'Custom Font Example');

      // Configure auto-sizing so the block adjusts to content
      engine.block.setWidthMode(textBlock, 'Auto');
      engine.block.setHeightMode(textBlock, 'Auto');

      // Apply the custom font to the text block
      const fontUri = orbitronTypeface.fonts[0].uri;
      engine.block.setFont(textBlock, fontUri, orbitronTypeface);

      // Set font size
      engine.block.setTextFontSize(textBlock, 24);

      // Center the text block on the page
      centerBlockOnPage(engine, textBlock, page);

      // Select the text block
      engine.block.select(textBlock);
    }
  }
}

export default CustomFontsExample;

// ============================================================================
// Typeface Definitions
// ============================================================================

type DesignBlockId = number;

interface TypefaceFont {
  uri: string;
  subFamily: string;
  weight: 'thin' | 'extraLight' | 'light' | 'normal' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'heavy';
  style: 'normal' | 'italic';
}

interface Typeface {
  name: string;
  fonts: TypefaceFont[];
}

/**
 * Builds a full URL for a font file served from the public directory
 */
function buildFontUri(filename: string): string {
  return `${window.location.protocol}//${window.location.host}/${filename}`;
}

/**
 * Creates the Orbitron typeface with properly resolved font URIs
 */
function createOrbitronTypeface(): Typeface {
  return {
    name: 'Orbitron',
    fonts: [
      {
        uri: buildFontUri('Orbitron-Regular.ttf'),
        subFamily: 'Regular',
        weight: 'normal',
        style: 'normal'
      },
      {
        uri: buildFontUri('Orbitron-Bold.ttf'),
        subFamily: 'Bold',
        weight: 'bold',
        style: 'normal'
      }
    ]
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Centers a block on a page by calculating and setting its position
 */
function centerBlockOnPage(
  engine: CreativeEngine,
  block: DesignBlockId,
  page: DesignBlockId
): void {
  const pageWidth = engine.block.getWidth(page);
  const pageHeight = engine.block.getHeight(page);
  const blockWidth = engine.block.getFrameWidth(block);
  const blockHeight = engine.block.getFrameHeight(block);
  engine.block.setPositionX(block, (pageWidth - blockWidth) / 2);
  engine.block.setPositionY(block, (pageHeight - blockHeight) / 2);
}
