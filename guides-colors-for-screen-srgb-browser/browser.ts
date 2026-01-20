import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import { isRGBAColor } from '@cesdk/engine';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: sRGB Colors Guide
 *
 * This example demonstrates:
 * - Creating sRGB/RGBA colors
 * - Applying sRGB colors to fills, strokes, and shadows
 * - Retrieving colors from design elements
 * - Converting colors to sRGB
 * - Working with alpha transparency
 * - Using type guards to identify RGBA colors
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Create a design scene using CE.SDK
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

    // Create RGBA color objects for sRGB color space
    // Values are floating-point numbers between 0.0 and 1.0
    const blueColor = { r: 0.2, g: 0.4, b: 0.9, a: 1.0 };
    const redColor = { r: 0.9, g: 0.2, b: 0.2, a: 1.0 };
    const greenColor = { r: 0.2, g: 0.8, b: 0.3, a: 1.0 };

    // Create semi-transparent colors using the alpha channel
    // Alpha of 0.5 means 50% opacity
    const semiTransparentPurple = { r: 0.6, g: 0.2, b: 0.8, a: 0.5 };
    const semiTransparentOrange = { r: 1.0, g: 0.5, b: 0.0, a: 0.7 };

    // Create blocks to demonstrate color application
    const block1 = engine.block.create('graphic');
    engine.block.setShape(block1, engine.block.createShape('rect'));
    engine.block.setWidth(block1, 150);
    engine.block.setHeight(block1, 150);
    engine.block.setPositionX(block1, 50);
    engine.block.setPositionY(block1, 50);
    engine.block.appendChild(page, block1);

    const block2 = engine.block.create('graphic');
    engine.block.setShape(block2, engine.block.createShape('ellipse'));
    engine.block.setWidth(block2, 150);
    engine.block.setHeight(block2, 150);
    engine.block.setPositionX(block2, 250);
    engine.block.setPositionY(block2, 50);
    engine.block.appendChild(page, block2);

    const block3 = engine.block.create('graphic');
    engine.block.setShape(block3, engine.block.createShape('rect'));
    engine.block.setWidth(block3, 150);
    engine.block.setHeight(block3, 150);
    engine.block.setPositionX(block3, 450);
    engine.block.setPositionY(block3, 50);
    engine.block.appendChild(page, block3);

    // Apply sRGB colors to block fills
    // First create a color fill, then set its color value
    const fill1 = engine.block.createFill('color');
    engine.block.setFill(block1, fill1);
    engine.block.setColor(fill1, 'fill/color/value', blueColor);

    const fill2 = engine.block.createFill('color');
    engine.block.setFill(block2, fill2);
    engine.block.setColor(fill2, 'fill/color/value', redColor);

    const fill3 = engine.block.createFill('color');
    engine.block.setFill(block3, fill3);
    engine.block.setColor(fill3, 'fill/color/value', greenColor);

    // Create blocks for stroke demonstration
    const strokeBlock = engine.block.create('graphic');
    engine.block.setShape(strokeBlock, engine.block.createShape('rect'));
    engine.block.setWidth(strokeBlock, 150);
    engine.block.setHeight(strokeBlock, 150);
    engine.block.setPositionX(strokeBlock, 50);
    engine.block.setPositionY(strokeBlock, 250);
    engine.block.appendChild(page, strokeBlock);

    const strokeFill = engine.block.createFill('color');
    engine.block.setFill(strokeBlock, strokeFill);
    engine.block.setColor(strokeFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Apply sRGB color to stroke
    engine.block.setStrokeEnabled(strokeBlock, true);
    engine.block.setStrokeWidth(strokeBlock, 5);
    engine.block.setColor(strokeBlock, 'stroke/color', {
      r: 0.1,
      g: 0.1,
      b: 0.5,
      a: 1.0
    });

    // Create block for drop shadow demonstration
    const shadowBlock = engine.block.create('graphic');
    engine.block.setShape(shadowBlock, engine.block.createShape('rect'));
    engine.block.setWidth(shadowBlock, 150);
    engine.block.setHeight(shadowBlock, 150);
    engine.block.setPositionX(shadowBlock, 250);
    engine.block.setPositionY(shadowBlock, 250);
    engine.block.appendChild(page, shadowBlock);

    const shadowFill = engine.block.createFill('color');
    engine.block.setFill(shadowBlock, shadowFill);
    engine.block.setColor(shadowFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Apply sRGB color to drop shadow
    engine.block.setDropShadowEnabled(shadowBlock, true);
    engine.block.setDropShadowBlurRadiusX(shadowBlock, 10);
    engine.block.setDropShadowBlurRadiusY(shadowBlock, 10);
    engine.block.setDropShadowOffsetX(shadowBlock, 5);
    engine.block.setDropShadowOffsetY(shadowBlock, 5);
    engine.block.setColor(shadowBlock, 'dropShadow/color', {
      r: 0.0,
      g: 0.0,
      b: 0.0,
      a: 0.4
    });

    // Create blocks for transparency demonstration
    const transparentBlock1 = engine.block.create('graphic');
    engine.block.setShape(transparentBlock1, engine.block.createShape('rect'));
    engine.block.setWidth(transparentBlock1, 150);
    engine.block.setHeight(transparentBlock1, 150);
    engine.block.setPositionX(transparentBlock1, 450);
    engine.block.setPositionY(transparentBlock1, 250);
    engine.block.appendChild(page, transparentBlock1);

    const transparentFill1 = engine.block.createFill('color');
    engine.block.setFill(transparentBlock1, transparentFill1);
    engine.block.setColor(
      transparentFill1,
      'fill/color/value',
      semiTransparentPurple
    );

    // Overlapping block to show transparency
    const transparentBlock2 = engine.block.create('graphic');
    engine.block.setShape(
      transparentBlock2,
      engine.block.createShape('ellipse')
    );
    engine.block.setWidth(transparentBlock2, 150);
    engine.block.setHeight(transparentBlock2, 150);
    engine.block.setPositionX(transparentBlock2, 500);
    engine.block.setPositionY(transparentBlock2, 300);
    engine.block.appendChild(page, transparentBlock2);

    const transparentFill2 = engine.block.createFill('color');
    engine.block.setFill(transparentBlock2, transparentFill2);
    engine.block.setColor(
      transparentFill2,
      'fill/color/value',
      semiTransparentOrange
    );

    // Retrieve the current color from a design element
    const currentColor = engine.block.getColor(fill1, 'fill/color/value');
    console.log('Current color:', currentColor);

    // Use type guard to check if color is RGBA (sRGB)
    if (isRGBAColor(currentColor)) {
      console.log('Color is sRGB/RGBA');
      console.log('Red:', currentColor.r);
      console.log('Green:', currentColor.g);
      console.log('Blue:', currentColor.b);
      console.log('Alpha:', currentColor.a);
    }

    // Convert a CMYK color to sRGB
    const cmykColor = { c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 1.0 };
    const convertedToSrgb = engine.editor.convertColorToColorSpace(
      cmykColor,
      'sRGB'
    );
    console.log('Converted to sRGB:', convertedToSrgb);

    // Zoom to fit content
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
