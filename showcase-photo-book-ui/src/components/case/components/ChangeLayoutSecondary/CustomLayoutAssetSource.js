import ALL_CUSTOM_LAYOUTS from './CustomLayouts.json';
import { copyAssets, getPageInView } from './EngineUtilities';

export const CreateCustomLayoutAssetSource = (engine, qualifyAssetUris) => ({
  id: 'layouts',
  applyAsset: async (asset) => {
    let pageToApplyLayoutTo = getPageInView(engine);
    const selectedBlocks = engine.block.findAllSelected();
    if (
      selectedBlocks.length === 1 &&
      engine.block.getType(selectedBlocks[0]).includes('page')
    ) {
      pageToApplyLayoutTo = selectedBlocks[0];
    }
    selectedBlocks.forEach((block) => engine.block.setSelected(block, false));
    const sceneString = await fetch(asset.meta.sceneUri).then((response) =>
      response.text()
    );
    const blocks = await engine.block.loadFromString(sceneString);
    const parent = engine.block.getParent(pageToApplyLayoutTo);
    const sortedChildren = engine.block.getChildren(parent);
    engine.block.insertChild(
      parent,
      blocks[0],
      sortedChildren.indexOf(pageToApplyLayoutTo)
    );
    // Workaround: We need to force layouting to be able to get the global coordinates from the new template.
    engine.block.setRotation(blocks[0], 0);
    copyAssets(engine, pageToApplyLayoutTo, blocks[0]);
    engine.block.destroy(pageToApplyLayoutTo);
    return blocks[0];
  },
  findAssets: () => ({
    assets: ALL_CUSTOM_LAYOUTS.map(qualifyAssetUris),
    total: ALL_CUSTOM_LAYOUTS.length,
    nextPage: undefined,
    currentPage: 0
  })
});
