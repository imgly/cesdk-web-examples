// highlight-setup
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0/cesdk-engine.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-setup
  const scene = engine.scene.create();
  const camera = engine.block.findByType('camera')[0];
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  const star = engine.block.create('shapes/star');
  engine.block.appendChild(page, star);
  const text = engine.block.create('text');
  engine.block.appendChild(page, text);
  const image = engine.block.create('image');

  // Reflection

  // highlight-findAll
  const propertyNames = engine.property.findAll(star);

  // highlight-getType
  const pointsType = engine.property.getType('shapes/star/points'); // "Int"

  // highlight-getEnumValues
  engine.property.getEnumValues('text/horizontalAlignment');

  // Generic Properties

  // highlight-setBool
  engine.property.setBool(scene, 'scene/aspectRatioLock', false);
  // highlight-getBool
  engine.property.getBool(scene, 'scene/aspectRatioLock');
  // highlight-getInt
  const points = engine.property.getInt(star, 'shapes/star/points');
  // highlight-setInt
  engine.property.setInt(star, 'shapes/star/points', points + 2);
  // highlight-setFloat
  engine.property.setFloat(star, 'shapes/star/innerDiameter', 0.75);
  // highlight-getFloat
  engine.property.getFloat(star, 'shapes/star/innerDiameter');
  // highlight-setString
  engine.property.setString(text, 'text/text', '*o*');
  // highlight-getString
  engine.property.getString(text, 'text/text');
  // highlight-setColorRGBA
  engine.property.setColorRGBA(camera, 'camera/clearColor', 1, 1, 1, 1); // White
  // highlight-getColorRGBA
  engine.property.getColorRGBA(camera, 'camera/clearColor');
  // highlight-setEnum
  engine.property.setEnum(text, 'text/horizontalAlignment', 'Center');
  engine.property.setEnum(text, 'text/verticalAlignment', 'Center');
  // highlight-setEnum
  // highlight-getEnum
  engine.property.getEnum(text, 'text/horizontalAlignment');

  // Common Properties

  // highlight-hasCrop
  engine.property.hasCrop(image);
  // highlight-setCropScaleX
  engine.property.setCropScaleX(image, 2.0);
  // highlight-setCropScaleY
  engine.property.setCropScaleY(image, 1.5);
  // highlight-setCropRotation
  engine.property.setCropRotation(image, Math.PI);
  // highlight-setCropTranslationX
  engine.property.setCropTranslationX(image, -1.0);
  // highlight-setCropTranslationY
  engine.property.setCropTranslationY(image, 1.0);
  // highlight-resetCrop
  engine.property.resetCrop(image);
  // highlight-getCropScaleX
  engine.property.getCropScaleX(image);
  // highlight-getCropScaleY
  engine.property.getCropScaleY(image);
  // highlight-getCropRotation
  engine.property.getCropRotation(image);
  // highlight-getCropTranslationX
  engine.property.getCropTranslationX(image);
  // highlight-getCropTranslationY
  engine.property.getCropTranslationY(image);

  // highlight-hasOpacity
  engine.property.hasOpacity(image);
  // highlight-setOpacity
  engine.property.setOpacity(image, 0.5);
  // highlight-getOpacity
  engine.property.getOpacity(image, 0.5);

  // highlight-hasFillColor
  if (engine.property.hasFillColor(star)) {
    // highlight-setFillColorRGBA
    engine.property.setFillColorRGBA(star, 1, 1, 0, 1); // Yellow
    // highlight-getFillColorRGBA
    engine.property.getFillColorRGBA(star);
    // highlight-setFillColorEnabled
    engine.property.setFillColorEnabled(star, true);
    // highlight-isFillColorEnabled
    engine.property.isFillColorEnabled(star);
  }

  // highlight-hasBackgroundColor
  if (engine.property.hasBackgroundColor(page)) {
    // highlight-setBackgroundColorRGBA
    engine.property.setBackgroundColorRGBA(page, 1, 0, 0, 1); // Red
    // highlight-getBackgroundColorRGBA
    engine.property.getBackgroundColorRGBA(page);
    // highlight-setBackgroundColorEnabled
    engine.property.setBackgroundColorEnabled(page, true);
    // highlight-isBackgroundColorEnabled
    engine.property.isBackgroundColorEnabled(page);
  }

  // highlight-hasOutline
  if (engine.property.hasOutline(star)) {
    // highlight-setOutlineColorRGBA
    engine.property.setOutlineColorRGBA(star, 1, 0.5, 0, 1); // Orange
    // highlight-getOutlineColorRGBA
    engine.property.getOutlineColorRGBA(star);
    // highlight-setOutlineWidth
    engine.property.setOutlineWidth(star, 10.0);
    // highlight-getOutlineWidth
    engine.property.getOutlineWidth(star);
    // highlight-setOutlineEnabled
    engine.property.setOutlineEnabled(star, true);
    // highlight-isOutlineEnabled
    engine.property.isOutlineEnabled(star);
  }
});
