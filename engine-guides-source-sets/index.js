import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.20.0-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  baseURL: './release/assets'
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

  // highlight-set-source-set
  let block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('rect'));
  const imageFill = engine.block.createFill('image');
  engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
    {
      uri: 'https://img.ly/static/ubq_samples/sample_1_512x341.jpg',
      width: 512,
      height: 341
    },
    {
      uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
      width: 1024,
      height: 683
    },
    {
      uri: 'https://img.ly/static/ubq_samples/sample_1_2048x1366.jpg',
      width: 2048,
      height: 1366
    }
  ]);
  engine.block.setFill(block, imageFill);
  console.log(engine.block.getSourceSet(imageFill, 'fill/image/sourceSet'));
  engine.block.appendChild(page, block);
  // highlight-set-source-set

  // highlight-asset-definition
  const assetWithSourceSet = {
    id: 'my-image',
    meta: {
      kind: 'image',
      fillType: '//ly.img.ubq/fill/image'
    },
    payload: {
      sourceSet: [
        {
          uri: 'https://img.ly/static/ubq_samples/sample_1_512x341.jpg',
          width: 512,
          height: 341
        },
        {
          uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
          width: 1024,
          height: 683
        },
        {
          uri: 'https://img.ly/static/ubq_samples/sample_1_2048x1366.jpg',
          width: 2048,
          height: 1366
        }
      ]
    }
  };
  // highlight-asset-definition

  // highlight-asset-source
  await engine.asset.addLocalSource('my-dynamic-images');
  engine.asset.addAssetToSource('my-dynamic-images', assetWithSourceSet);
  // highlight-asset-source

  // highlight-apply-asset
  // Could also acquire the asset using `findAssets` on the source
  const result = await engine.asset.defaultApplyAsset(assetWithSourceSet);
  console.log(
    engine.block.getSourceSet(
      engine.block.getFill(result),
      'fill/image/sourceSet'
    )
  ); // Lists the entries from above again.
  // highlight-apply-asset
});
