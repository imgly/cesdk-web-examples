// highlight-setup
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.5.0/cesdk-engine.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.5.0/assets'
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

  // highlight-findAllProperties
  const propertyNames = engine.block.findAllProperties(star);

  // highlight-getPropertyType
  const pointsType = engine.block.getPropertyType('shapes/star/points'); // "Int"

  // highlight-getEnumValues
  engine.block.getEnumValues('text/horizontalAlignment');

  // Generic Properties

  // highlight-setBool
  engine.block.setBool(scene, 'scene/aspectRatioLock', false);
  // highlight-getBool
  engine.block.getBool(scene, 'scene/aspectRatioLock');
  // highlight-getInt
  const points = engine.block.getInt(star, 'shapes/star/points');
  // highlight-setInt
  engine.block.setInt(star, 'shapes/star/points', points + 2);
  // highlight-setFloat
  engine.block.setFloat(star, 'shapes/star/innerDiameter', 0.75);
  // highlight-getFloat
  engine.block.getFloat(star, 'shapes/star/innerDiameter');
  // highlight-setString
  engine.block.setString(text, 'text/text', '*o*');
  // highlight-getString
  engine.block.getString(text, 'text/text');
  // highlight-setColorRGBA
  engine.block.setColorRGBA(camera, 'camera/clearColor', 1, 1, 1, 1); // White
  // highlight-getColorRGBA
  engine.block.getColorRGBA(camera, 'camera/clearColor');
  // highlight-setEnum
  engine.block.setEnum(text, 'text/horizontalAlignment', 'Center');
  engine.block.setEnum(text, 'text/verticalAlignment', 'Center');
  // highlight-setEnum
  // highlight-getEnum
  engine.block.getEnum(text, 'text/horizontalAlignment');

  // Common Properties

  // highlight-hasCrop
  engine.block.hasCrop(image);
  // highlight-setCropScaleX
  engine.block.setCropScaleX(image, 2.0);
  // highlight-setCropScaleY
  engine.block.setCropScaleY(image, 1.5);
  // highlight-setCropRotation
  engine.block.setCropRotation(image, Math.PI);
  // highlight-setCropTranslationX
  engine.block.setCropTranslationX(image, -1.0);
  // highlight-setCropTranslationY
  engine.block.setCropTranslationY(image, 1.0);
  // highlight-resetCrop
  engine.block.resetCrop(image);
  // highlight-getCropScaleX
  engine.block.getCropScaleX(image);
  // highlight-getCropScaleY
  engine.block.getCropScaleY(image);
  // highlight-getCropRotation
  engine.block.getCropRotation(image);
  // highlight-getCropTranslationX
  engine.block.getCropTranslationX(image);
  // highlight-getCropTranslationY
  engine.block.getCropTranslationY(image);

  // highlight-hasOpacity
  engine.block.hasOpacity(image);
  // highlight-setOpacity
  engine.block.setOpacity(image, 0.5);
  // highlight-getOpacity
  engine.block.getOpacity(image, 0.5);

  // highlight-hasFillColor
  if (engine.block.hasFillColor(star)) {
    // highlight-setFillColorRGBA
    engine.block.setFillColorRGBA(star, 1, 1, 0, 1); // Yellow
    // highlight-getFillColorRGBA
    engine.block.getFillColorRGBA(star);
    // highlight-setFillColorEnabled
    engine.block.setFillColorEnabled(star, true);
    // highlight-isFillColorEnabled
    engine.block.isFillColorEnabled(star);
  }

  // highlight-hasBackgroundColor
  if (engine.block.hasBackgroundColor(page)) {
    // highlight-setBackgroundColorRGBA
    engine.block.setBackgroundColorRGBA(page, 1, 0, 0, 1); // Red
    // highlight-getBackgroundColorRGBA
    engine.block.getBackgroundColorRGBA(page);
    // highlight-setBackgroundColorEnabled
    engine.block.setBackgroundColorEnabled(page, true);
    // highlight-isBackgroundColorEnabled
    engine.block.isBackgroundColorEnabled(page);
  }

  // highlight-hasOutline
  if (engine.block.hasOutline(star)) {
    // highlight-setOutlineColorRGBA
    engine.block.setOutlineColorRGBA(star, 1, 0.5, 0, 1); // Orange
    // highlight-getOutlineColorRGBA
    engine.block.getOutlineColorRGBA(star);
    // highlight-setOutlineWidth
    engine.block.setOutlineWidth(star, 10.0);
    // highlight-getOutlineWidth
    engine.block.getOutlineWidth(star);
    // highlight-setOutlineEnabled
    engine.block.setOutlineEnabled(star, true);
    // highlight-isOutlineEnabled
    engine.block.isOutlineEnabled(star);
  }
});
