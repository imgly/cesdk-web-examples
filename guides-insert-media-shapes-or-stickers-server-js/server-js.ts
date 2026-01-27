import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';

// Load environment variables
config();

// Prompt user to confirm export
async function confirmExport(): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nExport design to PNG? [Y/n]: ', (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      resolve(normalized === '' || normalized === 'y' || normalized === 'yes');
    });
  });
}

/**
 * CE.SDK Server Guide: Insert Shapes or Stickers
 *
 * Demonstrates inserting various shapes and stickers into designs:
 * - Checking shape support on blocks
 * - Creating different shape types (rect, ellipse, star, polygon, line, vector_path)
 * - Configuring shape-specific properties
 * - Applying fills to make shapes visible
 * - Adding stickers using convenience API and manual construction
 */
async function main() {
  console.log('\n⏳ Initializing CE.SDK engine...');

  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    console.log('⏳ Creating scene and shapes...');

    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const page = engine.block.findByType('page')[0];
    if (!engine.block.isValid(page)) {
      throw new Error('No page found');
    }

    // Check if a block supports shapes before attaching one
    const testBlock = engine.block.create('graphic');
    const supportsShape = engine.block.supportsShape(testBlock);
    console.log('Graphic block supports shapes:', supportsShape); // true

    // Text blocks do not support shapes
    const textBlock = engine.block.create('text');
    const textSupportsShape = engine.block.supportsShape(textBlock);
    console.log('Text block supports shapes:', textSupportsShape); // false
    engine.block.destroy(textBlock);
    engine.block.destroy(testBlock);

    // Create a rectangle with a solid color fill
    const rectBlock = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(rectBlock, rectShape);

    // Apply a solid color fill to make the shape visible
    const rectFill = engine.block.createFill('color');
    engine.block.setColor(rectFill, 'fill/color/value', {
      r: 0.2,
      g: 0.5,
      b: 0.9,
      a: 1.0
    });
    engine.block.setFill(rectBlock, rectFill);

    engine.block.setWidth(rectBlock, 100);
    engine.block.setHeight(rectBlock, 100);
    engine.block.setPositionX(rectBlock, 50);
    engine.block.setPositionY(rectBlock, 50);
    engine.block.appendChild(page, rectBlock);

    // Create a rounded rectangle with corner radius
    const roundedRectBlock = engine.block.create('graphic');
    const roundedRectShape = engine.block.createShape('rect');
    engine.block.setShape(roundedRectBlock, roundedRectShape);

    // Set corner radius for rounded corners
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusTL', 20);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusTR', 20);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusBL', 20);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusBR', 20);

    const roundedRectFill = engine.block.createFill('color');
    engine.block.setColor(roundedRectFill, 'fill/color/value', {
      r: 0.9,
      g: 0.4,
      b: 0.2,
      a: 1.0
    });
    engine.block.setFill(roundedRectBlock, roundedRectFill);

    engine.block.setWidth(roundedRectBlock, 100);
    engine.block.setHeight(roundedRectBlock, 100);
    engine.block.setPositionX(roundedRectBlock, 180);
    engine.block.setPositionY(roundedRectBlock, 50);
    engine.block.appendChild(page, roundedRectBlock);

    // Create an ellipse (circle when width equals height)
    const ellipseBlock = engine.block.create('graphic');
    const ellipseShape = engine.block.createShape('ellipse');
    engine.block.setShape(ellipseBlock, ellipseShape);

    const ellipseFill = engine.block.createFill('color');
    engine.block.setColor(ellipseFill, 'fill/color/value', {
      r: 0.3,
      g: 0.8,
      b: 0.4,
      a: 1.0
    });
    engine.block.setFill(ellipseBlock, ellipseFill);

    engine.block.setWidth(ellipseBlock, 100);
    engine.block.setHeight(ellipseBlock, 100);
    engine.block.setPositionX(ellipseBlock, 310);
    engine.block.setPositionY(ellipseBlock, 50);
    engine.block.appendChild(page, ellipseBlock);

    // Create a star with custom points and inner diameter
    const starBlock = engine.block.create('graphic');
    const starShape = engine.block.createShape('star');
    engine.block.setShape(starBlock, starShape);

    // Configure star properties
    engine.block.setInt(starShape, 'shape/star/points', 5);
    engine.block.setFloat(starShape, 'shape/star/innerDiameter', 0.4);

    const starFill = engine.block.createFill('color');
    engine.block.setColor(starFill, 'fill/color/value', {
      r: 1.0,
      g: 0.8,
      b: 0.0,
      a: 1.0
    });
    engine.block.setFill(starBlock, starFill);

    engine.block.setWidth(starBlock, 100);
    engine.block.setHeight(starBlock, 100);
    engine.block.setPositionX(starBlock, 440);
    engine.block.setPositionY(starBlock, 50);
    engine.block.appendChild(page, starBlock);

    // Create a polygon (hexagon with 6 sides)
    const polygonBlock = engine.block.create('graphic');
    const polygonShape = engine.block.createShape('polygon');
    engine.block.setShape(polygonBlock, polygonShape);

    // Set number of sides for the polygon
    engine.block.setInt(polygonShape, 'shape/polygon/sides', 6);

    const polygonFill = engine.block.createFill('color');
    engine.block.setColor(polygonFill, 'fill/color/value', {
      r: 0.6,
      g: 0.2,
      b: 0.8,
      a: 1.0
    });
    engine.block.setFill(polygonBlock, polygonFill);

    engine.block.setWidth(polygonBlock, 100);
    engine.block.setHeight(polygonBlock, 100);
    engine.block.setPositionX(polygonBlock, 570);
    engine.block.setPositionY(polygonBlock, 50);
    engine.block.appendChild(page, polygonBlock);

    // Create a line shape
    const lineBlock = engine.block.create('graphic');
    const lineShape = engine.block.createShape('line');
    engine.block.setShape(lineBlock, lineShape);

    // Lines typically use strokes instead of fills
    engine.block.setStrokeEnabled(lineBlock, true);
    engine.block.setStrokeWidth(lineBlock, 6);
    engine.block.setStrokeColor(lineBlock, {
      r: 0.9,
      g: 0.2,
      b: 0.5,
      a: 1.0
    });

    engine.block.setWidth(lineBlock, 100);
    engine.block.setHeight(lineBlock, 100);
    engine.block.setPositionX(lineBlock, 50);
    engine.block.setPositionY(lineBlock, 200);
    engine.block.appendChild(page, lineBlock);

    // Create a custom triangle using vector path
    const vectorPathBlock = engine.block.create('graphic');
    const vectorPathShape = engine.block.createShape('vector_path');
    engine.block.setShape(vectorPathBlock, vectorPathShape);

    // Define a triangle using SVG path syntax (coordinates scale with block size)
    const trianglePath = 'M 50,0 L 100,100 L 0,100 Z';
    engine.block.setString(
      vectorPathShape,
      'shape/vector_path/path',
      trianglePath
    );

    const vectorPathFill = engine.block.createFill('color');
    engine.block.setColor(vectorPathFill, 'fill/color/value', {
      r: 0.9,
      g: 0.2,
      b: 0.5,
      a: 1.0
    });
    engine.block.setFill(vectorPathBlock, vectorPathFill);

    engine.block.setWidth(vectorPathBlock, 100);
    engine.block.setHeight(vectorPathBlock, 100);
    engine.block.setPositionX(vectorPathBlock, 180);
    engine.block.setPositionY(vectorPathBlock, 200);
    engine.block.appendChild(page, vectorPathBlock);

    // Discover available properties for a shape
    const shapeProperties = engine.block.findAllProperties(starShape);
    console.log('Star shape properties:', shapeProperties);

    // Add a sticker using the convenience API
    const stickerUrl =
      'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_grin.svg';
    const stickerBlock = await engine.block.addImage(stickerUrl, {
      size: { width: 100, height: 100 }
    });
    engine.block.setKind(stickerBlock, 'sticker');
    engine.block.setPositionX(stickerBlock, 310);
    engine.block.setPositionY(stickerBlock, 200);
    engine.block.appendChild(page, stickerBlock);

    // Add a sticker using manual construction for more control
    const manualStickerBlock = engine.block.create('graphic');
    const manualStickerShape = engine.block.createShape('rect');
    engine.block.setShape(manualStickerBlock, manualStickerShape);

    // Create image fill with the sticker URI
    const stickerFill = engine.block.createFill('image');
    engine.block.setString(
      stickerFill,
      'fill/image/imageFileURI',
      'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg'
    );
    engine.block.setFill(manualStickerBlock, stickerFill);

    // Set content fill mode to preserve aspect ratio
    if (engine.block.supportsContentFillMode(manualStickerBlock)) {
      engine.block.setContentFillMode(manualStickerBlock, 'Contain');
    }

    // Set kind to 'sticker' for proper categorization
    engine.block.setKind(manualStickerBlock, 'sticker');

    engine.block.setWidth(manualStickerBlock, 100);
    engine.block.setHeight(manualStickerBlock, 100);
    engine.block.setPositionX(manualStickerBlock, 440);
    engine.block.setPositionY(manualStickerBlock, 200);
    engine.block.appendChild(page, manualStickerBlock);

    // Export the result to a file after user confirmation
    const shouldExport = await confirmExport();
    if (shouldExport) {
      console.log('\n⏳ Exporting design...');
      const outputDir = './output';
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      const blob = await engine.block.export(page, { mimeType: 'image/png' });
      const buffer = Buffer.from(await blob.arrayBuffer());
      const outputPath = `${outputDir}/shapes-and-stickers.png`;
      writeFileSync(outputPath, buffer);

      console.log(`\n✅ Exported result to ${outputPath}`);
    } else {
      console.log('\n⏭️ Export skipped.');
    }
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
    console.log('🧹 Engine disposed');
  }
}

main().catch(console.error);
