import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Insert Shapes or Stickers Guide
 *
 * Demonstrates inserting various shapes and stickers into designs:
 * - Checking shape support on blocks
 * - Creating different shape types (rect, ellipse, star, polygon, line, vector_path)
 * - Configuring shape-specific properties
 * - Applying fills to make shapes visible
 * - Adding stickers using convenience API and manual construction
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];
    if (!engine.block.isValid(page)) {
      throw new Error('No page found');
    }

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Calculate responsive grid layout based on page dimensions
    const layout = calculateGridLayout(pageWidth, pageHeight, 10);
    const { blockWidth, blockHeight, getPosition } = layout;
    const blockSize = { width: blockWidth, height: blockHeight };

    // Check if a block supports shapes before attaching one
    const testBlock = engine.block.create('graphic');
    const supportsShape = engine.block.supportsShape(testBlock);
    // eslint-disable-next-line no-console
    console.log('Graphic block supports shapes:', supportsShape); // true

    // Text blocks do not support shapes
    const textBlock = engine.block.create('text');
    const textSupportsShape = engine.block.supportsShape(textBlock);
    // eslint-disable-next-line no-console
    console.log('Text block supports shapes:', textSupportsShape); // false
    engine.block.destroy(textBlock);
    engine.block.destroy(testBlock);

    // Track all created blocks for positioning
    const allBlocks: number[] = [];

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

    engine.block.setWidth(rectBlock, blockWidth);
    engine.block.setHeight(rectBlock, blockHeight);
    engine.block.appendChild(page, rectBlock);
    allBlocks.push(rectBlock);

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

    engine.block.setWidth(roundedRectBlock, blockWidth);
    engine.block.setHeight(roundedRectBlock, blockHeight);
    engine.block.appendChild(page, roundedRectBlock);
    allBlocks.push(roundedRectBlock);

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

    engine.block.setWidth(ellipseBlock, blockWidth);
    engine.block.setHeight(ellipseBlock, blockHeight);
    engine.block.appendChild(page, ellipseBlock);
    allBlocks.push(ellipseBlock);

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

    engine.block.setWidth(starBlock, blockWidth);
    engine.block.setHeight(starBlock, blockHeight);
    engine.block.appendChild(page, starBlock);
    allBlocks.push(starBlock);

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

    engine.block.setWidth(polygonBlock, blockWidth);
    engine.block.setHeight(polygonBlock, blockHeight);
    engine.block.appendChild(page, polygonBlock);
    allBlocks.push(polygonBlock);

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

    engine.block.setWidth(lineBlock, blockWidth);
    engine.block.setHeight(lineBlock, blockHeight);
    engine.block.appendChild(page, lineBlock);
    allBlocks.push(lineBlock);

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

    engine.block.setWidth(vectorPathBlock, blockWidth);
    engine.block.setHeight(vectorPathBlock, blockHeight);
    engine.block.appendChild(page, vectorPathBlock);
    allBlocks.push(vectorPathBlock);

    // Discover available properties for a shape
    const shapeProperties = engine.block.findAllProperties(starShape);
    // eslint-disable-next-line no-console
    console.log('Star shape properties:', shapeProperties);

    // Add a sticker using the convenience API
    const stickerUrl =
      'https://cdn.img.ly/assets/v4/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_grin.svg';
    const stickerBlock = await engine.block.addImage(stickerUrl, {
      size: blockSize
    });
    engine.block.setKind(stickerBlock, 'sticker');
    engine.block.appendChild(page, stickerBlock);
    allBlocks.push(stickerBlock);

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

    engine.block.setWidth(manualStickerBlock, blockWidth);
    engine.block.setHeight(manualStickerBlock, blockHeight);
    engine.block.appendChild(page, manualStickerBlock);
    allBlocks.push(manualStickerBlock);

    // Query stickers from the asset library
    const stickerResults = await engine.asset.findAssets('ly.img.sticker', {
      page: 0,
      perPage: 5
    });
    // eslint-disable-next-line no-console
    console.log('Available stickers:', stickerResults.assets.length);

    // Position all blocks in grid layout
    allBlocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Select the star block to show it in the inspector
    engine.block.setSelected(starBlock, true);

    // Set zoom to auto-fit the page
    await cesdk.actions.run('zoom.toPage', { autoFit: true });

    // eslint-disable-next-line no-console
    console.log('Shapes and stickers guide initialized.');
  }
}

export default Example;
