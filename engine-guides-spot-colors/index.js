import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.11.1/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.11.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-setup
  document.getElementById('root').append(engine.element);

  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  engine.scene.zoomToBlock(page, 40, 40, 40, 40);

  const text = engine.block.create("text");
  engine.block.setPositionX(text, 350);
  engine.block.setPositionY(text, 100);

  const star = engine.block.create('shapes/star');
  engine.block.setPositionX(star, 350);
  engine.block.setPositionY(star, 400);
  engine.block.setWidth(star, 100);
  engine.block.setHeight(star, 100);
  // highlight-setup

  // highlight-create
  engine.editor.setSpotColorRGB('Crayola-Pink-Flamingo', 0.988, 0.455, 0.992);
  engine.editor.setSpotColorRGB('Pantone-ColorOfTheYear-2022', 0.4, 0.404, 0.671);
  engine.editor.setSpotColorRGB('Yellow', 1, 1, 0);
  engine.editor.findAllSpotColors();  // ['Crayola-Pink-Flamingo', 'Pantone-ColorOfTheYear-2022', 'Yellow']
  // highlight-create

  // highlight-apply-star
  engine.block.setColorSpot(star, 'fill/solid/color', 'Crayola-Pink-Flamingo')

  engine.block.setColorSpot(star, 'stroke/color', 'Yellow', 0.8)
  engine.block.setStrokeEnabled(star, true);

  engine.block.getColorSpotName(star, 'fill/solid/color') // 'Crayola-Pink-Flamingo'
  engine.block.getColorSpotTint(star, 'stroke/color') // 0.8
  // highlight-apply-star

  // highlight-apply-text
  engine.block.setColorSpot(text, 'fill/solid/color', 'Yellow')

  engine.block.setColorSpot(text, 'stroke/color', 'Crayola-Pink-Flamingo', 0.5)
  engine.block.setStrokeEnabled(text, true);
  
  engine.block.setColorSpot(text, 'backgroundColor/color', 'Pantone-ColorOfTheYear-2022', 0.9)
  engine.block.setBackgroundColorEnabled(text, true);
  // highlight-apply-text

  // highlight-change
  engine.editor.setSpotColorRGB('Yellow', 1, 1, 0.4);
  // highlight-change

  // highlight-undefine
  editor.removeSpotColor('Yellow')
  // highlight-undefine
});
