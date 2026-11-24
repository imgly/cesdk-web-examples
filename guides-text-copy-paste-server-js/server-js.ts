import CreativeEngine, { type DesignBlockId } from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Copy and Paste Formatted Text
 *
 * Demonstrates copy and paste of text with its formatting:
 * - Copying formatted text from one text block to another
 * - Inserting HTML from other apps
 * - Falling back to plain text for HTML without text
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

async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    // Create text blocks that use a typeface with bold and italic fonts
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
    console.log('HTML of the source block:', html);

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
    console.log('Pasted text:', engine.block.getString(pasted, 'text/text'));

    // HTML without text, such as a copied image, makes the engine throw and
    // change nothing, so insert the plain text instead. @cesdk/node exports
    // no isEngineError() helper, so read the `code` of the error.
    const pasteHTMLOrText = (
      block: DesignBlockId,
      htmlToPaste: string,
      plainText: string
    ): void => {
      try {
        engine.block.replaceTextWithHTML(block, htmlToPaste);
      } catch (error) {
        const { code } = error as { code?: string };
        if (code === 'BLOCK.TEXT_HTML_HAS_NO_TEXT') {
          engine.block.replaceText(block, plainText);
        } else {
          throw error;
        }
      }
    };

    const fallback = createTextBlock(400);
    pasteHTMLOrText(
      fallback,
      '<p><img src="https://img.ly/static/ubq_samples/sample_1.jpg"></p>',
      'Plain text instead of an image'
    );

    // Export the page to PNG
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    if (!existsSync('output')) {
      mkdirSync('output');
    }
    writeFileSync('output/text-copy-paste.png', buffer);
    console.log('Exported the page to output/text-copy-paste.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
