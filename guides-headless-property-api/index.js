// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.7.0-alpha.3/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.7.0-alpha.3/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  const camera = engine.block.findByType('camera')[0];
  const image = engine.block.create('image');
  engine.block.appendChild(page, image);
  const star = engine.block.create('shapes/star');
  engine.block.appendChild(page, star);
  const text = engine.block.create('text');
  engine.block.appendChild(page, text);
  // highlight-setup

  // Examples

  // highlight-image
  engine.block.setString(image, 'image/imageFileURI', 'https://img.ly/static/ubq_samples/sample_4.jpg');
  engine.block.resetCrop(image);
  // highlight-image

  // highlight-text
  engine.block.setFloat(text, 'text/fontSize', 18.0);
  engine.block.setString(text, 'text/text', 'Greetings');
  engine.block.setString(text, 'text/fontFileUri', '/extensions/ly.img.cesdk.fonts/fonts/Caveat/Caveat-Bold.ttf');
  engine.block.setEnum(text, 'text/horizontalAlignment', 'Left');
  // highlight-text

  // Reflection

  // highlight-findAllProperties
  const propertyNamesStar = engine.block.findAllProperties(star); // Array [ "shapes/star/innerDiameter", "shapes/star/points", "opacity/value", ... ]
  // highlight-findAllProperties-image
  const propertyNamesImage = engine.block.findAllProperties(image); // Array [ "image/imageFileURI", "image/previewFileURI", "image/externalReference", ... ]
  // highlight-findAllProperties-text
  const propertyNamesText = engine.block.findAllProperties(text); // Array [ "text/text", "text/fontFileUri", "text/externalReference", "text/fontSize", "text/horizontalAlignment", ... ]
  // highlight-findAllProperties

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
  engine.block.setString(image, 'image/imageFileURI', 'https://img.ly/static/ubq_samples/sample_4.jpg');
  // highlight-setString
  // highlight-getString
  engine.block.getString(text, 'text/text');
  engine.block.getString(image, 'image/imageFileURI');
    // highlight-getString
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
  engine.block.getEnum(text, 'text/verticalAlignment');
  // highlight-getEnum

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
  // highlight-setContentFillMode
  engine.block.setContentFillMode(image, 'Contain');
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
  // highlight-getContentFillMode
  engine.block.getContentFillMode(image);

  // highlight-hasOpacity
  engine.block.hasOpacity(image);
  // highlight-setOpacity
  engine.block.setOpacity(image, 0.5);
  // highlight-getOpacity
  engine.block.getOpacity(image);

  // highlight-hasPlaceholderContent
  engine.block.hasPlaceholderContent(image);

  // highlight-setBlendMode
  engine.block.setBlendMode(image, 'Multiply');
  // highlight-getBlendMode
  engine.block.getBlendMode(image);

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
