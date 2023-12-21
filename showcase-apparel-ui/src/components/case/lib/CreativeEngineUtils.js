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
