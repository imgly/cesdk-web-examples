// highlight-setup
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.1/cesdk-engine.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.1/assets'
};

CreativeEngine.init(document.getElementById('cesdk_canvas'), config).then(
  // highlight-setup
  async (engine) => {
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);

    // Lifecycle and Hierarchy

    // highlight-create
    const block = engine.block.create('shapes/star');
    // highlight-create
    // highlight-getType
    const blockType = engine.block.getType(block);
    // highlight-getType

    // highlight-setName
    engine.block.setName(block, 'someName');
    // highlight-setName
    // highlight-getName
    const name = engine.block.getName(block);
    // highlight-getName

    // highlight-findAll
    const allIds = engine.block.findAll();
    // highlight-findAll
    // highlight-findByType
    const allStars = engine.block.findByType('shapes/star');
    // highlight-findByType
    // highlight-findByName
    const ids = engine.block.findByName('someName');
    // highlight-findByName

    // highlight-duplicate
    const duplicate = engine.block.duplicate(block);
    // highlight-duplicate
    // highlight-destroy
    engine.block.destroy(duplicate);
    // highlight-destroy

    // highlight-insertChild
    engine.block.insertChild(page, block, 0);
    // highlight-insertChild
    // highlight-getParent
    const parent = engine.block.getParent(block);
    // highlight-getParent
    // highlight-getChildren
    const childIds = engine.block.getChildren(block);
    // highlight-getChildren
    // highlight-appendChild
    engine.block.appendChild(parent, block);
    // highlight-appendChild

    // Selection and Visibility

    // highlight-setSelected
    engine.block.setSelected(block, true);
    // highlight-setSelected
    // highlight-isSelected
    const isSelected = engine.block.isSelected(block);
    // highlight-isSelected
    // highlight-findAllSelected
    const selectedIds = engine.block.findAllSelected();
    // highlight-findAllSelected

    // highlight-isVisible
    const isVisible = engine.block.isVisible(block);
    // highlight-isVisible
    // highlight-setVisible
    engine.block.setVisible(block, true);
    // highlight-setVisible

    // Layout

    // highlight-getPosition
    const { x, y } = engine.block.getPosition(block);
    // highlight-getPosition
    // highlight-setPosition
    engine.block.setPosition(block, { x: 10, y: 10 });
    // highlight-setPosition

    // highlight-getRotation
    const rad = engine.block.getRotation(block);
    // highlight-getRotation
    // highlight-setRotation
    engine.block.setRotation(block, Math.PI / 2);
    // highlight-setRotation
    // highlight-flip
    const flipHorizontal = engine.block.getFlipHorizontal(block);
    const flipVertical = engine.block.getFlipVertical(block);
    engine.block.setFlipHorizontal(block, true);
    engine.block.setFlipVertical(block, false);
    // highlight-flip

    // highlight-getSize
    const { width, height } = engine.block.getSize(block);
    // highlight-getSize
    // highlight-setSize
    engine.block.setSize(block, { width: 50, height: 50 });
    // highlight-setSize
    // highlight-getFrameSize
    const {
      width: frameWidth,
      height: frameHeight
    } = engine.block.getFrameSize(block);
    // highlight-getFrameSize

    // highlight-export
    const blob = await engine.block.export(scene, 'image/png');
    // highlight-export
  }
);
