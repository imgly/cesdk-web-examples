import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.48.1-rc.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.48.1-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);
  engine.scene.zoomToBlock(page, 50, 50, 50, 50);

  var circle = engine.block.createCutoutFromPath(
    'M 0,25 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0 Z'
  );
  engine.block.appendChild(page, circle);
  engine.block.setFloat(circle, 'cutout/offset', 3.0);
  engine.block.setEnum(circle, 'cutout/type', 'Dashed');

  var square = engine.block.createCutoutFromPath('M 0,0 H 50 V 50 H 0 Z');
  engine.block.appendChild(page, square);
  engine.block.setPositionX(square, 50);
  engine.block.setFloat(square, 'cutout/offset', 6.0);

  var union = engine.block.createCutoutFromOperation([circle, square], 'Union');
  engine.block.appendChild(page, union);
  engine.block.destroy(circle);
  engine.block.destroy(square);

  engine.editor.setSpotColorRGB('CutContour', 0.0, 0.0, 1.0);
});
