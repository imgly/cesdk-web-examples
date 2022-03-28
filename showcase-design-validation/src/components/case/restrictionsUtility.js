import { truncate } from 'lodash';

// Calculates the overlap of two elements
// Returns the overlap as percentage of the first element
const getElementOverlap = ([aX1, aY1, aX2, aY2], [bX1, bY1, bX2, bY2]) => {
  return (
    (Math.max(0, Math.min(aX2, bX2) - Math.max(aX1, bX1)) *
      Math.max(0, Math.min(aY2, bY2) - Math.max(aY1, bY1))) /
    ((aX2 - aX1) * (aY2 - aY1))
  );
};

const getElementBoundingBox = (cesdk, blockId) => {
  const [x, y, width, height] = [
    cesdk.engine.block.getGlobalBoundingBoxX(blockId),
    cesdk.engine.block.getGlobalBoundingBoxY(blockId),
    cesdk.engine.block.getGlobalBoundingBoxWidth(blockId),
    cesdk.engine.block.getGlobalBoundingBoxHeight(blockId)
  ];
  return [x, y, x + width, y + height];
};

const getRelevantBlocks = (cesdk) => {
  return [
    ...cesdk.engine.block.findByType('text'),
    ...cesdk.engine.block.findByType('image'),
    ...cesdk.engine.block.findByType('sticker'),
    ...cesdk.engine.block.findByType('shapes/rect'),
    ...cesdk.engine.block.findByType('shapes/line'),
    ...cesdk.engine.block.findByType('shapes/star'),
    ...cesdk.engine.block.findByType('shapes/polygon'),
    ...cesdk.engine.block.findByType('shapes/ellipse')
  ];
};

export const getProtrudingBlocks = (cesdk) => {
  const page = cesdk.engine.block.findByType('page')[0];
  return getRelevantBlocks(cesdk)
    .map((elementBlockId) => {
      const overlapWithPage = getElementOverlap(
        getElementBoundingBox(cesdk, elementBlockId),
        getElementBoundingBox(cesdk, page)
      );
      const isProtruding = overlapWithPage > 0 && overlapWithPage < 0.99;
      return isProtruding && elementBlockId;
    })
    .filter((o) => !!o);
};

export const getOutsideBlocks = (cesdk) => {
  const page = cesdk.engine.block.findByType('page')[0];
  return getRelevantBlocks(cesdk)
    .map((elementBlockId) => {
      const overlapWithPage = getElementOverlap(
        getElementBoundingBox(cesdk, elementBlockId),
        getElementBoundingBox(cesdk, page)
      );
      const isOutside = overlapWithPage === 0;
      return isOutside && elementBlockId;
    })
    .filter((o) => !!o);
};

// Returns the BlockIds of all blocks that lay "above" the block
export const getBlockIdsAbove = (cesdk, blockId) => {
  const page = cesdk.engine.block.findByType('page')[0];
  const sortedBlockIds = cesdk.engine.block.getChildren(page);
  return sortedBlockIds.slice(sortedBlockIds.indexOf(blockId) + 1);
};

// Returns all text blocks that may obstructed by other blocks
export const getPartiallyHiddenTexts = (cesdk) => {
  return cesdk.engine.block
    .findByType('text')
    .map((elementBlockId) => {
      const elementsLayingAbove = getBlockIdsAbove(cesdk, elementBlockId);
      const anyElementOverlapping = elementsLayingAbove.some(
        (blockId) =>
          getElementOverlap(
            getElementBoundingBox(cesdk, elementBlockId),
            getElementBoundingBox(cesdk, blockId)
          ) > 0
      );
      return anyElementOverlapping && elementBlockId;
    })
    .filter((o) => !!o);
};

export const selectAllBlocks = (cesdk, blockIds) => {
  cesdk.engine.block
    .findAllSelected()
    .forEach((block) => cesdk.engine.block.setSelected(block, false));
  blockIds.forEach((block) => cesdk.engine.block.setSelected(block, true));
  return blockIds;
};

export const transformToPixel = (fromUnit, fromValue, dpi) => {
  if (fromUnit === 'Pixel') {
    return fromValue;
  }
  if (fromUnit === 'Millimeter') {
    return millimeterToPx(fromValue, dpi);
  } else {
    return inchToPx(fromValue, dpi);
  }
};
export const millimeterToPx = (mm, dpi) => (mm * dpi) / 25.4;
export const inchToPx = (inches, dpi) => inches * dpi;

export const getImageBlockQuality = async (cesdk, imageId) => {
  const [frameWidthDesignUnit, frameHeightDesignUnit] = [
    cesdk.engine.block.getFrameWidth(imageId),
    cesdk.engine.block.getFrameHeight(imageId)
  ];
  const scene = cesdk.engine.block.findByType('scene')[0];
  const [pageUnit, pageDPI] = [
    cesdk.engine.block.getEnum(scene, 'scene/designUnit'),
    cesdk.engine.block.getFloat(scene, 'scene/dpi')
  ];
  const [frameWidth, frameHeight] = [
    transformToPixel(pageUnit, frameWidthDesignUnit, pageDPI),
    transformToPixel(pageUnit, frameHeightDesignUnit, pageDPI)
  ];
  const { width, height } = await fetchImageResolution(
    cesdk.engine.block.getString(imageId, 'image/imageFileURI')
  );
  // Currently scaleX and scaleY are the same
  const scaleY = cesdk.engine.block.getCropScaleY(imageId) || 1;
  const imageQuality = getImageQuality(
    width,
    height,
    frameHeight,
    frameWidth,
    scaleY
  );
  return imageQuality;
};

// Poor man's cache
const resolutionCache = {};

// Currently, we are not able to access the original image resolution from the API.
// So we load the image again and fetch the resolution
export const fetchImageResolution = (url) => {
  return new Promise((resolve, reject) => {
    if (resolutionCache[url]) {
      resolve(resolutionCache[url]);
      return;
    }
    let img = new Image();
    img.onload = () => {
      const imageResolution = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      resolutionCache[url] = imageResolution;
      resolve(imageResolution);
    };
    img.onerror = () => reject();
    img.src = url;
  });
};

// Outputs the pixel density of the image in the frame.
// An output of 1 means, one pixel in the image can be rendered into the frame.
// An output of 0.5 means that one pixel in the image will be rendered as 2 pixel into the frame, leading to a loss of quality.
export const getImageQuality = (
  imageWidth,
  imageHeight,
  frameHeight,
  frameWidth,
  scale = 1,
  mode = 'cover'
) => {
  var originalRatios = {
    width: frameWidth / (imageWidth / scale),
    height: frameHeight / (imageHeight / scale)
  };
  var coverRatio = Math.max(originalRatios.width, originalRatios.height);
  return 1 / coverRatio;
};

export const getImageLayerName = (cesdk, blockId) => {
  const layerName = cesdk.engine.block.getName(blockId);
  if (layerName && !['Text'].includes(layerName)) {
    return layerName;
  }
  const type = cesdk.engine.block.getType(blockId);
  switch (type) {
    case '//ly.img.ubq/text':
      const textContent = cesdk.engine.block.getString(blockId, 'text/text');
      const truncatedTextContent = truncate(textContent, { length: 25 });
      if (truncatedTextContent) {
        return truncatedTextContent;
      }
      return 'Text';
    case '//ly.img.ubq/image':
      return 'Image';
    case '//ly.img.ubq/sticker':
      return 'Sticker';
    case '//ly.img.ubq/shapes/rect':
      return 'Shape: rect';
    case '//ly.img.ubq/shapes/line':
      return 'Shape: line';
    case '//ly.img.ubq/shapes/star':
      return 'Shape: star';
    case '//ly.img.ubq/shapes/polygon':
      return 'Shape: polygon';
    case '//ly.img.ubq/shapes/ellipse':
      return 'Shape: ellipse';
    default:
      return type;
  }
};
