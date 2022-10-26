import { getImageSize } from './lib/utils';

const SHAPE_TYPES = ['shape', 'vector_path'];

// Here we wrap the CreativeEngine to fit our use case
// We do not want to expose the engine to the outside world directly.
// Instead we add methods we need here in the engine class.
export class CustomEngine {
  #engine;

  constructor(engine) {
    this.#engine = engine;
  }
  // Make sure to dispose the engine.
  dispose = () => this.#engine.dispose();

  loadScene = async (url) => {
    await this.#engine.scene.loadFromURL(url);
    this.#engine.editor.addUndoStep();
  };

  getEditorState = () => {
    return {
      editMode: this.#engine.editor.getEditMode()
    };
  };

  getSelectedBlockWithTypes = () => {
    return this.#engine.block.findAllSelected().map((id) => ({
      id,
      type: this.#engine.block.getType(id)
    }));
  };
  getSelectedTextProperties = () => {
    const textBlock = this.getAllSelectedElements('text')[0];
    if (!textBlock) {
      return {
        'text/horizontalAlignment': null,
        'text/fontFileUri': null,
        'fill/color': null
      };
    }
    return {
      'text/horizontalAlignment': this.#engine.block.getEnum(
        textBlock,
        'text/horizontalAlignment'
      ),
      'text/fontFileUri': this.#engine.block.getString(
        textBlock,
        'text/fontFileUri'
      ),
      'fill/color': this.#engine.block.getFillColorRGBA(textBlock)
    };
  };
  getSelectedShapeProperties = () => {
    const shape = this.getAllSelectedElements(...SHAPE_TYPES)[0];
    if (!shape) {
      return {
        'fill/solid/color': null
      };
    }
    return {
      'fill/solid/color': this.#engine.block.getColorRGBA(
        shape,
        'fill/solid/color'
      )
    };
  };
  getSelectedImageProperties = () => {
    const image = this.getAllSelectedElements('image')[0];
    if (!image) {
      return {
        'crop/rotation': null,
        'crop/scaleRatio': null,
        'crop/scaleX': null,
        'crop/scaleY': null
      };
    }
    return {
      'crop/rotation':
        this.#engine.block.getFloat(image, 'crop/rotation') * (180 / Math.PI),
      'crop/scaleRatio': this.#engine.block.getFloat(image, 'crop/scaleRatio'),
      'crop/scaleX': this.#engine.block.getFloat(image, 'crop/scaleX'),
      'crop/scaleY': this.#engine.block.getFloat(image, 'crop/scaleY')
    };
  };

  addText = (
    fontFileUri = '/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf'
  ) => {
    const block = this.#engine.block.create('text');
    this.#engine.block.setString(block, 'text/fontFileUri', fontFileUri);
    this.#engine.block.setFloat(block, 'text/fontSize', 40);
    this.#engine.block.setEnum(block, 'text/horizontalAlignment', 'Center');
    this.addBlockToPage(block);
    this.#engine.block.setHeightMode(block, 'Auto');
    this.#engine.block.setWidth(block, this.getPageSize().width * 0.5);
  };

  addImage = async (imageURI) => {
    const block = this.#engine.block.create('image');
    this.#engine.block.setString(block, 'image/imageFileURI', imageURI);
    const { width, height } = await getImageSize(imageURI);
    const imageAspectRatio = width / height;
    const baseHeight = this.getPageSize().height * 0.4;

    this.#engine.block.setHeightMode(block, 'Absolute');
    this.#engine.block.setHeight(block, baseHeight);
    this.#engine.block.setWidthMode(block, 'Absolute');
    this.#engine.block.setWidth(block, baseHeight * imageAspectRatio);

    this.addBlockToPage(block);
  };

  addShape = (shapeBlockType, properties = {}) => {
    const block = this.#engine.block.create(shapeBlockType);
    this.setSize(block);
    // Set default parameters for some shape types
    // When we add a polygon, we add a triangle
    if (shapeBlockType === 'shapes/polygon') {
      this.#engine.block.setInt(block, 'shapes/polygon/sides', 3);
    }
    // When we add a line, we need to resize the height again
    else if (shapeBlockType === 'shapes/star') {
      this.#engine.block.setFloat(block, 'shapes/star/innerDiameter', 0.4);
    }
    Object.entries(properties).forEach(([key, value]) => {
      this.#engine.block.setString(block, key, value);
    });
    this.addBlockToPage(block);

    // Workaround: To set a rotation, the block currently has to be attached to a scene
    if (shapeBlockType === 'shapes/line') {
      this.#engine.block.setRotation(block, -Math.PI / 4);
      this.#engine.block.setHeightMode(block, 'Absolute');
      this.#engine.block.setHeight(
        block,
        this.#engine.block.getWidth(block) * 0.05
      );
    }
  };

  addSticker = (stickerURI) => {
    const block = this.#engine.block.create('sticker');
    this.#engine.block.setString(block, 'sticker/imageFileURI', stickerURI);
    this.setSize(block);
    this.addBlockToPage(block);
  };

  getPageSize = () => ({
    width: this.#engine.block.getWidth(this.getPage()),
    height: this.#engine.block.getHeight(this.getPage())
  });

  // All non-text blocks in this demo should be added with the same square size
  setSize = (block) => {
    this.#engine.block.setHeightMode(block, 'Absolute');
    this.#engine.block.setHeight(block, this.getPageSize().width * 0.5);
    this.#engine.block.setWidthMode(block, 'Absolute');
    this.#engine.block.setWidth(block, this.getPageSize().width * 0.5);
  };

  // Appends a block into the scene and positions it somewhat randomly.
  addBlockToPage = (block) => {
    this.deselectAllBlocks();
    this.#engine.block.appendChild(this.getPage(), block);

    this.#engine.block.setPositionXMode(block, 'Absolute');
    this.#engine.block.setPositionX(
      block,
      this.getPageSize().width * 0.25 +
        Math.random() * this.getPageSize().width * 0.1
    );
    this.#engine.block.setPositionYMode(block, 'Absolute');
    this.#engine.block.setPositionY(
      block,
      this.getPageSize().height * 0.1 +
        Math.random() * this.getPageSize().height * 0.1
    );

    this.#engine.block.setSelected(block, true);
    this.#engine.editor.addUndoStep();
  };

  changeTextFont = (value) => {
    const allSelectedTextElements = this.getAllSelectedElements('text');

    if (allSelectedTextElements.length > 0) {
      allSelectedTextElements.forEach((textElementId) => {
        this.#engine.block.setString(textElementId, 'text/fontFileUri', value);
      });
      this.#engine.editor.addUndoStep();
    }
  };

  // Change the selected text element to a different color,
  // Note: Color values are in the range of 0-1, not 0-255
  changeTextColor = ({ r, g, b }) => {
    const allSelectedTextElements = this.getAllSelectedElements('text');
    if (allSelectedTextElements.length > 0) {
      allSelectedTextElements.forEach((textElementId) => {
        this.#engine.block.setFillColorRGBA(textElementId, r, g, b, 1);
      });
      this.#engine.editor.addUndoStep();
    }
  };

  changeTextAlignment = (value) => {
    const allSelectedTextElements = this.getAllSelectedElements('text');

    if (allSelectedTextElements.length > 0) {
      allSelectedTextElements.forEach((textElementId) => {
        this.#engine.block.setEnum(
          textElementId,
          'text/horizontalAlignment',
          value
        );
      });
      this.#engine.editor.addUndoStep();
    }
  };

  changeImageFile = (value) => {
    const allSelectedImageElements = this.getAllSelectedElements('image');

    if (allSelectedImageElements.length > 0) {
      allSelectedImageElements.forEach((imageElementId) => {
        this.#engine.block.setString(
          imageElementId,
          'image/imageFileURI',
          value
        );
        this.#engine.block.resetCrop(imageElementId);
      });
      this.#engine.editor.addUndoStep();
    }
  };
  changeStickerFile = (value) => {
    const allSelectedStickerElements = this.getAllSelectedElements('sticker');

    if (allSelectedStickerElements.length > 0) {
      allSelectedStickerElements.forEach((stickerElementId) => {
        this.#engine.block.setString(
          stickerElementId,
          'sticker/imageFileURI',
          value
        );
      });
      this.#engine.editor.addUndoStep();
    }
  };
  changeShapeColor = ({ r, g, b }) => {
    const allSelectedShapeElements = this.getAllSelectedElements(
      ...SHAPE_TYPES
    );
    if (allSelectedShapeElements.length > 0) {
      allSelectedShapeElements.forEach((shapeElementId) => {
        this.#engine.block.setColorRGBA(
          shapeElementId,
          'fill/solid/color',
          r,
          g,
          b,
          1
        );
      });
      this.#engine.editor.addUndoStep();
    }
  };
  setEditMode = (mode) => this.#engine.editor.setEditMode(mode);
  resetCurrentCrop = () => {
    const allSelectedImageElements = this.getAllSelectedElements('image');
    allSelectedImageElements.forEach((imageElementId) => {
      this.#engine.block.resetCrop(imageElementId);
    });
  };
  scale = (newScale) => {
    const allSelectedImageElements = this.getAllSelectedElements('image');
    allSelectedImageElements.forEach((imageElementId) => {
      this.#engine.block.setCropScaleRatio(imageElementId, newScale);
      const currentRatio = this.#engine.block.getCropScaleRatio(imageElementId);
      this.#engine.block.adjustCropToFillFrame(imageElementId, currentRatio);
    });
  };
  straighten = (degree) => {
    const allSelectedImageElements = this.getAllSelectedElements('image');
    allSelectedImageElements.forEach((imageElementId) => {
      const rotationInRadians = (degree * Math.PI) / 180;
      this.#engine.block.setCropRotation(imageElementId, rotationInRadians);
      const currentRatio = this.#engine.block.getCropScaleRatio(imageElementId);
      this.#engine.block.adjustCropToFillFrame(imageElementId, currentRatio);
    });
  };

  queryStickers = async (group) => {
    const STICKER_ASSET_LIBRARY_ID = 'stickers';
    const queryParameters = { page: 1, perPage: 999 };
    if (group) {
      queryParameters.groups = [group];
    }
    const results = await this.#engine.asset.findAssets(
      STICKER_ASSET_LIBRARY_ID,
      queryParameters
    );
    return results;
  };

  exportScene = async () => {
    const page = this.getPage();
    const sceneExport = await this.#engine.block.export(page, 'image/png');
    return sceneExport;
  };

  getAllBlocksOnPage = () => {
    const childIds = this.#engine.block.getChildren(this.getPage());
    return childIds;
  };
  isFullsizeBlock = (blockId) => {
    const tolerance =
      Math.max(
        this.#engine.block.getWidth(this.getPage()),
        this.#engine.block.getHeight(this.getPage())
      ) * 0.1;
    const isInTolerance = (numberToCheck, expectedNumber) =>
      Math.abs(numberToCheck - expectedNumber) < tolerance;

    return (
      isInTolerance(this.#engine.block.getPositionX(blockId), 0) &&
      isInTolerance(this.#engine.block.getPositionY(blockId), 0) &&
      isInTolerance(
        this.#engine.block.getPositionX(blockId) +
          this.#engine.block.getWidth(blockId),
        this.#engine.block.getWidth(this.getPage())
      ) &&
      isInTolerance(
        this.#engine.block.getPositionY(blockId) +
          this.#engine.block.getHeight(blockId),
        this.#engine.block.getHeight(this.getPage())
      )
    );
  };

  resizeCanvas = (width = 1080, height = 1080) => {
    const blocksOnPage = this.getAllBlocksOnPage();
    const pageId = this.getPage();
    let fullsizeBlocks = [];
    let otherBlocks = [];
    blocksOnPage.forEach((blockId) => {
      if (this.isFullsizeBlock(blockId)) {
        fullsizeBlocks.push(blockId);
      } else {
        otherBlocks.push(blockId);
      }
    });
    if (!this.#engine.block.isGroupable(otherBlocks)) {
      throw new Error('Not groupable');
    }
    const transformGroupId = this.#engine.block.group(otherBlocks);
    this.#engine.block.setRotation(transformGroupId, 0);

    const groupX1 = this.#engine.block.getGlobalBoundingBoxX(transformGroupId);
    const groupY1 = this.#engine.block.getGlobalBoundingBoxY(transformGroupId);
    const groupX2 =
      this.#engine.block.getGlobalBoundingBoxWidth(transformGroupId) + groupX1;
    const groupY2 =
      this.#engine.block.getGlobalBoundingBoxHeight(transformGroupId) + groupY1;
    const pageWidth = this.#engine.block.getWidth(pageId);
    const pageHeight = this.#engine.block.getHeight(pageId);
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

    const transparentBlock = this.#engine.block.create('shapes/polygon');
    this.#engine.block.setInt(transparentBlock, 'shapes/polygon/sides', 4);

    this.#engine.block.setPositionXMode(transparentBlock, 'Absolute');
    this.#engine.block.setPositionX(transparentBlock, mirroredPoint[0]);
    this.#engine.block.setPositionYMode(transparentBlock, 'Absolute');
    this.#engine.block.setPositionY(transparentBlock, mirroredPoint[1]);
    this.#engine.block.setWidth(transparentBlock, 10);
    this.#engine.block.setHeight(transparentBlock, 10);
    this.#engine.block.appendChild(transformGroupId, transparentBlock);

    this.#engine.block.setWidth(pageId, width);
    this.#engine.block.setHeight(pageId, height);

    // Force layout
    this.#engine.block.setRotation(transformGroupId, 0);
    this.#engine.block.setPositionX(transformGroupId, 0);
    this.#engine.block.setPositionY(transformGroupId, 0);
    // Scale
    const groupWidth =
      this.#engine.block.getGlobalBoundingBoxWidth(transformGroupId);
    const groupHeight =
      this.#engine.block.getGlobalBoundingBoxHeight(transformGroupId);
    const newAspectRatio = width / height;
    const currentRatio = groupWidth / groupHeight;

    const scaleFactor =
      newAspectRatio > currentRatio ? height / groupHeight : width / groupWidth;
    this.#engine.block.scale(transformGroupId, scaleFactor, 0, 0);
    const finalGroupWidth = groupWidth * scaleFactor;
    const finalGroupHeight = groupHeight * scaleFactor;

    // Force layout
    this.#engine.block.setRotation(transformGroupId, 0);
    this.#engine.block.setPositionX(
      transformGroupId,
      width / 2 - finalGroupWidth / 2
    );
    this.#engine.block.setPositionY(
      transformGroupId,
      height / 2 - finalGroupHeight / 2
    );
    // Scale full sized blocks
    fullsizeBlocks.forEach((blockId) => {
      this.#engine.block.setWidth(blockId, width);
      this.#engine.block.setHeight(blockId, height);
      this.#engine.block.setPositionX(blockId, 0);
      this.#engine.block.setPositionY(blockId, 0);
    });
    this.zoomToPage();
    // Cleanup
    this.#engine.block.ungroup(transformGroupId);
    this.#engine.block.destroy(transparentBlock);
    this.#engine.editor.addUndoStep();
  };

  // UNDO & REDO
  getCanUndo = () => this.#engine.editor.canUndo();
  getCanRedo = () => this.#engine.editor.canRedo();
  undo = () => {
    this.#engine.editor.undo();
    this.zoomToPage();
  };
  redo = () => {
    this.#engine.editor.redo();
    this.zoomToPage();
  };

  // UTIL FUNCTIONS
  pixelToCanvasUnit = (pixel) => {
    const sceneUnit = this.#engine.block.getEnum(
      this.getScene(),
      'scene/designUnit'
    );
    let densityFactor = 1;
    if (sceneUnit === 'Millimeter') {
      densityFactor =
        this.#engine.block.getFloat(this.getScene(), 'scene/dpi') / 25.4;
    }
    if (sceneUnit === 'Inch') {
      densityFactor = this.#engine.block.getFloat(this.getScene(), 'scene/dpi');
    }
    return (
      pixel /
      (window.devicePixelRatio *
        densityFactor *
        this.#engine.scene.getZoomLevel())
    );
  };

  zoomToPage = async () => {
    return this.#engine.scene.zoomToBlock(this.getPage(), 20, 20, 20, 20);
  };

  zoomToSelectedText = async (canvasHeight, overlapBottom) => {
    const paddingBottom = 30;
    const paddingTop = 30;
    const selectedTexts = this.#engine.block.findAllSelected();
    if (selectedTexts.length === 1) {
      const cursorPosY =
        this.#engine.editor.getTextCursorPositionInScreenSpaceY();
      // The first cursorPosY is 0 if no cursor has been layouted yet. Then we ignore zoom commands.
      const cursorPosIsValid = cursorPosY !== 0;
      if (!cursorPosIsValid) {
        return;
      }
      const visiblePageAreaY = canvasHeight - overlapBottom - paddingBottom;

      const cursorPosYCanvas =
        this.pixelToCanvasUnit(
          this.#engine.editor.getTextCursorPositionInScreenSpaceY()
        ) +
        this.#engine.block.getPositionY(this.getCamera()) -
        this.pixelToCanvasUnit(visiblePageAreaY);
      if (
        cursorPosY > visiblePageAreaY ||
        cursorPosY < paddingTop * window.devicePixelRatio
      ) {
        this.#engine.block.setPositionY(this.getCamera(), cursorPosYCanvas);
      }
    }
  };
  zoomToCrop = async (overlapBottom) => {
    const selectedImages = this.#engine.block.findAllSelected();
    if (selectedImages.length === 1) {
      const imageBlock = selectedImages[0];
      this.#engine.scene.zoomToBlock(
        imageBlock,
        40,
        40,
        40,
        overlapBottom + 40
      );
    }
  };

  deselectAllBlocks = () => {
    this.#engine.block
      .findAllSelected()
      .forEach((blockId) => this.#engine.block.setSelected(blockId, false));
  };

  deleteSelectedElement = () => {
    const selectedBlocks = this.#engine.block.findAllSelected();
    if (this.#engine.editor.getEditMode() === 'Crop') {
      this.#engine.editor.setEditMode('Transform');
    }
    selectedBlocks.forEach((pageId) => {
      this.#engine.block.destroy(pageId);
    });
    this.#engine.editor.addUndoStep();
  };

  getAllSelectedElements = (...elementTypes) => {
    const allSelected = this.#engine.block.findAllSelected();
    if (elementTypes.length === 0) {
      return allSelected;
    }
    return allSelected.filter((elementId) =>
      elementTypes.some((elementType) =>
        this.#engine.block.getType(elementId).includes(elementType)
      )
    );
  };

  // Note: Backdrop Images are not officially supported yet.
  // The backdrop image is the only image that is a direct child of the scene block.
  getBackdropImage = () => {
    const scene = this.getScene();
    const childIds = this.#engine.block.getChildren(scene);
    const imageId = childIds.find(
      (block) => this.#engine.block.getType(block) === '//ly.img.ubq/image'
    );
    return imageId;
  };

  getCamera = () => this.#engine.block.findByType('camera')[0];
  getPage = () => this.#engine.block.findByType('page')[0];
  getScene = () => this.#engine.block.findByType('scene')[0];
}
