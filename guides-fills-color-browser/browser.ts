import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import { calculateGridLayout } from './utils';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Color Fills Guide
 *
 * This example demonstrates:
 * - Creating and applying color fills
 * - Working with RGB, CMYK, and Spot Colors
 * - Managing fill properties
 * - Enabling/disabling fills
 * - Sharing fills between blocks
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Create a design scene using CE.SDK cesdk method
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Set page background to light gray
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.96,
      g: 0.96,
      b: 0.96,
      a: 1.0
    });

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 12);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Helper function to create a shape with a fill
    const createShapeWithFill = (
      shapeType: 'rect' | 'ellipse' | 'polygon' | 'star' = 'rect'
    ): { block: number; fill: number } => {
      const block = engine.block.create('graphic');
      const shape = engine.block.createShape(shapeType);
      engine.block.setShape(block, shape);

      // Set size
      engine.block.setWidth(block, blockWidth);
      engine.block.setHeight(block, blockHeight);

      // Append to page
      engine.block.appendChild(page, block);

      // Check if block supports fills
      const canHaveFill = engine.block.supportsFill(block);
      if (!canHaveFill) {
        throw new Error('Block does not support fills');
      }

      // Create a color fill
      const colorFill = engine.block.createFill('color');

      // Apply the fill to the block
      engine.block.setFill(block, colorFill);

      return { block, fill: colorFill };
    };

    // Example 1: RGB Color Fill (Red)
    const { block: rgbBlock, fill: rgbFill } = createShapeWithFill();
    engine.block.setColor(rgbFill, 'fill/color/value', {
      r: 1.0, // Red (0.0 to 1.0)
      g: 0.0, // Green
      b: 0.0, // Blue
      a: 1.0 // Alpha (opacity)
    });

    // Example 2: RGB Color Fill (Green with transparency)
    const { block: transparentBlock, fill: transparentFill } =
      createShapeWithFill();
    engine.block.setColor(transparentFill, 'fill/color/value', {
      r: 0.0,
      g: 0.8,
      b: 0.2,
      a: 0.5 // 50% opacity
    });

    // Example 3: RGB Color Fill (Blue)
    const { block: blueBlock, fill: blueFill } = createShapeWithFill();
    engine.block.setColor(blueFill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1.0
    });

    // Get the current fill from a block
    const currentFill = engine.block.getFill(blueBlock);
    const fillType = engine.block.getType(currentFill);
    // eslint-disable-next-line no-console
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/color'

    // Get the current color value
    const currentColor = engine.block.getColor(blueFill, 'fill/color/value');
    // eslint-disable-next-line no-console
    console.log('Current color:', currentColor);

    // Example 4: CMYK Color Fill (Magenta)
    const { block: cmykBlock, fill: cmykFill } = createShapeWithFill('ellipse');
    engine.block.setColor(cmykFill, 'fill/color/value', {
      c: 0.0, // Cyan (0.0 to 1.0)
      m: 1.0, // Magenta
      y: 0.0, // Yellow
      k: 0.0, // Key/Black
      tint: 1.0 // Tint value (0.0 to 1.0)
    });

    // Example 5: Print-Ready CMYK Color
    const { block: printBlock, fill: printFill } =
      createShapeWithFill('ellipse');
    engine.block.setColor(printFill, 'fill/color/value', {
      c: 0.0,
      m: 0.85,
      y: 1.0,
      k: 0.0,
      tint: 1.0
    });

    // Example 6: Spot Color (Brand Color)
    // First define the spot color globally
    engine.editor.setSpotColorRGB('BrandRed', 0.9, 0.1, 0.1);
    engine.editor.setSpotColorRGB('BrandBlue', 0.1, 0.3, 0.9);

    // Then apply to fill
    const { block: spotBlock, fill: spotFill } = createShapeWithFill('ellipse');
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'BrandRed',
      tint: 1.0,
      externalReference: '' // Optional reference system
    });

    // Example 7: Brand Color Application
    // Apply brand color to multiple elements
    const { block: headerBlock, fill: headerFill } =
      createShapeWithFill('star');
    const brandColor = { name: 'BrandBlue', tint: 1.0, externalReference: '' };
    engine.block.setColor(headerFill, 'fill/color/value', brandColor);

    // Example 8: Second element with same brand color
    const { block: buttonBlock, fill: buttonFill } =
      createShapeWithFill('star');
    engine.block.setColor(buttonFill, 'fill/color/value', brandColor);

    // Example 9: Toggle fill visibility
    const { block: toggleBlock, fill: toggleFill } =
      createShapeWithFill('star');
    engine.block.setColor(toggleFill, 'fill/color/value', {
      r: 1.0,
      g: 0.5,
      b: 0.0,
      a: 1.0
    });

    // Check fill state
    const isEnabled = engine.block.isFillEnabled(toggleBlock);
    // eslint-disable-next-line no-console
    console.log('Fill enabled:', isEnabled); // true

    // Example 10: Shared Fill
    const block1 = engine.block.create('graphic');
    const shape1 = engine.block.createShape('rect');
    engine.block.setShape(block1, shape1);
    engine.block.setWidth(block1, blockWidth);
    engine.block.setHeight(block1, blockHeight / 2);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    const shape2 = engine.block.createShape('rect');
    engine.block.setShape(block2, shape2);
    engine.block.setWidth(block2, blockWidth);
    engine.block.setHeight(block2, blockHeight / 2);
    engine.block.appendChild(page, block2);

    // Create one fill
    const sharedFill = engine.block.createFill('color');
    engine.block.setColor(sharedFill, 'fill/color/value', {
      r: 0.5,
      g: 0.0,
      b: 0.5,
      a: 1.0
    });

    // Apply to both blocks
    engine.block.setFill(block1, sharedFill);
    engine.block.setFill(block2, sharedFill);

    // Example 11: Yellow Star
    const { block: replaceBlock, fill: replaceFill } =
      createShapeWithFill('star');
    engine.block.setColor(replaceFill, 'fill/color/value', {
      r: 0.9,
      g: 0.9,
      b: 0.1,
      a: 1.0
    });

    // Example 12: Color Space Conversion (for demonstration)
    const rgbColor = { r: 1.0, g: 0.0, b: 0.0, a: 1.0 };

    // Convert to CMYK
    const cmykColor = engine.editor.convertColorToColorSpace(rgbColor, 'CMYK');
    // eslint-disable-next-line no-console
    console.log('Converted CMYK color:', cmykColor);

    // ===== Position all blocks in grid layout =====
    const blocks = [
      rgbBlock, // Position 0
      transparentBlock, // Position 1
      blueBlock, // Position 2
      cmykBlock, // Position 3
      printBlock, // Position 4
      spotBlock, // Position 5
      headerBlock, // Position 6
      buttonBlock, // Position 7
      toggleBlock, // Position 8
      block1, // Position 9
      block2, // Position 10
      replaceBlock // Position 11
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Zoom to fit all content
    await engine.scene.zoomToBlock(page, {
      padding: {
        left: 40,
        top: 40,
        right: 40,
        bottom: 40
      }
    });
  }
}

export default Example;
