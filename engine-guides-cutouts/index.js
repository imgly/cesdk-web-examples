import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.14.0-rc.1/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.14.0-rc.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-setup
  document.getElementById('cesdk_container').append(engine.element);

  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);
  engine.scene.zoomToBlock(page, 50, 50, 50, 50);
  // highlight-setup

  // highlight-create-cutouts
  var circle = engine.block.createCutoutFromPath('M 0,25 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0 Z');
  engine.block.appendChild(page, circle);
  engine.block.setCutoutOffset(circle, 3.0);
  engine.block.setCutoutType(circle, 'Dashed');

  var square = engine.block.createCutoutFromPath('M 0,0 H 50 V 50 H 0 Z');
  engine.block.appendChild(page, square);
  engine.block.setPositionX(square, 50);
  engine.block.setCutoutOffset(square, 6.0);
  // highlight-create-cutouts

  // highlight-cutout-union
  var union = engine.block.createCutoutFromOperation([circle, square], 'Union');
  engine.block.appendChild(page, union);
  engine.block.destroy(circle);
  engine.block.destroy(square);
  // highlight-cutout-union

  // highlight-spot-color-solid
  engine.editor.setSpotColorRGB('CutContour', 0.0, 0.0, 1.0);
  // highlight-spot-color-solid
});
