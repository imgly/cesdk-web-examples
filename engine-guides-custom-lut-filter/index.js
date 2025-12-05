import CreativeEngine from '@cesdk/engine';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user',
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);
  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 100);
  engine.block.setHeight(page, 100);
  engine.block.appendChild(scene, page);
  engine.scene.zoomToBlock(page, 40, 40, 40, 40);

  const rect = engine.block.create('graphic');
  engine.block.setShape(rect, engine.block.createShape('rect'));
  engine.block.setWidth(rect, 100);
  engine.block.setHeight(rect, 100);
  engine.block.appendChild(page, rect);

  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );

  const lutFilter = engine.block.createEffect('lut_filter');
  engine.block.setBool(lutFilter, 'effect/enabled', true);
  engine.block.setFloat(lutFilter, 'effect/lut_filter/intensity', 0.9);
  engine.block.setString(
    lutFilter,
    'effect/lut_filter/lutFileURI',
    'https://cdn.img.ly/packages/imgly/cesdk-js/1.65.0/assets/extensions/ly.img.cesdk.filters.lut/LUTs/imgly_lut_ad1920_5_5_128.png'
  );

  engine.block.setInt(lutFilter, 'effect/lut_filter/verticalTileCount', 5);
  engine.block.setInt(lutFilter, 'effect/lut_filter/horizontalTileCount', 5);

  engine.block.appendEffect(rect, lutFilter);
  engine.block.setFill(rect, imageFill);
});
