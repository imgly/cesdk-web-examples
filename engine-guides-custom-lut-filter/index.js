// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.32.0-rc.0/index.js';

const config = {
    license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
    userId: 'guides-user',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.32.0-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);
  const scene = engine.scene.create();

  // highlight-load-scene
  const page = engine.block.create('page');
  engine.block.setWidth(page, 100);
  engine.block.setHeight(page, 100);
  engine.block.appendChild(scene, page);
  engine.scene.zoomToBlock(page, 40, 40, 40, 40);
  // highlight-load-scene

  // highlight-create-rect
  const rect = engine.block.create('graphic');
  engine.block.setShape(rect, engine.block.createShape('rect'));
  engine.block.setWidth(rect, 100);
  engine.block.setHeight(rect, 100);
  engine.block.appendChild(page, rect);
  // highlight-create-rect

  // highlight-create-image-fill
  const imageFill = engine.block.createFill('image');
  engine.block.setString(imageFill, 'fill/image/imageFileURI', 'https://img.ly/static/ubq_samples/sample_1.jpg');
  // highlight-create-image-fill

  // highlight-create-lut-filter
  const lutFilter = engine.block.createEffect('lut_filter');
  engine.block.setBool(lutFilter, 'effect/enabled', true);
  engine.block.setFloat(lutFilter, 'effect/lut_filter/intensity', 0.9);
  engine.block.setString(
    lutFilter,
    'effect/lut_filter/lutFileURI',
    'https://cdn.img.ly/packages/imgly/cesdk-js/1.32.0-rc.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png'
  );

  engine.block.setInt(lutFilter, 'effect/lut_filter/verticalTileCount', 5);
  engine.block.setInt(lutFilter, 'effect/lut_filter/horizontalTileCount', 5);
  // highlight-create-lut-filter

  // highlight-apply-lut-filter
  engine.block.appendEffect(rect, lutFilter)
  engine.block.setFill(rect, imageFill);
  // highlight-apply-lut-filter
});

// Swift code
