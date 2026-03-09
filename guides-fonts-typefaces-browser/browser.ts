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
import type CreativeEngine from '@cesdk/cesdk-js/node_modules/@cesdk/engine';
import packageJson from './package.json';

class CustomFontsExample implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }
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

    const engine = cesdk.engine;
    const orbitronTypeface = createOrbitronTypeface();

    const sourceId = 'my-custom-typefaces';
    engine.asset.addLocalSource(sourceId);

    await engine.asset.addAssetToSource(sourceId, {
      id: 'orbitron',
      payload: {
        typeface: orbitronTypeface
      }
    });

    cesdk.ui.updateAssetLibraryEntry('ly.img.typefaces', {
      sourceIds: ['my-custom-typefaces']
    });

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

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
  weight:
    | 'thin'
    | 'extraLight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semiBold'
    | 'bold'
    | 'extraBold'
    | 'heavy';
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
