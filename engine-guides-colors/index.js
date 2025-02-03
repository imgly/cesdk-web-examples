import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.44.0-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.44.0-rc.1/assets'
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
  engine.block.setPositionX(block, 350);
  engine.block.setPositionY(block, 400);
  engine.block.setWidth(block, 100);
  engine.block.setHeight(block, 100);

  const fill = engine.block.getFill(block);

  const rgbaBlue = { r: 0.0, g: 0.0, b: 1.0, a: 1.0 };
  const cmykRed = { c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 1.0 };
  const cmykPartialRed = { c: 0.0, m: 1.0, y: 1.0, k: 0.0, tint: 0.5 };

  engine.editor.setSpotColorRGB('Pink-Flamingo', 0.988, 0.455, 0.992);
  engine.editor.setSpotColorCMYK('Yellow', 0.0, 0.0, 1.0, 0.0);
  const spotPinkFlamingo = {
    name: 'Pink-Flamingo',
    tint: 1.0,
    externalReference: 'Crayola'
  };
  const spotPartialYellow = {
    name: 'Yellow',
    tint: 0.3,
    externalReference: ''
  };

  engine.block.setColor(fill, `fill/color/value`, rgbaBlue);
  engine.block.setColor(fill, `fill/color/value`, cmykRed);
  engine.block.setColor(block, `stroke/color`, cmykPartialRed);
  engine.block.setColor(fill, `fill/color/value`, spotPinkFlamingo);
  engine.block.setColor(block, `dropShadow/color`, spotPartialYellow);

  const cmykBlueConverted = engine.editor.convertColorToColorSpace(
    rgbaBlue,
    'CMYK'
  );
  const rgbaPinkFlamingoConverted = engine.editor.convertColorToColorSpace(
    spotPinkFlamingo,
    'sRGB'
  );

  engine.editor.findAllSpotColors(); // ['Crayola-Pink-Flamingo', 'Yellow']

  engine.editor.setSpotColorCMYK('Yellow', 0.2, 0.0, 1.0, 0.0);

  engine.editor.removeSpotColor('Yellow');
});
