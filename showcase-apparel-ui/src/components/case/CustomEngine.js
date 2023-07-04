import { getImageSize } from './lib/utils';

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
    this.enableEditMode();
    this.#engine.editor.setSettingBool('ubq://doubleClickToCropEnabled', false);
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
      'fill/color': this.#engine.block.getFillSolidColor(textBlock)
    };
  };
  getSelectedShapeProperties = () => {
    const shape = this.getAllSelectedElements('shape')[0];
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
        placeholderControlsButtonEnabled: false,
        placeholderControlsOverlayEnabled: false
      };
    }
    return {
      placeholderControlsButtonEnabled: this.#engine.block.getBool(
        image,
        'placeholderControls/showButton'
      ),
      placeholderControlsOverlayEnabled: this.#engine.block.getBool(
        image,
        'placeholderControls/showOverlay'
      )
    };
  };

  enablePreviewMode = () => {
    this.#engine.editor.setEditMode('Transform');
    this.deselectAllBlocks();
    this.#engine.editor.setSettingBool('ubq://page/dimOutOfPageAreas', false);
    this.#engine.block.setClipped(this.getPage(), true);
    this.#engine.block.setBool(this.getPage(), 'fill/enabled', false);
  };

  enableEditMode = () => {
    this.#engine.editor.setSettingBool('ubq://page/dimOutOfPageAreas', true);
    this.#engine.block.setClipped(this.getPage(), false);
    this.#engine.block.setBool(this.getPage(), 'fill/enabled', true);
  };

  addText = (
    fontFileUri = '/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf'
  ) => {
    const block = this.#engine.block.create('text');
    this.#engine.block.setString(block, 'text/fontFileUri', fontFileUri);
    this.#engine.block.setFloat(block, 'text/fontSize', 50);
    this.#engine.block.setEnum(block, 'text/horizontalAlignment', 'Center');
    this.#engine.block.setHeightMode(block, 'Auto');
    this.addBlockToPage(block);
  };

  addImage = async (imageURI) => {
    const block = this.#engine.block.create('image');
    this.#engine.block.setString(block, 'image/imageFileURI', imageURI);
    const { width, height } = await getImageSize(imageURI);
    const imageAspectRatio = width / height;
    const baseHeight = 50;

    this.#engine.block.setHeightMode(block, 'Absolute');
    this.#engine.block.setHeight(block, baseHeight);
    this.#engine.block.setWidthMode(block, 'Absolute');
    this.#engine.block.setWidth(block, baseHeight * imageAspectRatio);

    this.addBlockToPage(block);
  };

  addShape = (shapeBlockType) => {
    const block = this.#engine.block.create(shapeBlockType);
    this.setSize(block);
    // Set default parameters for some shape types
    // When we add a polygon, we add a triangle
    if (shapeBlockType === 'shapes/polygon') {
      this.#engine.block.setInt(block, 'shapes/polygon/sides', 3);
    }
    // When we add a line, we need to resize the height again
    else if (shapeBlockType === 'shapes/line') {
      this.#engine.block.setHeightMode(block, 'Absolute');
      this.#engine.block.setHeight(block, 1);
    } else if (shapeBlockType === 'shapes/star') {
      this.#engine.block.setFloat(block, 'shapes/star/innerDiameter', 0.4);
    }
    this.addBlockToPage(block);
    // Workaround: To set a rotation, the block currently has to be attached to a scene
    if (shapeBlockType === 'shapes/line') {
      this.#engine.block.setRotation(block, -Math.PI / 4);
    }
  };

  addSticker = (stickerURI) => {
    const block = this.#engine.block.create('sticker');
    this.#engine.block.setString(block, 'sticker/imageFileURI', stickerURI);
    this.setSize(block);
    this.addBlockToPage(block);
  };

  // All non-text blocks in this demo should be added with the same square size
  setSize = (block) => {
    this.#engine.block.setHeightMode(block, 'Absolute');
    this.#engine.block.setHeight(block, 20);
    this.#engine.block.setWidthMode(block, 'Absolute');
    this.#engine.block.setWidth(block, 20);
  };

  // Appends a block into the scene and positions it somewhat randomly.
  addBlockToPage = (block) => {
    this.deselectAllBlocks();
    this.#engine.block.appendChild(this.getPage(), block);

    this.#engine.block.setPositionXMode(block, 'Absolute');
    this.#engine.block.setPositionX(block, 15 + Math.random() * 20);
    this.#engine.block.setPositionYMode(block, 'Absolute');
    this.#engine.block.setPositionY(block, 5 + Math.random() * 20);

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
        this.#engine.block.setPlaceholderControlsButtonEnabled(
          imageElementId,
          false
        );
        this.#engine.block.setPlaceholderControlsOverlayEnabled(
          imageElementId,
          false
        );
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
    const allSelectedShapeElements = this.getAllSelectedElements('shape');
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

  exportScene = async () => {
    const page = this.getPage();
    const prevPageFill = this.#engine.block.getBool(page, 'fill/enabled');
    this.#engine.block.setBool(page, 'fill/enabled', true);
    // We always want a background color when exporting
    const sceneExport = await this.#engine.block.export(
      page,
      'application/pdf'
    );
    this.#engine.block.setBool(page, 'fill/enabled', prevPageFill);
    return sceneExport;
  };

  // UNDO & REDO
  getCanUndo = () => this.#engine.editor.canUndo();
  getCanRedo = () => this.#engine.editor.canRedo();
  undo = () => this.#engine.editor.undo();
  redo = () => this.#engine.editor.redo();

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
    return this.#engine.scene.zoomToBlock(this.getPage(), 20, 60, 20, 100);
  };

  zoomToBackdrop = async () => {
    const backdropImageBlock = this.getBackdropImage();
    this.#engine.scene.zoomToBlock(backdropImageBlock, 0, 60, 0, 20);
  };

  zoomToSelectedText = async (canvasHeight, overlapBottom) => {
    const paddingBottom = 90;
    const paddingTop = 90;
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

  deselectAllBlocks = () => {
    this.#engine.block
      .findAllSelected()
      .forEach((blockId) => this.#engine.block.setSelected(blockId, false));
  };

  deleteSelectedElement = () => {
    const selectedBlocks = this.#engine.block.findAllSelected();
    selectedBlocks.forEach((pageId) => {
      this.#engine.block.destroy(pageId);
    });
    this.#engine.editor.addUndoStep();
  };

  getAllSelectedElements = (elementType = '') => {
    const allSelected = this.#engine.block.findAllSelected();
    if (!elementType) {
      return allSelected;
    }
    return allSelected.filter((elementId) => {
      return this.#engine.block.getType(elementId).includes(elementType);
    });
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
