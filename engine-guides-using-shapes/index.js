import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.57.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.57.0/assets'
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


  engine.block.supportsShape(graphic); // Returns true
  const text = engine.block.create('text');
  engine.block.supportsShape(text); // Returns false

  const rectShape = engine.block.createShape('rect');
  engine.block.setShape(graphic, rectShape);
  const shape = engine.block.getShape(graphic);
  const shapeType = engine.block.getType(shape);

  const starShape = engine.block.createShape('star');
  engine.block.destroy(engine.block.getShape(graphic));
  engine.block.setShape(graphic, starShape);
  /* The following line would also destroy the currently attached starShape */
  // engine.block.destroy(graphic);

  const allShapeProperties = engine.block.findAllProperties(starShape);
  engine.block.setInt(starShape, 'shape/star/points', 6);
});
