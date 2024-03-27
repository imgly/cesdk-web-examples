import truncate from 'lodash/truncate';

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
    ...cesdk.engine.block.findByType('graphic')
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
  const engine = cesdk.engine;
  return engine.block
    .findByType('text')
    .map((elementBlockId) => {
      const elementsLayingAbove = getBlockIdsAbove(cesdk, elementBlockId);
      const elementBBOverlapping = elementsLayingAbove.filter(
        (blockId) =>
          getElementOverlap(
            getElementBoundingBox(cesdk, elementBlockId),
            getElementBoundingBox(cesdk, blockId)
          ) > 0
      );
      // now check if they are really overlapping:
      // duplicate all
      const elementsTrulyOverlapping = elementBBOverlapping.some((blockId) => {
        // duplicate both elements:
        const duplicatedText = engine.block.duplicate(elementBlockId);
        const duplicatedBlockId = engine.block.duplicate(blockId);
        // Workaround until 1.21: Force layouting using setRotation:
        engine.block.setRotation(
          duplicatedText,
          engine.block.getRotation(duplicatedText)
        );
        let union;
        let hasIntersection = false;
        try {
          union = engine.block.combine(
            [duplicatedText, duplicatedBlockId],
            'Intersection'
          );
        } catch (e) {
          const message = e.message;
          if (!message.includes('Result is an empty shape.')) {
            throw e;
          }
        }
        if (union && engine.block.isValid(union)) {
          hasIntersection = true;
          engine.block.destroy(union);
        }
        if (engine.block.isValid(duplicatedBlockId)) {
          engine.block.destroy(duplicatedBlockId);
        }
        if (engine.block.isValid(duplicatedText)) {
          engine.block.destroy(duplicatedText);
        }
        return hasIntersection;
      });

      return elementsTrulyOverlapping && elementBlockId;
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

export const getImageBlockQuality = async (engine, imageId) => {
  const [frameWidthDesignUnit, frameHeightDesignUnit] = [
    engine.block.getFrameWidth(imageId),
    engine.block.getFrameHeight(imageId)
  ];
  const scene = engine.scene.get();
  const [pageUnit, pageDPI] = [
    engine.block.getEnum(scene, 'scene/designUnit'),
    engine.block.getFloat(scene, 'scene/dpi')
  ];
  const [frameWidth, frameHeight] = [
    transformToPixel(pageUnit, frameWidthDesignUnit, pageDPI),
    transformToPixel(pageUnit, frameHeightDesignUnit, pageDPI)
  ];
  const fill = engine.block.getFill(imageId);
  const { width, height } = await fetchImageResolution(
    engine.block.getString(fill, 'fill/image/imageFileURI')
  );
  // Currently scaleX and scaleY are the same
  const scaleY = engine.block.getCropScaleY(imageId) || 1;
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
  scale = 1
) => {
  var originalRatios = {
    width: frameWidth / (imageWidth / scale),
    height: frameHeight / (imageHeight / scale)
  };
  var coverRatio = Math.max(originalRatios.width, originalRatios.height);
  return 1 / coverRatio;
};

export const getLayerName = (cesdk, blockId) => {
  const layerName = cesdk.engine.block.getName(blockId);
  if (layerName && !['Text'].includes(layerName)) {
    return layerName;
  }
  const kind = cesdk.engine.block.getKind(blockId);
  switch (kind) {
    case 'text':
      const textContent = cesdk.engine.block.getString(blockId, 'text/text');
      const truncatedTextContent = truncate(textContent, { length: 25 });
      if (truncatedTextContent) {
        return truncatedTextContent;
      }
      return 'Text';
    case 'image':
      return 'Image';
    case 'sticker':
      return 'Sticker';
    case 'shapes':
      return 'Shape';
    default:
      return kind;
  }
};
