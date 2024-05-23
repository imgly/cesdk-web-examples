/**
 * Creates a function that can be used to apply a layout asset to the current page
 * @param {import('@cesdk/cesdk-js').CreativeEngine} engine
 * @param {Object} config
 * @returns a function that can be used to apply a layout asset to the current page
 */
export const createApplyLayoutAsset = (
  engine,
  config = { addUndoStep: true }
) => {
  return async (asset) => {
    const checkScopesInAPIsSetting =
      engine.editor.getSettingBool('checkScopesInAPIs');
    engine.editor.setSettingBool('checkScopesInAPIs', false);

    const scopeBefore = engine.editor.getGlobalScope('lifecycle/destroy');
    engine.editor.setGlobalScope('lifecycle/destroy', 'Allow');

    const page = engine.scene.getCurrentPage();
    engine.block
      .findAllSelected()
      .forEach((block) => engine.block.setSelected(block, false));
    const sceneString = await fetch(asset.meta.uri).then((response) =>
      response.text()
    );
    // Load the layout page from the scene string
    const blocks = await engine.block.loadFromString(sceneString);
    const layoutPage = blocks[0];
    const oldPage = engine.block.duplicate(page);
    // Delete all children from pageToApplyLayout
    engine.block.getChildren(page).forEach((child) => {
      engine.block.destroy(child);
    });
    // Copy all children from layoutPage to pageToApplyLayout
    engine.block.getChildren(layoutPage).forEach((child) => {
      engine.block.insertChild(
        page,
        child,
        engine.block.getChildren(page).length
      );
    });
    // Copy all asset (images/ text) content from the old page to the new layout page
    copyAssets(engine, oldPage, page);

    engine.block.destroy(oldPage);
    engine.block.destroy(layoutPage);
    engine.editor.setGlobalScope('lifecycle/destroy', scopeBefore);
    if (config.addUndoStep) {
      engine.editor.addUndoStep();
    }
    // restore checkScopesInAPIs setting
    engine.editor.setSettingBool('checkScopesInAPIs', checkScopesInAPIsSetting);
    return page;
  };
};

/**
 * Copies image files and text block contents from one page to another, while retaining the layout.
 * @param {import('@cesdk/cesdk-js').CreativeEngine} engine
 * @param {Number} fromPageId
 * @param {Number} toPageId
 */
const copyAssets = (engine, fromPageId, toPageId) => {
  const fromChildren = visuallySortBlocks(
    engine,
    getChildrenTree(engine, fromPageId).flat()
  );
  const textsOnFromPage = fromChildren.filter((childId) =>
    engine.block.getType(childId).includes('text')
  );

  const imagesOnFromPage = fromChildren
    .filter((childId) => engine.block.getKind(childId) === 'image')
    .filter(
      (imageBlock) => !engine.block.isPlaceholderBehaviorEnabled(imageBlock)
    );

  const toChildren = visuallySortBlocks(
    engine,
    getChildrenTree(engine, toPageId).flat()
  );
  const textsOnToPage = toChildren.filter((childId) =>
    engine.block.getType(childId).includes('text')
  );
  const imagesOnToPage = toChildren.filter(
    (childId) => engine.block.getKind(childId) === 'image'
  );
  for (
    let index = 0;
    index < textsOnToPage.length && index < textsOnFromPage.length;
    index++
  ) {
    const fromBlock = textsOnFromPage[index];
    const toBlock = textsOnToPage[index];
    const fromText = engine.block.getString(fromBlock, 'text/text');
    const fromFontFileUri = engine.block.getString(
      fromBlock,
      'text/fontFileUri'
    );
    try {
      const fromTypeface = engine.block.getTypeface(fromBlock);
      engine.block.setFont(toBlock, fromFontFileUri, fromTypeface);
    } catch (e) {}
    const fromTextFillColor = engine.block.getColor(
      fromBlock,
      'fill/solid/color'
    );
    engine.block.setString(toBlock, 'text/text', fromText);
    engine.block.setColor(toBlock, 'fill/solid/color', fromTextFillColor);
  }
  for (
    let index = 0;
    index < imagesOnToPage.length && index < imagesOnFromPage.length;
    index++
  ) {
    const fromBlock = imagesOnFromPage[index];
    const toBlock = imagesOnToPage[index];
    const fromImageFill = engine.block.getFill(fromBlock);
    const toImageFill = engine.block.getFill(toBlock);
    const fromImageFileUri = engine.block.getString(
      fromImageFill,
      'fill/image/imageFileURI'
    );
    engine.block.setString(
      toImageFill,
      'fill/image/imageFileURI',
      fromImageFileUri
    );
    // copy image source sets
    const fromImageSourceSets = engine.block.getSourceSet(
      fromImageFill,
      'fill/image/sourceSet'
    );
    engine.block.setSourceSet(
      toImageFill,
      'fill/image/sourceSet',
      fromImageSourceSets
    );
    // engine.block.isPlaceholderEnabled(imageBlock)
    engine.block.setPlaceholderBehaviorEnabled(
      toBlock,
      engine.block.isPlaceholderBehaviorEnabled(fromBlock)
    );

    engine.block.resetCrop(toBlock);
  }
};

const getChildrenTree = (engine, block) => {
  const children = engine.block.getChildren(block);
  return [
    ...children,
    ...children.map((childBlock) => getChildrenTree(engine, childBlock)).flat()
  ];
};

/**
 * Sorts an array of blocks from top to bottom, left to right based on the upper left edge coordinates
 * @param {*} engine
 * @param {*} blocks
 * @returns Sorted Block Ids
 */
const visuallySortBlocks = (engine, blocks) => {
  const blocksWithCoordinates = blocks
    .map((block) => ({
      block,
      coordinates: [
        Math.round(engine.block.getPositionX(block)),
        Math.round(engine.block.getPositionY(block))
      ]
    }))
    .sort(({ coordinates: [X1, Y1] }, { coordinates: [X2, Y2] }) => {
      if (Y1 === Y2) return X1 - X2;
      return Y1 - Y2;
    });
  return blocksWithCoordinates.map(({ block }) => block);
};
