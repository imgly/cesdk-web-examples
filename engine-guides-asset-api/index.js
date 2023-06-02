// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.12.0/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.12.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  // highlight-setup

  // highlight-defineCustomSource
  const customSource = {
    // highlight-customSourceId
    id: 'foobar',
    // highlight-customSourceFindAssets
    async findAssets(queryData) {
      return Promise.resolve({
        assets: [
          {
            id: 'logo',
            meta: {
              uri: 'https://img.ly/static/ubq_samples/imgly_logo.jpg',
              thumbUri: 'https://img.ly/static/ubq_samples/thumbnails/imgly_logo.jpg',
              blockType: '//ly.img.ubq/image',
              width: 320,
              height: 116
            },
            context: {
              sourceId: 'foobar'
            }
          }
        ],
        total: 1,
        currentPage: queryData.page,
        nextPage: undefined
      });
    },
    // highlight-customSourceFindAssets
    // highlight-customSourceApplyAsset
    async applyAsset(assetResult) {
      const image = engine.block.create('image');
      engine.block.setString(image, 'image/imageFileURI', assetResult.meta.uri);
      engine.block.setWidth(image, assetResult.meta.width);
      engine.block.setHeight(image, assetResult.meta.height);
      const firstPage = engine.block.findByType('page')[0];
      engine.block.appendChild(firstPage, image);
      engine.block.setWidth(firstPage, assetResult.meta.width);
      engine.block.setHeight(firstPage, assetResult.meta.height);
      engine.scene.zoomToBlock(firstPage, 0, 0, 0, 0);
      engine.editor.addUndoStep();
    },
    // highlight-customSourceApplyAsset
    // highlight-customSourceApplyAssetToBlock
    async applyAssetToBlock(assetResult, block) {
      engine.asset.defaultApplyAssetToBlock(assetResult, block);
    }
    // highlight-customSourceApplyAssetToBlock
  };

  // highlight-addSource
  engine.asset.addSource(customSource);

  // highlight-findAllSources
  engine.asset.findAllSources()

  // highlight-findAssets
  const result = await engine.asset.findAssets(customSource.id, {page: 0, perPage: 100});
  const asset = result.assets[0];
  // highlight-findAssets
  
  // highlight-apply
  await engine.asset.apply(customSource.id, asset);

  // highlight-removeSource
  engine.asset.removeSource(customSource.id);

  document.getElementById('cesdk_container').append(engine.element);
});
