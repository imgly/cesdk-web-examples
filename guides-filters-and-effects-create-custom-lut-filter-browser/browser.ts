import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Create Custom LUT Filter Guide
 *
 * Demonstrates applying custom LUT filters directly using the effect API:
 * - Creating a lut_filter effect
 * - Configuring the LUT file URI and tile dimensions
 * - Setting filter intensity
 * - Toggling the effect on and off
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load default assets
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    const pageWidth = 800;
    const pageHeight = 600;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Create a gradient background for the page
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.15, g: 0.1, b: 0.25, a: 1 }, stop: 0 },
      { color: { r: 0.3, g: 0.15, b: 0.4, a: 1 }, stop: 0.5 },
      { color: { r: 0.2, g: 0.1, b: 0.35, a: 1 }, stop: 1 }
    ]);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, gradientFill);

    // Create a centered title text
    const titleText = engine.block.create('text');
    engine.block.setString(titleText, 'text/text', 'Custom LUT Filter');
    engine.block.setEnum(titleText, 'text/horizontalAlignment', 'Center');
    engine.block.setTextFontSize(titleText, 96);
    engine.block.setTextColor(titleText, { r: 1, g: 1, b: 1, a: 1 });
    engine.block.setWidthMode(titleText, 'Auto');
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.appendChild(page, titleText);

    // Create a subtext below the title
    const subText = engine.block.create('text');
    engine.block.setString(subText, 'text/text', 'img.ly');
    engine.block.setEnum(subText, 'text/horizontalAlignment', 'Center');
    engine.block.setTextFontSize(subText, 64);
    engine.block.setTextColor(subText, { r: 0.8, g: 0.8, b: 0.8, a: 1 });
    engine.block.setWidthMode(subText, 'Auto');
    engine.block.setHeightMode(subText, 'Auto');
    engine.block.appendChild(page, subText);

    // Get text dimensions for centering calculations
    const titleWidth = engine.block.getFrameWidth(titleText);
    const titleHeight = engine.block.getFrameHeight(titleText);
    const subTextWidth = engine.block.getFrameWidth(subText);
    const subTextHeight = engine.block.getFrameHeight(subText);

    // Image dimensions (smaller)
    const imageWidth = 200;
    const imageHeight = 150;

    // Calculate total content height and vertical centering
    const textGap = 8;
    const imagePadding = 60;
    const totalContentHeight =
      titleHeight + textGap + subTextHeight + imagePadding + imageHeight;
    const startY = (pageHeight - totalContentHeight) / 2;

    // Position title centered
    engine.block.setPositionX(titleText, (pageWidth - titleWidth) / 2);
    engine.block.setPositionY(titleText, startY);

    // Position subtext below title
    engine.block.setPositionX(subText, (pageWidth - subTextWidth) / 2);
    engine.block.setPositionY(subText, startY + titleHeight + textGap);

    // Add an image block to apply the LUT filter
    const imageY = startY + titleHeight + textGap + subTextHeight + imagePadding;
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri, {
      x: (pageWidth - imageWidth) / 2,
      y: imageY,
      size: { width: imageWidth, height: imageHeight }
    });
    engine.block.appendChild(page, imageBlock);

    // Create a LUT filter effect
    const lutEffect = engine.block.createEffect('//ly.img.ubq/effect/lut_filter');

    // Configure the LUT file URI - this is a tiled PNG containing the color lookup table
    const lutUrl =
      'https://cdn.img.ly/packages/imgly/cesdk-js/1.67.0-rc.1/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png';
    engine.block.setString(lutEffect, 'effect/lut_filter/lutFileURI', lutUrl);

    // Set the tile grid dimensions - must match the LUT image structure
    engine.block.setInt(lutEffect, 'effect/lut_filter/horizontalTileCount', 5);
    engine.block.setInt(lutEffect, 'effect/lut_filter/verticalTileCount', 5);

    // Set filter intensity (0.0 = no effect, 1.0 = full effect)
    engine.block.setFloat(lutEffect, 'effect/lut_filter/intensity', 0.8);

    // Apply the effect to the image block
    engine.block.appendEffect(imageBlock, lutEffect);

    // Register a custom button component to toggle the LUT filter
    cesdk.ui.registerComponent('lut.toggle', ({ builder }) => {
      const isEnabled = engine.block.isEffectEnabled(lutEffect);
      builder.Button('toggle-lut', {
        label: 'LUT Filter',
        icon: isEnabled ? '@imgly/ToggleIconOn' : '@imgly/ToggleIconOff',
        isActive: isEnabled,
        onClick: () => {
          engine.block.setEffectEnabled(lutEffect, !isEnabled);
        }
      });
    });

    // Add the toggle button to the navigation bar
    cesdk.ui.insertNavigationBarOrderComponent('last', 'lut.toggle');

    // Retrieve all effects on the block
    const effects = engine.block.getEffects(imageBlock);
    // eslint-disable-next-line no-console
    console.log('Number of effects:', effects.length); // 1

    // Check if block supports effects
    const supportsEffects = engine.block.supportsEffects(imageBlock);
    // eslint-disable-next-line no-console
    console.log('Supports effects:', supportsEffects); // true

    // Select the image to show it in the editor
    engine.block.select(imageBlock);

    // eslint-disable-next-line no-console
    console.log('Custom LUT filter applied successfully.');
  }
}

export default Example;
