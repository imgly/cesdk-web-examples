import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Gradient Fills Guide
 *
 * This example demonstrates:
 * - Creating linear, radial, and conical gradient fills
 * - Configuring gradient color stops
 * - Positioning gradients
 * - Using different color spaces in gradients
 * - Advanced gradient techniques
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Fill features are enabled by default in CE.SDK
    // You can check and control fill feature availability:
    const engine = cesdk.engine;
    const isFillEnabled = cesdk.feature.isEnabled('ly.img.fill', { engine });
    console.log('Fill feature enabled:', isFillEnabled);

    // Create a design scene using CE.SDK cesdk method
    await cesdk.actions.run('scene.create', {
      page: { width: 1200, height: 900, unit: 'Pixel' }
    });

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page background to light gray
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 15);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Helper function to create a shape with a fill
    const createShapeWithFill = (
      fillType: 'gradient/linear' | 'gradient/radial' | 'gradient/conical'
    ): { block: number; fill: number } => {
      const block = engine.block.create('graphic');
      const shape = engine.block.createShape('rect');
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

      // Create gradient fill
      const gradientFill = engine.block.createFill(fillType);

      // Apply the fill to the block
      engine.block.setFill(block, gradientFill);

      return { block, fill: gradientFill };
    };

    // =============================================================================
    // Example 1: Linear Gradient (Vertical)
    // =============================================================================
    const { block: linearVerticalBlock, fill: linearVertical } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(linearVertical, 'fill/gradient/colors', [
      { color: { r: 1.0, g: 0.8, b: 0.2, a: 1.0 }, stop: 0 },
      { color: { r: 0.3, g: 0.4, b: 0.7, a: 1.0 }, stop: 1 }
    ]);

    // Set vertical gradient (top to bottom)
    engine.block.setFloat(
      linearVertical,
      'fill/gradient/linear/startPointX',
      0.5
    );
    engine.block.setFloat(
      linearVertical,
      'fill/gradient/linear/startPointY',
      0
    );
    engine.block.setFloat(
      linearVertical,
      'fill/gradient/linear/endPointX',
      0.5
    );
    engine.block.setFloat(linearVertical, 'fill/gradient/linear/endPointY', 1);

    // =============================================================================
    // Example 2: Linear Gradient (Horizontal)
    // =============================================================================
    const { block: linearHorizontalBlock, fill: linearHorizontal } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      linearHorizontal,
      'fill/gradient/colors',
      [
        { color: { r: 0.8, g: 0.2, b: 0.4, a: 1.0 }, stop: 0 },
        { color: { r: 0.2, g: 0.8, b: 0.6, a: 1.0 }, stop: 1 }
      ]
    );

    // Set horizontal gradient (left to right)
    engine.block.setFloat(
      linearHorizontal,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      linearHorizontal,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(
      linearHorizontal,
      'fill/gradient/linear/endPointX',
      1
    );
    engine.block.setFloat(
      linearHorizontal,
      'fill/gradient/linear/endPointY',
      0.5
    );

    // =============================================================================
    // Example 3: Linear Gradient (Diagonal)
    // =============================================================================
    const { block: linearDiagonalBlock, fill: linearDiagonal } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(linearDiagonal, 'fill/gradient/colors', [
      { color: { r: 0.5, g: 0.2, b: 0.8, a: 1.0 }, stop: 0 },
      { color: { r: 0.9, g: 0.6, b: 0.2, a: 1.0 }, stop: 1 }
    ]);

    // Set diagonal gradient (top-left to bottom-right)
    engine.block.setFloat(
      linearDiagonal,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      linearDiagonal,
      'fill/gradient/linear/startPointY',
      0
    );
    engine.block.setFloat(linearDiagonal, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(linearDiagonal, 'fill/gradient/linear/endPointY', 1);

    // =============================================================================
    // Example 4: Multi-Stop Linear Gradient (Aurora Effect)
    // =============================================================================
    const { block: auroraGradientBlock, fill: auroraGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(auroraGradient, 'fill/gradient/colors', [
      { color: { r: 0.4, g: 0.1, b: 0.8, a: 1 }, stop: 0 },
      { color: { r: 0.8, g: 0.2, b: 0.6, a: 1 }, stop: 0.3 },
      { color: { r: 1.0, g: 0.5, b: 0.3, a: 1 }, stop: 0.6 },
      { color: { r: 1.0, g: 0.8, b: 0.2, a: 1 }, stop: 1 }
    ]);

    engine.block.setFloat(
      auroraGradient,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      auroraGradient,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(auroraGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(
      auroraGradient,
      'fill/gradient/linear/endPointY',
      0.5
    );

    // =============================================================================
    // Example 5: Radial Gradient (Centered)
    // =============================================================================
    const { block: radialCenteredBlock, fill: radialCentered } =
      createShapeWithFill('gradient/radial');

    engine.block.setGradientColorStops(radialCentered, 'fill/gradient/colors', [
      { color: { r: 1.0, g: 1.0, b: 1.0, a: 0.3 }, stop: 0 },
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 }, stop: 1 }
    ]);

    // Set center point (middle of block)
    engine.block.setFloat(
      radialCentered,
      'fill/gradient/radial/centerPointX',
      0.5
    );
    engine.block.setFloat(
      radialCentered,
      'fill/gradient/radial/centerPointY',
      0.5
    );
    engine.block.setFloat(radialCentered, 'fill/gradient/radial/radius', 0.8);

    // =============================================================================
    // Example 6: Radial Gradient (Top-Left Highlight)
    // =============================================================================
    const { block: radialHighlightBlock, fill: radialHighlight } =
      createShapeWithFill('gradient/radial');

    engine.block.setGradientColorStops(
      radialHighlight,
      'fill/gradient/colors',
      [
        { color: { r: 1.0, g: 1.0, b: 1.0, a: 0.3 }, stop: 0 },
        { color: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 }, stop: 1 }
      ]
    );

    // Set top-left highlight
    engine.block.setFloat(
      radialHighlight,
      'fill/gradient/radial/centerPointX',
      0
    );
    engine.block.setFloat(
      radialHighlight,
      'fill/gradient/radial/centerPointY',
      0
    );
    engine.block.setFloat(radialHighlight, 'fill/gradient/radial/radius', 1.0);

    // =============================================================================
    // Example 7: Radial Gradient (Vignette Effect)
    // =============================================================================
    const { block: radialVignetteBlock, fill: radialVignette } =
      createShapeWithFill('gradient/radial');

    engine.block.setGradientColorStops(radialVignette, 'fill/gradient/colors', [
      { color: { r: 0.9, g: 0.9, b: 0.9, a: 1.0 }, stop: 0 },
      { color: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 }, stop: 1 }
    ]);

    // Centered vignette
    engine.block.setFloat(
      radialVignette,
      'fill/gradient/radial/centerPointX',
      0.5
    );
    engine.block.setFloat(
      radialVignette,
      'fill/gradient/radial/centerPointY',
      0.5
    );
    engine.block.setFloat(radialVignette, 'fill/gradient/radial/radius', 0.6);

    // =============================================================================
    // Example 8: Conical Gradient (Color Wheel)
    // =============================================================================
    const { block: conicalColorWheelBlock, fill: conicalColorWheel } =
      createShapeWithFill('gradient/conical');

    engine.block.setGradientColorStops(
      conicalColorWheel,
      'fill/gradient/colors',
      [
        { color: { r: 1.0, g: 0.0, b: 0.0, a: 1 }, stop: 0 },
        { color: { r: 1.0, g: 1.0, b: 0.0, a: 1 }, stop: 0.25 },
        { color: { r: 0.0, g: 1.0, b: 0.0, a: 1 }, stop: 0.5 },
        { color: { r: 0.0, g: 0.0, b: 1.0, a: 1 }, stop: 0.75 },
        { color: { r: 1.0, g: 0.0, b: 0.0, a: 1 }, stop: 1 }
      ]
    );

    // Set center point (middle of block)
    engine.block.setFloat(
      conicalColorWheel,
      'fill/gradient/conical/centerPointX',
      0.5
    );
    engine.block.setFloat(
      conicalColorWheel,
      'fill/gradient/conical/centerPointY',
      0.5
    );

    // =============================================================================
    // Example 9: Conical Gradient (Loading Spinner)
    // =============================================================================
    const { block: conicalSpinnerBlock, fill: conicalSpinner } =
      createShapeWithFill('gradient/conical');

    engine.block.setGradientColorStops(conicalSpinner, 'fill/gradient/colors', [
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1 }, stop: 0 },
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 0 }, stop: 0.75 },
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1 }, stop: 1 }
    ]);

    engine.block.setFloat(
      conicalSpinner,
      'fill/gradient/conical/centerPointX',
      0.5
    );
    engine.block.setFloat(
      conicalSpinner,
      'fill/gradient/conical/centerPointY',
      0.5
    );

    // =============================================================================
    // Example 10: Gradient with CMYK Colors
    // =============================================================================
    const { block: cmykGradientBlock, fill: cmykGradient } =
      createShapeWithFill('gradient/linear');

    // CMYK color stops for print
    engine.block.setGradientColorStops(cmykGradient, 'fill/gradient/colors', [
      { color: { c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 1.0 }, stop: 0 },
      { color: { c: 1.0, m: 0.0, y: 1.0, k: 0.0, tint: 1.0 }, stop: 1 }
    ]);

    engine.block.setFloat(cmykGradient, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(
      cmykGradient,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(cmykGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(cmykGradient, 'fill/gradient/linear/endPointY', 0.5);

    // =============================================================================
    // Example 11: Gradient with Spot Colors
    // =============================================================================
    // First define spot colors
    engine.editor.setSpotColorRGB('BrandPrimary', 0.2, 0.4, 0.8);
    engine.editor.setSpotColorRGB('BrandSecondary', 1.0, 0.6, 0.0);

    const { block: spotGradientBlock, fill: spotGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(spotGradient, 'fill/gradient/colors', [
      {
        color: { name: 'BrandPrimary', tint: 1.0, externalReference: '' },
        stop: 0
      },
      {
        color: { name: 'BrandSecondary', tint: 1.0, externalReference: '' },
        stop: 1
      }
    ]);

    engine.block.setFloat(spotGradient, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(spotGradient, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(spotGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(spotGradient, 'fill/gradient/linear/endPointY', 1);

    // =============================================================================
    // Example 12: Transparency Overlay Gradient
    // =============================================================================
    const { block: overlayGradientBlock, fill: overlayGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      overlayGradient,
      'fill/gradient/colors',
      [
        { color: { r: 0.0, g: 0.0, b: 0.0, a: 0 }, stop: 0 },
        { color: { r: 0.0, g: 0.0, b: 0.0, a: 0.7 }, stop: 1 }
      ]
    );

    engine.block.setFloat(
      overlayGradient,
      'fill/gradient/linear/startPointX',
      0.5
    );
    engine.block.setFloat(
      overlayGradient,
      'fill/gradient/linear/startPointY',
      0
    );
    engine.block.setFloat(
      overlayGradient,
      'fill/gradient/linear/endPointX',
      0.5
    );
    engine.block.setFloat(overlayGradient, 'fill/gradient/linear/endPointY', 1);

    // =============================================================================
    // Example 13: Duotone Gradient
    // =============================================================================
    const { block: duotoneGradientBlock, fill: duotoneGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      duotoneGradient,
      'fill/gradient/colors',
      [
        { color: { r: 0.8, g: 0.2, b: 0.9, a: 1 }, stop: 0 },
        { color: { r: 0.2, g: 0.9, b: 0.8, a: 1 }, stop: 1 }
      ]
    );

    engine.block.setFloat(
      duotoneGradient,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      duotoneGradient,
      'fill/gradient/linear/startPointY',
      0
    );
    engine.block.setFloat(duotoneGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(duotoneGradient, 'fill/gradient/linear/endPointY', 1);

    // =============================================================================
    // Example 14: Shared Gradient Fill
    // =============================================================================
    const block1 = engine.block.create('graphic');
    const shape1 = engine.block.createShape('rect');
    engine.block.setShape(block1, shape1);
    engine.block.setWidth(block1, blockWidth);
    engine.block.setHeight(block1, blockHeight / 2 - 5);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    const shape2 = engine.block.createShape('rect');
    engine.block.setShape(block2, shape2);
    engine.block.setWidth(block2, blockWidth);
    engine.block.setHeight(block2, blockHeight / 2 - 5);
    engine.block.appendChild(page, block2);

    // Create one gradient fill
    const sharedGradient = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(sharedGradient, 'fill/gradient/colors', [
      { color: { r: 1, g: 0, b: 0, a: 1 }, stop: 0 },
      { color: { r: 0, g: 0, b: 1, a: 1 }, stop: 1 }
    ]);

    engine.block.setFloat(
      sharedGradient,
      'fill/gradient/linear/startPointX',
      0
    );
    engine.block.setFloat(
      sharedGradient,
      'fill/gradient/linear/startPointY',
      0.5
    );
    engine.block.setFloat(sharedGradient, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(
      sharedGradient,
      'fill/gradient/linear/endPointY',
      0.5
    );

    // Apply to both blocks
    engine.block.setFill(block1, sharedGradient);
    engine.block.setFill(block2, sharedGradient);

    // Change gradient after a delay to show it affects both
    setTimeout(() => {
      engine.block.setGradientColorStops(
        sharedGradient,
        'fill/gradient/colors',
        [
          { color: { r: 0, g: 1, b: 0, a: 1 }, stop: 0 },
          { color: { r: 1, g: 1, b: 0, a: 1 }, stop: 1 }
        ]
      );
    }, 2000);

    // =============================================================================
    // Example 15: Get Gradient Properties
    // =============================================================================
    const { block: inspectGradientBlock, fill: inspectGradient } =
      createShapeWithFill('gradient/linear');

    engine.block.setGradientColorStops(
      inspectGradient,
      'fill/gradient/colors',
      [
        { color: { r: 0.6, g: 0.3, b: 0.7, a: 1.0 }, stop: 0 },
        { color: { r: 0.3, g: 0.7, b: 0.6, a: 1.0 }, stop: 1 }
      ]
    );

    // Get current fill from block
    const fillId = engine.block.getFill(block1);
    const fillType = engine.block.getType(fillId);
    // eslint-disable-next-line no-console
    console.log('Fill type:', fillType); // '//ly.img.ubq/fill/gradient/linear'

    // Get gradient color stops
    const colorStops = engine.block.getGradientColorStops(
      inspectGradient,
      'fill/gradient/colors'
    );
    // eslint-disable-next-line no-console
    console.log('Color stops:', colorStops);

    // Get linear gradient position
    const startX = engine.block.getFloat(
      inspectGradient,
      'fill/gradient/linear/startPointX'
    );
    const startY = engine.block.getFloat(
      inspectGradient,
      'fill/gradient/linear/startPointY'
    );
    const endX = engine.block.getFloat(
      inspectGradient,
      'fill/gradient/linear/endPointX'
    );
    const endY = engine.block.getFloat(
      inspectGradient,
      'fill/gradient/linear/endPointY'
    );
    // eslint-disable-next-line no-console
    console.log('Linear gradient position:', { startX, startY, endX, endY });

    // ===== Position all blocks in grid layout =====
    const blocks = [
      linearVerticalBlock, // Position 0
      linearHorizontalBlock, // Position 1
      linearDiagonalBlock, // Position 2
      auroraGradientBlock, // Position 3
      radialCenteredBlock, // Position 4
      radialHighlightBlock, // Position 5
      radialVignetteBlock, // Position 6
      conicalColorWheelBlock, // Position 7
      conicalSpinnerBlock, // Position 8
      cmykGradientBlock, // Position 9
      spotGradientBlock, // Position 10
      overlayGradientBlock, // Position 11
      duotoneGradientBlock, // Position 12
      block1, // Position 13 (top half)
      inspectGradientBlock // Position 14
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Position block2 below block1 in the same grid cell
    const block1Pos = getPosition(13);
    engine.block.setPositionX(block2, block1Pos.x);
    engine.block.setPositionY(block2, block1Pos.y + blockHeight / 2 + 5);

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
