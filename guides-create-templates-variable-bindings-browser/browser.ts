import type {
  EditorPlugin,
  EditorPluginContext,
  Typeface
} from '@cesdk/cesdk-js';
import { isEngineError } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
 * CE.SDK Plugin: Variable Bindings Guide
 *
 * Demonstrates typed variables and variable bindings:
 * - Color, number, image and typeface variables
 * - Binding block properties to variables
 * - Changing a variable to update every bound property
 * - Reading and removing bindings
 * - Renaming variables and the name rules
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
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
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
    const page = engine.block.findByType('page')[0]!;

    // One variable per type. A setter creates the variable when the key is new.
    const roboto: Typeface = {
      name: 'Roboto',
      fonts: [
        {
          uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf',
          subFamily: 'Regular',
          weight: 'normal',
          style: 'normal'
        }
      ]
    };
    engine.variable.setColor('accent', { r: 0.48, g: 0.23, b: 0.93, a: 1 });
    engine.variable.setNumber('cornerRadius', 40);
    engine.variable.setImage(
      'heroImage',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.variable.setTypeface('headline', roboto);
    engine.variable.setString('title', 'Summer Sale');

    console.log(engine.variable.getType('accent')); // 'Color'
    console.log(engine.variable.getNumber('cornerRadius')); // 40
    console.log(engine.variable.findAllOfType('Color')); // ['accent']
    // findAll() lists text variables only
    console.log(engine.variable.findAll()); // ['title']

    // A card with a color fill and a rect shape
    const card = engine.block.create('graphic');
    engine.block.setShape(card, engine.block.createShape('rect'));
    engine.block.setFill(card, engine.block.createFill('color'));
    engine.block.setWidth(card, 720);
    engine.block.setHeight(card, 520);
    engine.block.setPositionX(card, 40);
    engine.block.setPositionY(card, 40);
    engine.block.appendChild(page, card);
    const cardFill = engine.block.getFill(card);
    const cardShape = engine.block.getShape(card);

    // An image with an image fill
    const image = engine.block.create('graphic');
    engine.block.setShape(image, engine.block.createShape('rect'));
    const imageFill = engine.block.createFill('image');
    engine.block.setFill(image, imageFill);
    engine.block.setWidth(image, 640);
    engine.block.setHeight(image, 300);
    engine.block.setPositionX(image, 80);
    engine.block.setPositionY(image, 80);
    engine.block.appendChild(page, image);

    // A headline that shows the text variable
    const text = engine.block.create('text');
    engine.block.replaceText(text, '{{title}}');
    engine.block.setWidth(text, 640);
    engine.block.setHeightMode(text, 'Auto');
    engine.block.setPositionX(text, 80);
    engine.block.setPositionY(text, 420);
    engine.block.appendChild(page, text);

    // Each binding applies the current value of the variable at once
    engine.block.setVariableBinding(cardFill, 'fill/color/value', 'accent');
    for (const corner of ['TL', 'TR', 'BL', 'BR']) {
      engine.block.setVariableBinding(
        cardShape,
        `shape/rect/cornerRadius${corner}`,
        'cornerRadius'
      );
    }
    engine.block.setVariableBinding(
      imageFill,
      'fill/image/imageFileURI',
      'heroImage'
    );
    engine.block.setVariableBinding(text, 'text/typeface', 'headline');

    // Every bound property follows the new values
    engine.variable.setColor('accent', { r: 0.05, g: 0.55, b: 0.55, a: 1 });
    engine.variable.setNumber('cornerRadius', 24);
    engine.variable.setImage(
      'heroImage',
      'https://img.ly/static/ubq_samples/sample_2.jpg'
    );
    console.log(engine.block.getColor(cardFill, 'fill/color/value'));
    // { r: 0.05, g: 0.55, b: 0.55, a: 1 }

    console.log(engine.block.getVariableBinding(cardFill, 'fill/color/value')); // 'accent'
    console.log(engine.block.getVariableBinding(card, 'opacity')); // null
    console.log(engine.block.findAllVariableBindings(cardShape));
    // The four corner radius properties of the shape

    // A bound property changes only through its variable
    try {
      engine.block.setColor(cardFill, 'fill/color/value', {
        r: 1,
        g: 0,
        b: 0,
        a: 1
      });
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.PROPERTY_BOUND'
      }
    }

    // The bottom corners keep their current radius and stop following
    engine.block.removeVariableBinding(cardShape, 'shape/rect/cornerRadiusBL');
    engine.block.removeVariableBinding(cardShape, 'shape/rect/cornerRadiusBR');
    engine.variable.setNumber('cornerRadius', 60);
    console.log(engine.block.getFloat(cardShape, 'shape/rect/cornerRadiusBL')); // 24
    console.log(engine.block.getFloat(cardShape, 'shape/rect/cornerRadiusTL')); // 60

    // Bindings and {{tokens}} in text follow the new name
    engine.variable.rename('accent', 'brand/accent');
    engine.variable.rename('title', 'campaign/title');
    console.log(engine.block.getVariableBinding(cardFill, 'fill/color/value')); // 'brand/accent'
    console.log(engine.block.getString(text, 'text/text')); // '{{campaign/title}}'

    for (const name of ['', ' padded', 'a{{b', 'campaign/title']) {
      try {
        engine.variable.rename('brand/accent', name);
      } catch (error) {
        if (isEngineError(error)) {
          // 'BLOCK.VARIABLE_NAME_INVALID' for the first three names,
          // 'BLOCK.VARIABLE_NAME_TAKEN' for the name of another variable
          console.log(error.code);
        }
      }
    }

    try {
      // A color variable has no number value
      engine.variable.getNumber('brand/accent');
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.VARIABLE_TYPE_MISMATCH'
      }
    }
    try {
      // Opacity is a number property, so it cannot bind to a color variable
      engine.block.setVariableBinding(card, 'opacity', 'brand/accent');
    } catch (error) {
      if (isEngineError(error)) {
        console.log(error.code); // 'BLOCK.VARIABLE_BINDING_UNSUPPORTED'
      }
    }
  }
}

export default Example;
