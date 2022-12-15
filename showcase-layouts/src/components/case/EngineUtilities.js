export const getPageInView = (engine) => {
  const pages = engine.block.findByType('page');
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

export const getChildrenTree = (engine, block) => {
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
export const visuallySortBlocks = (engine, blocks) => {
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

const hasPlaceholder = (engine, block) => {
  return (
    engine.block.getString(block, 'image/imageFileURI') ===
    'https://firebasestorage.googleapis.com/v0/b/cesdk-ab4f3.appspot.com/o/dashboard%2Fuploads%2Fdesign%2Fo5v22c6iz5IVIg7Zr7ch%2Fcdcfa07d-924d-4101-a085-848f5f38c6f5?alt=media&token=79fb7791-7b62-4d4c-8605-a61a910d6d91'
  );
};

/**
 * Copies image files and text block contents from one page to another, while retaining the layout.
 * @param {*} engine
 * @param {*} fromPageId
 * @param {*} toPageId
 */
export const copyAssets = (engine, fromPageId, toPageId) => {
  const fromChildren = visuallySortBlocks(
    engine,
    getChildrenTree(engine, fromPageId).flat()
  );
  const textsOnFromPage = fromChildren.filter((childId) =>
    engine.block.getType(childId).includes('text')
  );

  const imagesOnFromPage = fromChildren
    .filter((childId) => engine.block.getType(childId).includes('image'))
    .filter((imageBlock) => !hasPlaceholder(engine, imageBlock));

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
    engine.block.setBool(toBlock, 'image/showsPlaceholderButton', false);
    engine.block.setBool(toBlock, 'image/showsPlaceholderOverlay', false);
    engine.block.resetCrop(toBlock);
  }
};
