// This file contains multiple unofficial helper functions for working with the editor.
// We expect that most of these functions will move into the engine core over time.

export const zoomToSelectedText = async (
  engine,
  paddingTop = 0,
  paddingBottom = 0
) => {
  const canvasBounding = engine.element.getBoundingClientRect();
  const canvasHeight = canvasBounding.height * window.devicePixelRatio;
  const overlapBottom = Math.max(
    (canvasBounding.top +
      canvasBounding.height -
      window.visualViewport.height) *
      window.devicePixelRatio,
    0
  );
  const selectedTexts = engine.block.findAllSelected();
  if (selectedTexts.length === 1) {
    const cursorPosY = engine.editor.getTextCursorPositionInScreenSpaceY();
    // The first cursorPosY is 0 if no cursor has been layouted yet. Then we ignore zoom commands.
    const cursorPosIsValid = cursorPosY !== 0;
    if (!cursorPosIsValid) {
      return;
    }
    const visiblePageAreaY = canvasHeight - overlapBottom - paddingBottom;
    const camera = engine.block.findByType('camera')[0];

    const cursorPosYCanvas =
      pixelToCanvasUnit(
        engine,
        engine.editor.getTextCursorPositionInScreenSpaceY()
      ) +
      engine.block.getPositionY(camera) -
      pixelToCanvasUnit(engine, visiblePageAreaY);
    if (
      cursorPosY > visiblePageAreaY ||
      cursorPosY < paddingTop * window.devicePixelRatio
    ) {
      engine.block.setPositionY(camera, cursorPosYCanvas);
    }
  }
};

export const pixelToCanvasUnit = (engine, pixel) => {
  const sceneUnit = engine.block.getEnum(
    engine.scene.get(),
    'scene/designUnit'
  );
  let densityFactor = 1;
  if (sceneUnit === 'Millimeter') {
    densityFactor =
      engine.block.getFloat(engine.scene.get(), 'scene/dpi') / 25.4;
  }
  if (sceneUnit === 'Inch') {
    densityFactor = engine.block.getFloat(engine.scene.get(), 'scene/dpi');
  }
  return (
    pixel /
    (window.devicePixelRatio * densityFactor * engine.scene.getZoomLevel())
  );
};

// Appends a block into the scene and positions it somewhat randomly.
export const autoPlaceBlockOnPage = (
  engine,
  page,
  block,
  config = {
    basePosX: 0.25,
    basePosY: 0.25,
    randomPosX: 0.05,
    randomPosY: 0.05
  }
) => {
  engine.block
    .findAllSelected()
    .forEach((blockId) => engine.block.setSelected(blockId, false));
  engine.block.appendChild(page, block);

  const pageWidth = engine.block.getWidth(page);
  const posX =
    pageWidth * (config.basePosX + Math.random() * config.randomPosX);
  engine.block.setPositionXMode(block, 'Absolute');
  engine.block.setPositionX(block, posX);

  const pageHeight = engine.block.getWidth(page);
  const posY =
    pageHeight * (config.basePosY + Math.random() * config.randomPosY);
  engine.block.setPositionYMode(block, 'Absolute');
  engine.block.setPositionY(block, posY);

  engine.block.setSelected(block, true);
  engine.editor.addUndoStep();
};

export const replaceImage = (
  engine,
  block,
  imageFileURI,
  addUndoStep = true
) => {
  engine.block.setString(block, 'image/imageFileURI', imageFileURI);
  engine.block.resetCrop(block);
  engine.block.setBool(block, 'image/showsPlaceholderButton', false);
  engine.block.setBool(block, 'image/showsPlaceholderOverlay', false);
  if (addUndoStep) {
    engine.editor.addUndoStep();
  }
};

export const addImage = async (engine, parentId, imageURI, baseSize = 0.5) => {
  const block = engine.block.create('image');
  engine.block.setString(block, 'image/imageFileURI', imageURI);
  engine.block.setBool(block, 'image/showsPlaceholderButton', false);
  engine.block.setBool(block, 'image/showsPlaceholderOverlay', false);

  const { width, height } = await getImageSize(imageURI);
  const [parentWidth, parentHeight] = [
    engine.block.getWidth(parentId),
    engine.block.getHeight(parentId)
  ];

  const imageAspectRatio = width / height;
  const parentAspectRatio = parentWidth / parentHeight;
  let scaleFactor = baseSize;
  if (imageAspectRatio > parentAspectRatio) {
    scaleFactor *= parentWidth / width;
  } else {
    scaleFactor *= parentHeight / height;
  }
  engine.block.setHeightMode(block, 'Absolute');
  engine.block.setHeight(block, height * scaleFactor);
  engine.block.setWidthMode(block, 'Absolute');
  engine.block.setWidth(block, width * scaleFactor);

  autoPlaceBlockOnPage(engine, parentId, block);
};

// Color utilities
export function hexToRgb(hex) {
  return {
    r: ('0x' + hex[1] + hex[2]) | 0,
    g: ('0x' + hex[3] + hex[4]) | 0,
    b: ('0x' + hex[5] + hex[6]) | 0
  };
}
export function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const normalizeColors = ({ r, g, b }) => ({
  r: r / 255,
  g: g / 255,
  b: b / 255
});
export const denormalizeColors = ({ r, g, b }) => ({
  r: r * 255,
  g: g * 255,
  b: b * 255
});

const PRECISION = 0.001;
/**
 * Compares two colors with a certain precision
 * @param {ColorObject} colorA First color to compare
 * @param {ColorObject} colorB Second color to compare
 * @returns Wether the colors are approximately the same
 */
export const isColorEqual = (colorA, colorB, precision = PRECISION) => {
  return (
    Math.abs(colorB.r - colorA.r) < precision &&
    Math.abs(colorB.g - colorA.g) < precision &&
    Math.abs(colorB.b - colorA.b) < precision
  );
};
export const RGBAArrayToObj = ([r, g, b, _a]) => ({ r, g, b });

const isFullSizeBlock = (engine, pageBlockId, blockId) => {
  const tolerance =
    Math.max(
      engine.block.getWidth(pageBlockId),
      engine.block.getHeight(pageBlockId)
    ) * 0.1;
  const isInTolerance = (numberToCheck, expectedNumber) =>
    Math.abs(numberToCheck - expectedNumber) < tolerance;

  return (
    isInTolerance(engine.block.getPositionX(blockId), 0) &&
    isInTolerance(engine.block.getPositionY(blockId), 0) &&
    isInTolerance(
      engine.block.getPositionX(blockId) + engine.block.getWidth(blockId),
      engine.block.getWidth(pageBlockId)
    ) &&
    isInTolerance(
      engine.block.getPositionY(blockId) + engine.block.getHeight(blockId),
      engine.block.getHeight(pageBlockId)
    )
  );
};

const getFramePositionX = (engine, blockId) => {
  const blockX = engine.block.getGlobalBoundingBoxX(blockId);
  const parent = engine.block.getParent(blockId);
  const parentX = engine.block.getGlobalBoundingBoxX(parent);

  return blockX - parentX;
};

const getFramePositionY = (engine, blockId) => {
  const blockY = engine.block.getGlobalBoundingBoxY(blockId);
  const parent = engine.block.getParent(blockId);
  const parentY = engine.block.getGlobalBoundingBoxY(parent);

  return blockY - parentY;
};

const TRANSPARENT_BLOCK_SIZE = 0.000001;

/**
 *
 * @param {import("@cesdk/engine").default} engine
 * @param {Number} pageBlockId
 * @param {Number} width
 * @param {Number} height
 */
export const resizeCanvas = (
  engine,
  pageBlockId,
  width = 1080,
  height = 1080
) => {
  const blocksOnPage = engine.block.getChildren(pageBlockId);
  let fullSizeBlocks = [];
  let otherBlocks = [];
  blocksOnPage.forEach((blockId) => {
    if (isFullSizeBlock(engine, pageBlockId, blockId)) {
      fullSizeBlocks.push(blockId);
    } else {
      otherBlocks.push(blockId);
    }
  });
  if (!engine.block.isGroupable(otherBlocks)) {
    throw new Error('Not groupable');
  }
  const transformGroupId = engine.block.group(otherBlocks);
  engine.block.setRotation(transformGroupId, 0);

  const groupX1 = getFramePositionX(engine, transformGroupId);
  const groupY1 = getFramePositionY(engine, transformGroupId);
  const groupX2 =
    engine.block.getGlobalBoundingBoxWidth(transformGroupId) + groupX1;
  const groupY2 =
    engine.block.getGlobalBoundingBoxHeight(transformGroupId) + groupY1;
  const pageWidth = engine.block.getWidth(pageBlockId);
  const pageHeight = engine.block.getHeight(pageBlockId);
  const pageCenterX = pageWidth / 2;
  const pageCenterY = pageHeight / 2;
  const groupBBpoints = [
    [groupX1, groupY1],
    [groupX1, groupY2],
    [groupX2, groupY1],
    [groupX2, groupY2]
  ];
  const calculateDistance = (x1, x2, y1, y2) =>
    Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  const groupBBpointsWithCenterDistance = groupBBpoints.map(([X, Y]) => ({
    distance: calculateDistance(pageCenterX, X, pageCenterY, Y),
    point: [X, Y]
  }));
  const groupBBpointsWithCenterDistanceSorted =
    groupBBpointsWithCenterDistance.sort((a, b) => -a.distance + b.distance);
  const pointWithBiggestDistance =
    groupBBpointsWithCenterDistanceSorted[0].point;
  const mirroredPoint = [
    Math.abs(pointWithBiggestDistance[0] - pageWidth),
    Math.abs(pointWithBiggestDistance[1] - pageHeight)
  ];

  const transparentBlock = engine.block.create('shapes/polygon');
  engine.block.setInt(transparentBlock, 'shapes/polygon/sides', 4);

  engine.block.setPositionXMode(transparentBlock, 'Absolute');
  engine.block.setPositionX(
    transparentBlock,
    mirroredPoint[0] > pageCenterX ? mirroredPoint[0] - TRANSPARENT_BLOCK_SIZE : mirroredPoint[0]
  );
  engine.block.setPositionYMode(transparentBlock, 'Absolute');
  engine.block.setPositionY(
    transparentBlock,
    mirroredPoint[1] > pageCenterY ? mirroredPoint[1] - TRANSPARENT_BLOCK_SIZE : mirroredPoint[1]
  );
  engine.block.setWidth(transparentBlock, TRANSPARENT_BLOCK_SIZE);
  engine.block.setHeight(transparentBlock, TRANSPARENT_BLOCK_SIZE);
  engine.block.appendChild(transformGroupId, transparentBlock);

  engine.block.setWidth(pageBlockId, width);
  engine.block.setHeight(pageBlockId, height);

  // Force layout
  engine.block.setRotation(transformGroupId, 0);
  engine.block.setPositionX(transformGroupId, 0);
  engine.block.setPositionY(transformGroupId, 0);
  // Scale
  const groupWidth = engine.block.getFrameWidth(transformGroupId);
  const groupHeight = engine.block.getFrameHeight(transformGroupId);
  const newAspectRatio = width / height;
  const currentRatio = groupWidth / groupHeight;

  const scaleFactor =
    newAspectRatio > currentRatio ? height / groupHeight : width / groupWidth;
  engine.block.scale(transformGroupId, scaleFactor, 0, 0);
  const finalGroupWidth = groupWidth * scaleFactor;
  const finalGroupHeight = groupHeight * scaleFactor;

  // Force layout
  engine.block.setRotation(transformGroupId, 0);
  engine.block.setPositionX(transformGroupId, width / 2 - finalGroupWidth / 2);
  engine.block.setPositionY(
    transformGroupId,
    height / 2 - finalGroupHeight / 2
  );
  // Scale full sized blocks
  fullSizeBlocks.forEach((blockId) => {
    engine.block.setWidth(blockId, width);
    engine.block.setHeight(blockId, height);
    engine.block.setPositionX(blockId, 0);
    engine.block.setPositionY(blockId, 0);
  });
  // Cleanup
  engine.block.ungroup(transformGroupId);
  engine.block.destroy(transparentBlock);
  engine.editor.addUndoStep();
};

export function getImageSize(url) {
  const img = document.createElement('img');

  const promise = new Promise((resolve, reject) => {
    img.onload = () => {
      // Natural size is the actual image size regardless of rendering.
      // The 'normal' `width`/`height` are for the **rendered** size.
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // Resolve promise with the width and height
      resolve({ width, height });
    };

    // Reject promise on error
    img.onerror = reject;
  });

  // Setting the source makes it start downloading and eventually call `onload`
  img.src = url;

  return promise;
}
