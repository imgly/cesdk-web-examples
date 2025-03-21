import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.48.0-rc.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.48.0-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  const circle1 = engine.block.create('graphic');
  engine.block.setShape(circle1, engine.block.createShape('ellipse'));
  engine.block.setFill(circle1, engine.block.createFill('color'));
  engine.block.setPositionX(circle1, 30);
  engine.block.setPositionY(circle1, 30);
  engine.block.setWidth(circle1, 40);
  engine.block.setHeight(circle1, 40);
  engine.block.appendChild(page, circle1);

  const circle2 = engine.block.create('graphic');
  engine.block.setShape(circle2, engine.block.createShape('ellipse'));
  engine.block.setFill(circle2, engine.block.createFill('color'));
  engine.block.setPositionX(circle2, 80);
  engine.block.setPositionY(circle2, 30);
  engine.block.setWidth(circle2, 40);
  engine.block.setHeight(circle2, 40);
  engine.block.appendChild(page, circle2);

  const circle3 = engine.block.create('graphic');
  engine.block.setShape(circle3, engine.block.createShape('ellipse'));
  engine.block.setFill(circle3, engine.block.createFill('color'));
  engine.block.setPositionX(circle3, 50);
  engine.block.setPositionY(circle3, 50);
  engine.block.setWidth(circle3, 50);
  engine.block.setHeight(circle3, 50);
  engine.block.appendChild(page, circle3);

  const union = engine.block.combine([circle1, circle2, circle3], 'Union');

  const text = engine.block.create('text');
  engine.block.replaceText(text, 'Removed text');
  engine.block.setPositionX(text, 10);
  engine.block.setPositionY(text, 40);
  engine.block.setWidth(text, 80);
  engine.block.setHeight(text, 10);
  engine.block.appendChild(page, text);

  const image = engine.block.create('graphic');
  engine.block.setShape(image, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setFill(image, imageFill);
  engine.block.setPositionX(image, 0);
  engine.block.setPositionY(image, 0);
  engine.block.setWidth(image, 100);
  engine.block.setHeight(image, 100);
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.appendChild(page, image);

  engine.block.sendToBack(image);
  const difference = engine.block.combine([image, text], 'Difference');
});
