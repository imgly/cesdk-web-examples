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
export const autoPlaceBlockOnPage = (engine, page, block) => {
  engine.block
    .findAllSelected()
    .forEach((blockId) => engine.block.setSelected(blockId, false));
  engine.block.appendChild(page, block);

  const pageWidth = engine.block.getWidth(page);
  const posX = pageWidth * (0.25 + Math.random() * 0.05);
  engine.block.setPositionXMode(block, 'Absolute');
  engine.block.setPositionX(block, posX);

  const pageHeight = engine.block.getWidth(page);
  const posY = pageHeight * (0.25 + Math.random() * 0.05);
  engine.block.setPositionYMode(block, 'Absolute');
  engine.block.setPositionY(block, posY);

  engine.block.setSelected(block, true);
  engine.editor.addUndoStep();
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
