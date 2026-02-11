import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable spot color feature for the UI
    cesdk.feature.enable('ly.img.spotColor');

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

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Calculate block sizes for three columns
    const margin = 40;
    const spacing = 30;
    const availableWidth = pageWidth - 2 * margin - 2 * spacing;
    const blockWidth = availableWidth / 3;
    const blockHeight = pageHeight - 2 * margin - 80; // Leave space for labels

    // Define a spot color with RGB approximation for screen preview
    engine.editor.setSpotColorRGB('MyBrand Red', 0.95, 0.25, 0.21);

    // Create three blocks to demonstrate each color space

    // Block 1: sRGB color (for screen display)
    const srgbBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      srgbBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const srgbFill = engine.block.createFill('//ly.img.ubq/fill/color');
    // Set fill color using RGBAColor object (values 0.0-1.0)
    engine.block.setColor(srgbFill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1.0
    });
    engine.block.setFill(srgbBlock, srgbFill);
    engine.block.setWidth(srgbBlock, blockWidth);
    engine.block.setHeight(srgbBlock, blockHeight);
    engine.block.appendChild(page, srgbBlock);

    // Block 2: CMYK color (for print workflows)
    const cmykBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      cmykBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const cmykFill = engine.block.createFill('//ly.img.ubq/fill/color');
    // Set fill color using CMYKColor object (values 0.0-1.0, tint controls opacity)
    engine.block.setColor(cmykFill, 'fill/color/value', {
      c: 0.0,
      m: 0.8,
      y: 0.95,
      k: 0.0,
      tint: 1.0
    });
    engine.block.setFill(cmykBlock, cmykFill);
    engine.block.setWidth(cmykBlock, blockWidth);
    engine.block.setHeight(cmykBlock, blockHeight);
    engine.block.appendChild(page, cmykBlock);

    // Block 3: Spot color (for specialized printing)
    const spotBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      spotBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const spotFill = engine.block.createFill('//ly.img.ubq/fill/color');
    // Set fill color using SpotColor object (references the defined spot color)
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'MyBrand Red',
      tint: 1.0,
      externalReference: ''
    });
    engine.block.setFill(spotBlock, spotFill);
    engine.block.setWidth(spotBlock, blockWidth);
    engine.block.setHeight(spotBlock, blockHeight);
    engine.block.appendChild(page, spotBlock);

    // Add strokes to demonstrate stroke color property
    engine.block.setStrokeEnabled(srgbBlock, true);
    engine.block.setStrokeWidth(srgbBlock, 4);
    engine.block.setColor(srgbBlock, 'stroke/color', {
      r: 0.1,
      g: 0.2,
      b: 0.5,
      a: 1.0
    });

    engine.block.setStrokeEnabled(cmykBlock, true);
    engine.block.setStrokeWidth(cmykBlock, 4);
    engine.block.setColor(cmykBlock, 'stroke/color', {
      c: 0.0,
      m: 0.5,
      y: 0.6,
      k: 0.2,
      tint: 1.0
    });

    engine.block.setStrokeEnabled(spotBlock, true);
    engine.block.setStrokeWidth(spotBlock, 4);
    engine.block.setColor(spotBlock, 'stroke/color', {
      name: 'MyBrand Red',
      tint: 0.7,
      externalReference: ''
    });

    // Create labels for each color space
    const labelY = margin + blockHeight + 20;
    const fontSize = 24;

    const labels = [
      { text: 'sRGB', x: margin + blockWidth / 2 },
      { text: 'CMYK', x: margin + blockWidth + spacing + blockWidth / 2 },
      {
        text: 'Spot Color',
        x: margin + 2 * (blockWidth + spacing) + blockWidth / 2
      }
    ];

    for (const label of labels) {
      const textBlock = engine.block.create('//ly.img.ubq/text');
      engine.block.replaceText(textBlock, label.text);
      engine.block.setTextFontSize(textBlock, fontSize);
      engine.block.setWidthMode(textBlock, 'Auto');
      engine.block.setHeightMode(textBlock, 'Auto');
      engine.block.appendChild(page, textBlock);

      // Center the label below each block
      const textWidth = engine.block.getWidth(textBlock);
      engine.block.setPositionX(textBlock, label.x - textWidth / 2);
      engine.block.setPositionY(textBlock, labelY);
    }

    // Position all color blocks
    engine.block.setPositionX(srgbBlock, margin);
    engine.block.setPositionY(srgbBlock, margin);

    engine.block.setPositionX(cmykBlock, margin + blockWidth + spacing);
    engine.block.setPositionY(cmykBlock, margin);

    engine.block.setPositionX(spotBlock, margin + 2 * (blockWidth + spacing));
    engine.block.setPositionY(spotBlock, margin);

    // Retrieve and log color values to demonstrate getColor()
    const srgbColor = engine.block.getColor(srgbFill, 'fill/color/value');
    const cmykColor = engine.block.getColor(cmykFill, 'fill/color/value');
    const spotColor = engine.block.getColor(spotFill, 'fill/color/value');

    console.log('sRGB Color:', srgbColor);
    console.log('CMYK Color:', cmykColor);
    console.log('Spot Color:', spotColor);

    console.log('Color Basics example loaded successfully');
  }
}

export default Example;
