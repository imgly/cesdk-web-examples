import isEqual from 'lodash/isEqual';
import { fan, map, memo, pipe } from './lib/streams';

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

  #createSource(getter) {
    // register a handler to receive all events from the engine
    const engineSource = (handler) => this.#engine.event.subscribe([], handler);
    return pipe(
      engineSource,
      // When an event occurs, retrieve a value from the engine
      map(getter),
      // When values are deep-equal, don't emit them multiple times
      memo(isEqual),
      // maintain a separate list of subscriptions for this source
      fan
    );
  }

  // Extract and store the currently selected block
  selectedBlocksStream = this.#createSource(() =>
    this.getSelectedBlockWithTypes()
  );

  // Extract and store text properties of the currently selected block
  selectedTextPropertiesStream = this.#createSource(() =>
    this.getSelectedTextProperties()
  );

  loadScene = async (url) => {
    await this.#engine.scene.loadFromURL(url);
    this.#engine.editor.addUndoStep();
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

  enablePreviewMode = (canvasWidth, canvasHeight) => {
    this.deselectAllBlocks();
    const backdropImageBlock = this.getBackdropImage();
    this.zoomToBlock(canvasWidth, canvasHeight, backdropImageBlock);

    this.#engine.editor.setSettingBool('ubq://page/dimOutOfPageAreas', false);
    this.#engine.block.setClipped(this.getPage(), true);
    this.#engine.block.setBool(
      this.getPage(),
      'backgroundColor/enabled',
      false
    );
  };

  enableEditMode = (canvasWidth, canvasHeight) => {
    this.zoomToBlock(canvasWidth, canvasHeight, this.getPage());

    this.#engine.editor.setSettingBool('ubq://page/dimOutOfPageAreas', true);
    this.#engine.block.setClipped(this.getPage(), false);
    this.#engine.block.setBool(this.getPage(), 'backgroundColor/enabled', true);
  };

  addText = () => {
    const block = this.#engine.block.create('text');
    this.#engine.block.setString(
      block,
      'text/fontFileUri',
      '/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf'
    );
    this.#engine.block.setFloat(block, 'text/fontSize', 50);
    this.#engine.block.setEnum(block, 'text/horizontalAlignment', 'Center');
    this.#engine.block.setHeightMode(block, 'Auto');
    this.addBlockToPage(block);
  };

  addImage = (imageURI) => {
    const block = this.#engine.block.create('image');
    this.#engine.block.setString(block, 'image/imageFileURI', imageURI);
    this.setSize(block);
    this.addBlockToPage(block);
  };

  addShape = (shapeBlockType) => {
    const block = this.#engine.block.create(shapeBlockType);
    this.setSize(block);
    this.addBlockToPage(block);
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

  exportScene = async () => {
    const sceneExport = await this.#engine.block.export(this.getPage());
    return sceneExport;
  };

  // UNDO & REDO
  // Streams react to state updates
  canUndoStream = this.#createSource(() => this.getCanUndo());
  canRedoStream = this.#createSource(() => this.getCanRedo());
  getCanUndo = () => this.#engine.editor.canUndo();
  getCanRedo = () => this.#engine.editor.canRedo();
  undo = () => this.#engine.editor.undo();
  redo = () => this.#engine.editor.redo();

  // UTIL FUNCTIONS
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

  allAreType = (type) => {
    return this.#engine.block.findAllSelected().every((blockId) => {
      return this.#engine.block
        .getType(blockId)
        .includes(`//ly.img.ubq/${type}`);
    });
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

  // Sets the zoom factor so that the canvas always shows a block fully (with padding).
  // Set scale factor < 1 allows to set some padding.
  zoomToBlock = (canvasWidth, canvasHeight, block, scaleFactor = 0.7) => {
    let blockWidth = this.#engine.block.getWidth(block),
      blockHeight = this.#engine.block.getHeight(block);
    let widthRatio = canvasWidth / blockWidth,
      heightRatio = canvasHeight / blockHeight;
    let bestRatio = Math.min(widthRatio, heightRatio);

    this.#engine.editor.setZoomLevel(bestRatio * scaleFactor);

    // Center Y Position
    this.#engine.block.setPositionY(
      this.getCamera(),
      this.#engine.block.getHeight(block) / 2 +
        this.#engine.block.getPositionY(block)
    );
  };

  getCamera = () => this.#engine.block.findByType('camera')[0];
  getPage = () => this.#engine.block.findByType('page')[0];
  getScene = () => this.#engine.block.findByType('scene')[0];
}
