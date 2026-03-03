import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';

// Load environment variables
config();

// Prompt utility for interactive save options
function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  // Display save options menu
  console.log('=== Template Save Options ===\n');
  console.log('1. Save as string (for CDN-hosted assets)');
  console.log('2. Save as archive (self-contained ZIP)');
  console.log('3. Export as PNG image');
  console.log('4. Save all formats and export png\n');

  const choice = (await prompt('Select save option (1-4): ')) || '4';
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Template layout constants for a promotional card
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 1000;
    const PADDING = 40;
    const CONTENT_WIDTH = CANVAS_WIDTH - PADDING * 2;

    // Create a blank scene with custom dimensions
    engine.scene.create('Free', {
      page: { size: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } }
    });

    // Set design unit to Pixel for precise coordinate mapping
    engine.scene.setDesignUnit('Pixel');

    // Get the page that was automatically created
    const page = engine.block.findByType('page')[0];

    // Set a gradient background for the template
    const backgroundFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(backgroundFill, 'fill/gradient/colors', [
      { color: { r: 0.4, g: 0.2, b: 0.6, a: 1.0 }, stop: 0 }, // Purple
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 }, stop: 1 } // Blue
    ]);
    engine.block.setFill(page, backgroundFill);

    // Font URIs for consistent typography
    const FONT_BOLD =
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Bold.ttf';
    const FONT_REGULAR =
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf';

    // Create headline text block with {{title}} variable
    const headline = engine.block.create('text');
    engine.block.replaceText(headline, '{{title}}');

    // Set font with proper typeface for consistent rendering
    engine.block.setFont(headline, FONT_BOLD, {
      name: 'Roboto',
      fonts: [{ uri: FONT_BOLD, subFamily: 'Bold', weight: 'bold' }]
    });
    engine.block.setFloat(headline, 'text/fontSize', 28);
    engine.block.setTextColor(headline, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });

    // Position and size the headline
    engine.block.setWidthMode(headline, 'Absolute');
    engine.block.setHeightMode(headline, 'Auto');
    engine.block.setWidth(headline, CONTENT_WIDTH);
    engine.block.setPositionX(headline, PADDING);
    engine.block.setPositionY(headline, 50);
    engine.block.setEnum(headline, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, headline);

    // Set default value for the title variable
    engine.variable.setString('title', 'Summer Sale');

    // Create subheadline text block with {{subtitle}} variable
    const subheadline = engine.block.create('text');
    engine.block.replaceText(subheadline, '{{subtitle}}');

    engine.block.setFont(subheadline, FONT_REGULAR, {
      name: 'Roboto',
      fonts: [{ uri: FONT_REGULAR, subFamily: 'Regular', weight: 'normal' }]
    });
    engine.block.setFloat(subheadline, 'text/fontSize', 14);
    engine.block.setTextColor(subheadline, { r: 0.9, g: 0.9, b: 0.95, a: 1.0 });

    engine.block.setWidthMode(subheadline, 'Absolute');
    engine.block.setHeightMode(subheadline, 'Auto');
    engine.block.setWidth(subheadline, CONTENT_WIDTH);
    engine.block.setPositionX(subheadline, PADDING);
    engine.block.setPositionY(subheadline, 175);
    engine.block.setEnum(subheadline, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, subheadline);

    engine.variable.setString('subtitle', 'Up to 50% off all items');

    // Create image placeholder in the center of the card
    const imageBlock = engine.block.create('graphic');
    const imageShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, imageShape);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    engine.block.setWidth(imageBlock, CONTENT_WIDTH);
    engine.block.setHeight(imageBlock, 420);
    engine.block.setPositionX(imageBlock, PADDING);
    engine.block.setPositionY(imageBlock, 295);
    engine.block.appendChild(page, imageBlock);

    // Enable placeholder behavior on the image fill
    const fill = engine.block.getFill(imageBlock);
    if (fill !== null && engine.block.supportsPlaceholderBehavior(fill)) {
      engine.block.setPlaceholderBehaviorEnabled(fill, true);
    }
    engine.block.setPlaceholderEnabled(imageBlock, true);

    // Enable visual controls for the placeholder
    engine.block.setPlaceholderControlsOverlayEnabled(imageBlock, true);
    engine.block.setPlaceholderControlsButtonEnabled(imageBlock, true);

    // Create CTA (call-to-action) text block with {{cta}} variable
    const cta = engine.block.create('text');
    engine.block.replaceText(cta, '{{cta}}');

    engine.block.setFont(cta, FONT_BOLD, {
      name: 'Roboto',
      fonts: [{ uri: FONT_BOLD, subFamily: 'Bold', weight: 'bold' }]
    });
    engine.block.setFloat(cta, 'text/fontSize', 8.4);
    engine.block.setTextColor(cta, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });

    engine.block.setWidthMode(cta, 'Absolute');
    engine.block.setHeightMode(cta, 'Auto');
    engine.block.setWidth(cta, CONTENT_WIDTH);
    engine.block.setPositionX(cta, PADDING);
    engine.block.setPositionY(cta, 765);
    engine.block.setEnum(cta, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, cta);

    engine.variable.setString('cta', 'Learn More');

    // Set global scope to 'Defer' for per-block control
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('layer/resize', 'Defer');

    // Lock all text block positions but allow text editing
    const textBlocks = [headline, subheadline, cta];
    textBlocks.forEach((block) => {
      engine.block.setScopeEnabled(block, 'layer/move', false);
      engine.block.setScopeEnabled(block, 'layer/resize', false);
    });

    // Lock image position but allow fill replacement
    engine.block.setScopeEnabled(imageBlock, 'layer/move', false);
    engine.block.setScopeEnabled(imageBlock, 'layer/resize', false);
    engine.block.setScopeEnabled(imageBlock, 'fill/change', true);

    // Ensure output directory exists
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Save template based on user choice
    if (choice === '1' || choice === '4') {
      // Save the template as a string (for CDN-hosted assets)
      const templateString = await engine.scene.saveToString();
      writeFileSync(`${outputDir}/template.scene`, templateString);
      console.log('Template saved to output/template.scene');
    }

    if (choice === '2' || choice === '4') {
      // Save the template as a self-contained archive
      const templateArchive = await engine.scene.saveToArchive();
      const archiveBuffer = Buffer.from(await templateArchive.arrayBuffer());
      writeFileSync(`${outputDir}/template.zip`, archiveBuffer);
      console.log('Template archive saved to output/template.zip');
    }

    if (choice === '3' || choice === '4') {
      // Export the template as a PNG image
      const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
      const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
      writeFileSync(`${outputDir}/template.png`, pngBuffer);
      console.log('Template exported to output/template.png');
    }

    console.log('Template creation completed successfully');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
