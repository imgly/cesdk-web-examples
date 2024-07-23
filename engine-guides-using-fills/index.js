// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.32.0-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.32.0-rc.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  engine.scene.zoomToBlock(page, 40, 40, 40, 40);

  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('rect'));
  engine.block.setFill(block, engine.block.createFill('color'));
  engine.block.setWidth(block, 100);
  engine.block.setHeight(block, 100);
  engine.block.appendChild(page, block);
  // highlight-setup

  // highlight-supportsFill
  engine.block.supportsFill(scene); // Returns false
  engine.block.supportsFill(block); // Returns true
  // highlight-supportsFill

  // highlight-getFill
  const colorFill = engine.block.getFill(block);
  const defaultRectFillType = engine.block.getType(colorFill);
  // highlight-getFill
  // highlight-getProperties
  const allFillProperties = engine.block.findAllProperties(colorFill);
  // highlight-getProperties
  // highlight-modifyProperties
  engine.block.setColor(colorFill, 'fill/color/value', {
    r: 1.0,
    g: 0.0,
    b: 0.0,
    a: 1.0
  });
  // highlight-modifyProperties

  // highlight-disableFill
  engine.block.setFillEnabled(block, false);
  engine.block.setFillEnabled(block, !engine.block.isFillEnabled(block));
  // highlight-disableFill

  // highlight-createFill
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  // highlight-createFill

  // highlight-replaceFill
  engine.block.destroy(engine.block.getFill(block));
  engine.block.setFill(block, imageFill);

  /* The following line would also destroy imageFill */
  // engine.block.destroy(circle);
  // highlight-replaceFill

  // highlight-duplicateFill
  const duplicateBlock = engine.block.duplicate(block);
  engine.block.setPositionX(duplicateBlock, 450);
  const autoDuplicateFill = engine.block.getFill(duplicateBlock);
  engine.block.setString(
    autoDuplicateFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_2.jpg'
  );

  // const manualDuplicateFill = engine.block.duplicate(autoDuplicateFill);
  // /* We could now assign this fill to another block. */
  // engine.block.destroy(manualDuplicateFill);

  // highlight-duplicateFill

  // highlight-sharedFill
  const sharedFillBlock = engine.block.create('graphic');
  engine.block.setShape(sharedFillBlock, engine.block.createShape('rect'));
  engine.block.setPositionX(sharedFillBlock, 350);
  engine.block.setPositionY(sharedFillBlock, 400);
  engine.block.setWidth(sharedFillBlock, 100);
  engine.block.setHeight(sharedFillBlock, 100);
  engine.block.appendChild(page, sharedFillBlock);

  engine.block.setFill(sharedFillBlock, engine.block.getFill(block));
  // highlight-sharedFill
});
