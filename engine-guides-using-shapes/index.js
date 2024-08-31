// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.34.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.34.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  const scene = engine.scene.create();
  engine.editor.setSettingBool('page/dimOutOfPageAreas', false);

  const graphic = engine.block.create('graphic');
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(graphic, imageFill);
  engine.block.setWidth(graphic, 100);
  engine.block.setHeight(graphic, 100);
  engine.block.appendChild(scene, graphic);

  engine.scene.zoomToBlock(graphic, 40, 40, 40, 40);

  // highlight-setup

  // highlight-supportsShape
  engine.block.supportsShape(graphic); // Returns true
  const text = engine.block.create('text');
  engine.block.supportsShape(text); // Returns false
  // highlight-supportsShape

  // highlight-createShape
  const rectShape = engine.block.createShape('rect');
  // highlight-createShape
  // highlight-setShape
  engine.block.setShape(graphic, rectShape);
  // highlight-setShape
  // highlight-getShape
  const shape = engine.block.getShape(graphic);
  const shapeType = engine.block.getType(shape);
  // highlight-getShape

  // highlight-replaceShape
  const starShape = engine.block.createShape('star');
  engine.block.destroy(engine.block.getShape(graphic));
  engine.block.setShape(graphic, starShape);
  /* The following line would also destroy the currently attached starShape */
  // engine.block.destroy(graphic);
  // highlight-replaceShape

  // highlight-getProperties
  const allShapeProperties = engine.block.findAllProperties(starShape);
  // highlight-getProperties
  // highlight-modifyProperties
  engine.block.setInt(starShape, 'shape/star/points', 6);
  // highlight-modifyProperties
});
