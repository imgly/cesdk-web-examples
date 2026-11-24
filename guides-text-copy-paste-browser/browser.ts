import type {
  CreativeEngine,
  DesignBlockId,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import { isEngineError } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Copy and Paste Formatted Text Guide
 *
 * Demonstrates copy and paste of text with its formatting:
 * - Copying formatted text from one text block to another
 * - Pasting HTML from other apps
 * - Falling back to plain text for HTML without text
 * - Connecting a custom input to the clipboard
 */

// Roboto has bold and italic fonts, so pasted bold and italic text can show.
const ROBOTO_TYPEFACE = {
  name: 'Roboto',
  fonts: [
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf',
      subFamily: 'Regular'
    },
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf',
      subFamily: 'Bold',
      weight: 'bold' as const
    },
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf',
      subFamily: 'Italic',
      style: 'italic' as const
    },
    {
      uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf',
      subFamily: 'Bold Italic',
      weight: 'bold' as const,
      style: 'italic' as const
    }
  ]
};

/**
 * Inserts HTML with its formatting. HTML without text, such as a copied
 * image, makes the engine throw and change nothing, so insert the plain
 * text instead.
 */
function pasteHTMLOrText(
  engine: CreativeEngine,
  block: DesignBlockId,
  html: string,
  plainText: string
): void {
  try {
    engine.block.replaceTextWithHTML(block, html);
  } catch (error) {
    if (isEngineError(error) && error.code === 'BLOCK.TEXT_HTML_HAS_NO_TEXT') {
      engine.block.replaceText(block, plainText);
    } else {
      throw error;
    }
  }
}

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
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

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create three text blocks that use a typeface with bold and italic fonts
    const createTextBlock = (y: number): DesignBlockId => {
      const block = engine.block.create('text');
      engine.block.appendChild(page, block);
      engine.block.setPositionX(block, 50);
      engine.block.setPositionY(block, y);
      engine.block.setWidth(block, 700);
      engine.block.setHeightMode(block, 'Auto');
      engine.block.setFont(
        block,
        ROBOTO_TYPEFACE.fonts[0].uri,
        ROBOTO_TYPEFACE
      );
      engine.block.setTextFontSize(block, 36, { unit: 'Pixel' });
      return block;
    };
    const source = createTextBlock(40);
    const copy = createTextBlock(140);
    const pasted = createTextBlock(240);

    // Format ranges of the source block, using UTF-16 indices
    engine.block.replaceText(source, 'Bold, italic and red text');
    engine.block.setTextFontWeight(source, 'bold', 0, 4);
    engine.block.setTextFontStyle(source, 'italic', 6, 12);
    engine.block.setTextColor(source, { r: 1, g: 0, b: 0, a: 1 }, 17, 20);
    engine.block.toggleTextDecorationUnderline(source, 21, 25);

    // Read the whole source block as HTML and replace the text of the copy.
    // HTML from getTextAsHTML() restores every format, typeface and font size included.
    const html = engine.block.getTextAsHTML(source);
    engine.block.replaceTextWithHTML(copy, html);

    // Copy only " red" and insert it at the end of the copy.
    // The same index for `from` and `to` inserts without replacing.
    const redHtml = engine.block.getTextAsHTML(source, 16, 20);
    const end = engine.block.getString(copy, 'text/text').length;
    engine.block.replaceTextWithHTML(copy, redHtml, end, end);

    // HTML from another app sets weight, italic, decorations, colors, lists, the font size,
    // the letter spacing and the line height. Its font family applies when a typeface of the
    // asset sources has that family. Otherwise the text keeps the typeface of the block.
    engine.block.replaceTextWithHTML(
      pasted,
      '<p style="line-height:1.5"><b style="font-size:24px">Bold</b> and ' +
        '<span style="color:#ff0000">red</span></p><ul><li>item</li></ul>'
    );

    // This HTML holds only an image, so the plain text is inserted instead
    const fallback = createTextBlock(400);
    pasteHTMLOrText(
      engine,
      fallback,
      '<p><img src="https://img.ly/static/ubq_samples/sample_1.jpg"></p>',
      'Plain text instead of an image'
    );

    // A custom text field that moves formatted text between the system
    // clipboard and the selected text block
    const input = document.createElement('textarea');
    input.placeholder = 'Select a text block, then paste or copy here';
    input.style.cssText =
      'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);width:320px;z-index:1000;';
    document.body.appendChild(input);

    const selectedTextBlock = (): DesignBlockId | undefined =>
      engine.block
        .findAllSelected()
        .find((block) => engine.block.getType(block) === '//ly.img.ubq/text');

    input.addEventListener('paste', (event: ClipboardEvent) => {
      const block = selectedTextBlock();
      const clipboard = event.clipboardData;
      if (block == null || clipboard == null) {
        return;
      }
      event.preventDefault();
      const plainText = clipboard.getData('text/plain');
      const pastedHtml = clipboard.getData('text/html');
      if (pastedHtml === '') {
        engine.block.replaceText(block, plainText);
      } else {
        pasteHTMLOrText(engine, block, pastedHtml, plainText);
      }
    });

    input.addEventListener('copy', (event: ClipboardEvent) => {
      const block = selectedTextBlock();
      const clipboard = event.clipboardData;
      if (block == null || clipboard == null) {
        return;
      }
      event.preventDefault();
      // Write both formats, so apps without HTML support get the plain text
      clipboard.setData(
        'text/plain',
        engine.block.getString(block, 'text/text')
      );
      clipboard.setData('text/html', engine.block.getTextAsHTML(block));
    });

    // Select the copy to show its formatting in the inspector
    engine.block.setSelected(copy, true);
  }
}

export default Example;
