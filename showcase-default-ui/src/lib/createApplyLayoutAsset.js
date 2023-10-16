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
    let page = getPageInView(engine);
    const selectedBlocks = engine.block.findAllSelected();
    if (
      selectedBlocks.length === 1 &&
      engine.block.getType(selectedBlocks[0]).includes('page')
    ) {
      page = selectedBlocks[0];
    }
    selectedBlocks.forEach((block) => engine.block.setSelected(block, false));
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
    if (config.addUndoStep) {
      engine.editor.addUndoStep();
    }
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
    .filter((childId) => engine.block.getType(childId).includes('image'))
    .filter(
      (imageBlock) =>
        !engine.block.getBool(imageBlock, 'placeholderControls/showOverlay')
    );

  const toChildren = visuallySortBlocks(
    engine,
    getChildrenTree(engine, toPageId).flat()
  );
  const textsOnToPage = toChildren.filter((childId) =>
    engine.block.getType(childId).includes('text')
  );
  const imagesOnToPage = toChildren.filter((childId) =>
    engine.block.getType(childId).includes('image')
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
    const fromTextFillColor = engine.block.getColorRGBA(
      fromBlock,
      'fill/solid/color'
    );
    engine.block.setString(toBlock, 'text/text', fromText);
    engine.block.setString(toBlock, 'text/fontFileUri', fromFontFileUri);
    engine.block.setColorRGBA(
      toBlock,
      'fill/solid/color',
      ...fromTextFillColor
    );
  }
  for (
    let index = 0;
    index < imagesOnToPage.length && index < imagesOnFromPage.length;
    index++
  ) {
    const fromBlock = imagesOnFromPage[index];
    const toBlock = imagesOnToPage[index];
    const fromImageFileUri = engine.block.getString(
      fromBlock,
      'image/imageFileURI'
    );
    engine.block.setString(toBlock, 'image/imageFileURI', fromImageFileUri);
    if (engine.block.getBool(fromBlock, 'placeholderControls/showOverlay')) {
      engine.block.setBool(
        toBlock,
        'placeholderControls/showOverlay',
        engine.block.getBool(fromBlock, 'placeholderControls/showOverlay')
      );
      engine.block.setBool(
        toBlock,
        'placeholderControls/showButton',
        engine.block.getBool(fromBlock, 'placeholderControls/showButton')
      );
    } else {
      engine.block.setBool(toBlock, 'placeholderControls/showOverlay', false);
      engine.block.setBool(toBlock, 'placeholderControls/showButton', false);
    }

    engine.block.resetCrop(toBlock);
  }
};

/**
 * Calculates which page is currently in view based on the current camera position
 * @param {import('@cesdk/cesdk-js').CreativeEngine} engine
 * @returns The ID of the PageBlock that is currently in view
 */
const getPageInView = (engine) => {
  const pages = engine.block.findByType('page');
  const visiblePages = pages.filter((page) => engine.block.isVisible(page));
  if (visiblePages.length === 1) {
    return visiblePages[0];
  }

  const camera = engine.block.findByType('camera')[0];

  const getReferenceCoordinates = (block) => [
    engine.block.getGlobalBoundingBoxX(block) +
      engine.block.getGlobalBoundingBoxWidth(block) / 2,
    engine.block.getGlobalBoundingBoxY(block) +
      engine.block.getGlobalBoundingBoxHeight(block) / 2
  ];
  const distanceBetweenPoints = ([X1, Y1], [X2, Y2]) =>
    Math.hypot(X2 - X1, Y2 - Y1);
  const pagesWithDistance = pages
    .map((page) => ({
      page,
      distance: distanceBetweenPoints(
        getReferenceCoordinates(page),
        getReferenceCoordinates(camera)
      )
    }))
    .sort(
      ({ distance: distanceA }, { distance: distanceB }) =>
        distanceA - distanceB
    );
  return pagesWithDistance[0].page;
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
