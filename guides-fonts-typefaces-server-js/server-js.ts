import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Customize Fonts
 *
 * Demonstrates how to register a font file with getFontInfo:
 * - Reading the names, weight and style of a font file
 * - Adding the font to a custom typeface asset source
 * - Applying the font to a text block and exporting the result
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  engine.scene.create('VerticalStack', {
    page: { size: { width: 800, height: 400 } }
  });
  const page = engine.block.findByType('page')[0];

  const fontUri =
    'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf';
  const info = await engine.editor.getFontInfo(fontUri);

  console.log('Family:', info.family);
  console.log('Subfamily:', info.subFamily);
  console.log('Weight:', info.weight, info.fontWeight);
  console.log('Style:', info.style);
  console.log('Variable:', info.isVariable, info.variationAxes);

  const typeface = {
    name: info.family,
    fonts: [
      {
        uri: fontUri,
        subFamily: info.subFamily,
        weight: info.fontWeight,
        style: info.style
      }
    ]
  };

  const sourceId = 'my-custom-typefaces';
  engine.asset.addLocalSource(sourceId);
  await engine.asset.addAssetToSource(sourceId, {
    id: fontUri,
    label: { en: info.family },
    payload: { typeface }
  });

  const text = engine.block.create('text');
  engine.block.appendChild(page, text);
  engine.block.replaceText(text, 'Uploaded Font');
  engine.block.setWidthMode(text, 'Auto');
  engine.block.setHeightMode(text, 'Auto');
  engine.block.setPositionX(text, 50);
  engine.block.setPositionY(text, 150);

  engine.block.setFont(text, fontUri, typeface);
  engine.block.setTextFontSize(text, 24);

  console.log('Applied typeface:', engine.block.getTypeface(text).name);

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());

  if (!existsSync('output')) {
    mkdirSync('output');
  }
  writeFileSync('output/custom-font.png', buffer);
  console.log('Exported the page to output/custom-font.png');
} finally {
  engine.dispose();
}
