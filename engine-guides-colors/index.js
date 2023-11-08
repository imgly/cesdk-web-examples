import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.14.0/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.14.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-setup
  document.getElementById('cesdk_container').append(engine.element);

  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  engine.scene.zoomToBlock(page, 40, 40, 40, 40);

  const star = engine.block.create('shapes/star');
  engine.block.setPositionX(star, 350);
  engine.block.setPositionY(star, 400);
  engine.block.setWidth(star, 100);
  engine.block.setHeight(star, 100);

  const fill = engine.block.getFill(star);
  // highlight-setup

  // highlight-create-colors
  const rgbaBlue = {r:0.0, g:0.0, b:1.0, a:1.0};
  const cmykRed = {c:0.0, m:1.0, y:1.0, k:0.0, tint:1.0};
  const cmykPartialRed = {c:0.0, m:1.0, y:1.0, k:0.0, tint:0.5};

  engine.editor.setSpotColorRGB('Pink-Flamingo', 0.988, 0.455, 0.992);
  engine.editor.setSpotColorCMYK('Yellow', 0.0, 0.0, 1.0, 0.0);
  const spotPinkFlamingo = {name:'Pink-Flamingo', tint:1.0, externalReference:'Crayola'};
  const spotPartialYellow = {name:'Yellow', tint:0.3, externalReference:''};
  // highlight-create-colors

  // highlight-apply-colors
  engine.block.setColor(fill, `fill/color/value`, rgbaBlue);
  engine.block.setColor(fill, `fill/color/value`, cmykRed);
  engine.block.setColor(star, `stroke/color`, cmykPartialRed);
  engine.block.setColor(fill, `fill/color/value`, spotPinkFlamingo);
  engine.block.setColor(star, `dropShadow/color`, spotPartialYellow);
  // highlight-apply-colors

  // highlight-convert-color
  const cmykBlueConverted = engine.editor.convertColorToColorSpace(rgbaBlue, 'CMYK');
  const rgbaPinkFlamingoConverted = engine.editor.convertColorToColorSpace(spotPinkFlamingo, 'sRGB');
  // highlight-convert-color

  // highlight-find-spot
  engine.editor.findAllSpotColors();  // ['Crayola-Pink-Flamingo', 'Yellow']
  // highlight-find-spot

  // highlight-change-spot
  engine.editor.setSpotColorCMYK('Yellow',0.2, 0.0, 1.0, 0.0);
  // highlight-change-spot

  // highlight-undefine-spot
  engine.editor.removeSpotColor('Yellow')
  // highlight-undefine-spot
});
