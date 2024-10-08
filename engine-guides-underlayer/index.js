import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.37.0-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.37.0-rc.1/assets'
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

  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('star'));
  engine.block.setPositionX(block, 350);
  engine.block.setPositionY(block, 400);
  engine.block.setWidth(block, 100);
  engine.block.setHeight(block, 100);

  const fill = engine.block.createFill('color');
  engine.block.setFill(block, fill);
  const rgbaBlue = { r: 0.0, g: 0.0, b: 1.0, a: 1.0 };
  engine.block.setColor(fill, `fill/color/value`, rgbaBlue);
  // highlight-setup

  // highlight-create-underlayer-spot-color
  engine.editor.setSpotColorRGB('RDG_WHITE', 0.8, 0.8, 0.8);
  // highlight-create-underlayer-spot-color

  // highlight-export-pdf-underlayer
  await block
    .export(page, 'application/pdf', {
      exportPdfWithUnderlayer: true,
      underlayerSpotColorName: 'RDG_WHITE',
      underlayerOffset: -2.0
    })
    .then((blob) => {
      const element = document.createElement('a');
      element.setAttribute('href', window.URL.createObjectURL(blob));
      element.setAttribute('download', 'underlayer_example.pdf');
      element.style.display = 'none';
      element.click();
      element.remove();
    });
  // highlight-export-pdf-underlayer
});
