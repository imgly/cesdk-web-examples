// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.6/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.6/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('root').append(engine.element);

  const scene = engine.scene.create();
  
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  engine.scene.zoomToBlock(page, 40, 40, 40, 40);

  const rect = engine.block.create('shapes/rect');
  engine.block.setWidth(rect, 100);
  engine.block.setHeight(rect, 100);
  engine.block.appendChild(page, rect);

  const circle = engine.block.create('shapes/ellipse');
  engine.block.setPositionX(circle, 100);
  engine.block.setPositionY(circle, 50);
  engine.block.setWidth(circle, 300);
  engine.block.setHeight(circle, 300);
  engine.block.appendChild(page, circle);
  // highlight-setup

  // highlight-hasFill
  engine.block.hasFill(scene); // Returns false
  engine.block.hasFill(rect); // Returns true
  // highlight-hasFill

  // highlight-getFill
  const rectFill = engine.block.getFill(rect);
  const defaultRectFillType = engine.block.getType(rectFill);
  // highlight-getFill
  // highlight-getProperties
  const allFillProperties = engine.block.findAllProperties(rectFill);
  // highlight-getProperties
  // highlight-modifyProperties
  engine.block.setColorRGBA(rectFill, 'fill/color/value', 1.0, 0.0, 0.0, 1.0);
  // highlight-modifyProperties

  // highlight-disableFill
  engine.block.setFillEnabled(rect, false);
  engine.block.setFillEnabled(rect, !engine.block.isFillEnabled(rect));
  // highlight-disableFill

  // highlight-createFill
  const imageFill = engine.block.createFill('image');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', 'https://img.ly/static/ubq_samples/sample_1.jpg');
  // highlight-createFill

  // highlight-replaceFill
  engine.block.destroy(engine.block.getFill(circle));
  engine.block.setFill(circle, imageFill);

  /* The following line would also destroy imageFill */
  // engine.block.destroy(circle);
  // highlight-replaceFill

  // highlight-duplicateFill
  const duplicateCircle = engine.block.duplicate(circle);
  engine.block.setPositionX(duplicateCircle, 450);
  const autoDuplicateFill = engine.block.getFill(duplicateCircle);
  engine.block.setString(autoDuplicateFill, 'fill/image/imageFileURI', 'https://img.ly/static/ubq_samples/sample_2.jpg');

  // const manualDuplicateFill = engine.block.duplicate(autoDuplicateFill);
  // /* We could now assign this fill to another block. */
  // engine.block.destroy(manualDuplicateFill);

  // highlight-duplicateFill

  // highlight-sharedFill
  const star = engine.block.create('shapes/star');
  engine.block.setPositionX(star, 350);
  engine.block.setPositionY(star, 400);
  engine.block.setWidth(star, 100);
  engine.block.setHeight(star, 100);
  engine.block.appendChild(page, star);

  engine.block.setFill(star, engine.block.getFill(circle));
  // highlight-sharedFill
});
