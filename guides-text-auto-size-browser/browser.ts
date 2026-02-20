import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Text Auto-Size Guide
 *
 * Demonstrates text auto-sizing capabilities:
 * - Auto width and height modes for content-fitting text
 * - Fixed dimensions with automatic font sizing
 * - Font size constraints (min/max)
 * - Detecting clipped text
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];


    // Create text with Auto width and height - grows to fit content
    const autoText = engine.block.create('text');
    engine.block.appendChild(page, autoText);
    engine.block.setWidthMode(autoText, 'Auto');
    engine.block.setHeightMode(autoText, 'Auto');
    engine.block.replaceText(autoText, 'Auto-sized text');
    engine.block.setFloat(autoText, 'text/fontSize', 48);
    engine.block.setPositionX(autoText, 50);
    engine.block.setPositionY(autoText, 50);

    // Create text with fixed width and auto height - wraps and grows vertically
    const wrappedText = engine.block.create('text');
    engine.block.appendChild(page, wrappedText);
    engine.block.setWidthMode(wrappedText, 'Absolute');
    engine.block.setWidth(wrappedText, 250);
    engine.block.setHeightMode(wrappedText, 'Auto');
    engine.block.replaceText(
      wrappedText,
      'This text has a fixed width but auto height, so it wraps to multiple lines'
    );
    engine.block.setFloat(wrappedText, 'text/fontSize', 48);
    engine.block.setPositionX(wrappedText, 50);
    engine.block.setPositionY(wrappedText, 150);

    // Create text with automatic font sizing - scales to fit fixed dimensions
    const scaledText = engine.block.create('text');
    engine.block.appendChild(page, scaledText);
    engine.block.setWidthMode(scaledText, 'Absolute');
    engine.block.setHeightMode(scaledText, 'Absolute');
    engine.block.setWidth(scaledText, 300);
    engine.block.setHeight(scaledText, 80);
    engine.block.setBool(scaledText, 'text/automaticFontSizeEnabled', true);
    engine.block.replaceText(scaledText, 'Auto-scaled font');
    engine.block.setPositionX(scaledText, 50);
    engine.block.setPositionY(scaledText, 350);

    // Add background to visualize the text frame
    engine.block.setBool(scaledText, 'backgroundColor/enabled', true);
    engine.block.setColor(scaledText, 'backgroundColor/color', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Create text with font size constraints
    // Note: Constraints only affect automatic sizing, not manual UI changes
    const constrainedText = engine.block.create('text');
    engine.block.appendChild(page, constrainedText);
    engine.block.setWidthMode(constrainedText, 'Absolute');
    engine.block.setHeightMode(constrainedText, 'Absolute');
    engine.block.setWidth(constrainedText, 300);
    engine.block.setHeight(constrainedText, 80);
    engine.block.setBool(
      constrainedText,
      'text/automaticFontSizeEnabled',
      true
    );

    // Set min and max font size constraints for automatic sizing
    engine.block.setFloat(constrainedText, 'text/minAutomaticFontSize', 12);
    engine.block.setFloat(constrainedText, 'text/maxAutomaticFontSize', 48);

    // Use longer text to demonstrate automatic scaling within constraints
    engine.block.replaceText(
      constrainedText,
      'Edit this text to see automatic font scaling (12-48pt range)'
    );
    engine.block.setPositionX(constrainedText, 50);
    engine.block.setPositionY(constrainedText, 460);

    // Add background to visualize the text frame
    engine.block.setBool(constrainedText, 'backgroundColor/enabled', true);
    engine.block.setColor(constrainedText, 'backgroundColor/color', {
      r: 0.9,
      g: 0.95,
      b: 1.0,
      a: 1.0
    });

    // Query the size modes and automatic font size state
    const widthMode = engine.block.getWidthMode(autoText);
    const heightMode = engine.block.getHeightMode(autoText);
    const isAutoFontSize = engine.block.getBool(
      scaledText,
      'text/automaticFontSizeEnabled'
    );

    console.log('Auto text width mode:', widthMode);
    console.log('Auto text height mode:', heightMode);
    console.log('Scaled text has automatic font sizing:', isAutoFontSize);

    // Check for clipped lines (text exceeding frame bounds)
    const hasClippedLines = engine.block.getBool(
      scaledText,
      'text/hasClippedLines'
    );
    console.log('Scaled text has clipped lines:', hasClippedLines);

    // Add labels for each example
    const createLabel = (text: string, x: number, y: number) => {
      const label = engine.block.create('text');
      engine.block.appendChild(page, label);
      engine.block.setWidthMode(label, 'Auto');
      engine.block.setHeightMode(label, 'Auto');
      engine.block.replaceText(label, text);
      engine.block.setFloat(label, 'text/fontSize', 32);
      engine.block.setTextColor(label, { r: 0.5, g: 0.5, b: 0.5, a: 1.0 });
      engine.block.setPositionX(label, x);
      engine.block.setPositionY(label, y);
    };

    createLabel('Auto Width + Auto Height', 50, 20);
    createLabel('Fixed Width + Auto Height', 50, 120);
    createLabel('Automatic Font Sizing', 50, 320);
    createLabel('With Min/Max Constraints', 50, 430);

    // Select the first text block to show it in the inspector
    engine.block.select(autoText);
  }
}

export default Example;
