// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.19.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.19.0/assets'
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
              blockType: '//ly.img.ubq/graphic',
              fillType: '//ly.img.ubq/fill/image',
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
      const block = engine.block.create('graphic');
      engine.block.setShape(block, engine.block.createShape('rect'));
      const imageFill = engine.block.createFill('image');
      engine.block.setString(imageFill, 'fill/image/imageFileURI', assetResult.meta.uri);
      engine.block.setFill(block, imageFill);
      engine.block.setWidth(block, assetResult.meta.width);
      engine.block.setHeight(block, assetResult.meta.height);
      const firstPage = engine.block.findByType('page')[0];
      engine.block.appendChild(firstPage, block);
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
  engine.asset.findAllSources();

  // highlight-AssetAPI.getSupportedMimeTypes
  const mimeTypes = engine.asset.getSupportedMimeTypes("ly.img.asset.source.unsplash")

  // highlight-AssetAPI.getCredits
  const credits = engine.asset.getCredits(customSource.id);
  // highlight-AssetAPI.getCredits
  // highlight-AssetAPI.getLicense
  const license = engine.asset.getLicense(customSource.id);
  // highlight-AssetAPI.getLicense
  // highlight-AssetAPI.getGroups
  const groups = engine.asset.getGroups(customSource.id);
  // highlight-AssetAPI.getGroups

  // highlight-findAssets
  const result = await engine.asset.findAssets(customSource.id, {
    page: 0,
    perPage: 100
  });
  const asset = result.assets[0];
  // highlight-findAssets

  // highlight-apply
  await engine.asset.apply(customSource.id, asset);

  // highlight-removeSource
  engine.asset.removeSource(customSource.id);

  document.getElementById('cesdk_container').append(engine.element);
});
