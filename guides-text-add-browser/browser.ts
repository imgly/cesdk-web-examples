import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Browser Guide: Add Text
 *
 * Demonstrates text block creation and configuration:
 * - Creating text blocks
 * - Setting text content
 * - Configuring auto-sizing
 * - Applying fonts and typefaces
 * - Range-based styling with colors and font weights
 * - Text case transformations
 * - Text alignment and spacing
 */

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default assets and create a design scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions for text demonstration
    const pageWidth = 800;
    const pageHeight = 900;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Document layout settings
    const margin = 40;
    const fontSize = 80;
    const lineSpacing = 100;

    // Create a title text block
    const titleBlock = engine.block.create('text');
    engine.block.appendChild(page, titleBlock);

    // Set the text content using replaceText
    engine.block.replaceText(titleBlock, 'Welcome to CE.SDK');

    // Configure auto-sizing so the block adjusts to content
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');

    // Position at top of document
    engine.block.setPositionX(titleBlock, margin);
    engine.block.setPositionY(titleBlock, margin);

    // Apply a custom font to the title
    // Font URIs point to hosted font files (TTF, OTF, WOFF, WOFF2)
    const fontUri =
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Caveat/Caveat-Bold.ttf';
    const typeface = {
      name: 'Caveat',
      fonts: [
        {
          uri: fontUri,
          subFamily: 'Bold',
          weight: 'bold' as const,
          style: 'normal' as const
        }
      ]
    };
    engine.block.setFont(titleBlock, fontUri, typeface);

    // Set font size (80pt for visibility)
    engine.block.setTextFontSize(titleBlock, fontSize);

    // Create a text block with rich text styling (multiple colors and weights)
    const richTextBlock = engine.block.create('text');
    engine.block.appendChild(page, richTextBlock);
    engine.block.replaceText(richTextBlock, 'Rich text with colors and styles');

    // Position below title
    engine.block.setPositionX(richTextBlock, margin);
    engine.block.setPositionY(richTextBlock, margin + lineSpacing);
    engine.block.setWidthMode(richTextBlock, 'Auto');
    engine.block.setHeightMode(richTextBlock, 'Auto');
    engine.block.setTextFontSize(richTextBlock, fontSize);

    // Apply different colors to specific ranges
    // "Rich" (0-4) in blue
    engine.block.setTextColor(
      richTextBlock,
      { r: 0.2, g: 0.4, b: 0.8, a: 1.0 },
      0,
      4
    );

    // "text" (5-9) in green
    engine.block.setTextColor(
      richTextBlock,
      { r: 0.2, g: 0.7, b: 0.3, a: 1.0 },
      5,
      9
    );

    // "colors" (15-21) in orange
    engine.block.setTextColor(
      richTextBlock,
      { r: 0.9, g: 0.5, b: 0.1, a: 1.0 },
      15,
      21
    );

    // "styles" (26-32) in purple
    engine.block.setTextColor(
      richTextBlock,
      { r: 0.6, g: 0.2, b: 0.8, a: 1.0 },
      26,
      32
    );

    // Create a text block demonstrating auto-sizing with fixed width
    const autoSizeBlock = engine.block.create('text');
    engine.block.appendChild(page, autoSizeBlock);
    engine.block.replaceText(autoSizeBlock, 'Auto-sizing text block');

    // Position below rich text
    engine.block.setPositionX(autoSizeBlock, margin);
    engine.block.setPositionY(autoSizeBlock, margin + lineSpacing * 2);

    // Set fixed width but auto height - text wraps and height adjusts
    engine.block.setWidth(autoSizeBlock, pageWidth - margin * 2);
    engine.block.setWidthMode(autoSizeBlock, 'Absolute');
    engine.block.setHeightMode(autoSizeBlock, 'Auto');
    engine.block.setTextFontSize(autoSizeBlock, fontSize);

    // Create a text block demonstrating text case transformations
    const caseBlock = engine.block.create('text');
    engine.block.appendChild(page, caseBlock);
    engine.block.replaceText(caseBlock, 'uppercase text');

    // Position below auto-size block
    engine.block.setPositionX(caseBlock, margin);
    engine.block.setPositionY(caseBlock, margin + lineSpacing * 3);
    engine.block.setWidthMode(caseBlock, 'Auto');
    engine.block.setHeightMode(caseBlock, 'Auto');
    engine.block.setTextFontSize(caseBlock, fontSize);

    // Transform the entire text to uppercase without changing the source
    engine.block.setTextCase(caseBlock, 'Uppercase');

    // Create a text block demonstrating bold/italic toggle
    const toggleBlock = engine.block.create('text');
    engine.block.appendChild(page, toggleBlock);
    engine.block.replaceText(toggleBlock, 'Toggle Bold and Italic');

    // Position below case block
    engine.block.setPositionX(toggleBlock, margin);
    engine.block.setPositionY(toggleBlock, margin + lineSpacing * 4);
    engine.block.setWidthMode(toggleBlock, 'Auto');
    engine.block.setHeightMode(toggleBlock, 'Auto');
    engine.block.setTextFontSize(toggleBlock, fontSize);

    // Set a font that supports bold/italic variants
    const robotoTypeface = {
      name: 'Roboto',
      fonts: [
        {
          uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf',
          subFamily: 'Regular',
          weight: 'normal' as const,
          style: 'normal' as const
        },
        {
          uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Bold.ttf',
          subFamily: 'Bold',
          weight: 'bold' as const,
          style: 'normal' as const
        },
        {
          uri: 'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Italic.ttf',
          subFamily: 'Italic',
          weight: 'normal' as const,
          style: 'italic' as const
        }
      ]
    };
    engine.block.setFont(
      toggleBlock,
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf',
      robotoTypeface
    );

    // Toggle bold for "Bold" (7-11)
    engine.block.toggleBoldFont(toggleBlock, 7, 11);

    // Toggle italic for "Italic" (16-22)
    engine.block.toggleItalicFont(toggleBlock, 16, 22);

    // Create a text block to demonstrate text modification
    const modifyBlock = engine.block.create('text');
    engine.block.appendChild(page, modifyBlock);
    engine.block.replaceText(modifyBlock, 'Hello World');

    // Position below toggle block
    engine.block.setPositionX(modifyBlock, margin);
    engine.block.setPositionY(modifyBlock, margin + lineSpacing * 5);
    engine.block.setWidthMode(modifyBlock, 'Auto');
    engine.block.setHeightMode(modifyBlock, 'Auto');
    engine.block.setTextFontSize(modifyBlock, fontSize);

    // Replace "World" with "CE.SDK" (range 6-11)
    engine.block.replaceText(modifyBlock, 'CE.SDK', 6, 11);
    // Result: "Hello CE.SDK"

    // Create a centered text block with custom spacing
    const alignedBlock = engine.block.create('text');
    engine.block.appendChild(page, alignedBlock);
    engine.block.replaceText(alignedBlock, 'Centered Text\nWith Line Spacing');

    // Position at bottom of document
    engine.block.setPositionX(alignedBlock, margin);
    engine.block.setPositionY(alignedBlock, margin + lineSpacing * 6);

    // Set explicit dimensions for centered alignment
    engine.block.setWidth(alignedBlock, pageWidth - margin * 2);
    engine.block.setWidthMode(alignedBlock, 'Absolute');
    engine.block.setHeightMode(alignedBlock, 'Auto');
    engine.block.setTextFontSize(alignedBlock, fontSize);

    // Set horizontal alignment to center
    engine.block.setEnum(alignedBlock, 'text/horizontalAlignment', 'Center');

    // Adjust line height (1.5 = 150% of font size)
    engine.block.setFloat(alignedBlock, 'text/lineHeight', 1.5);

    // Adjust letter spacing (0.05 = 5% of font size)
    engine.block.setFloat(alignedBlock, 'text/letterSpacing', 0.05);

    // Select the title block to show in the editor
    engine.block.select(titleBlock);
  }
}

export default Example;
