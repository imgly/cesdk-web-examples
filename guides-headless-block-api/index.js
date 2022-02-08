// highlight-setup
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.5/cesdk-engine.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.0-alpha.5/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-setup
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);

  // Lifecycle and Hierarchy

  // highlight-create
  const block = engine.block.create('shapes/star');
  // highlight-saveToString
  const savedBlocks = await engine.block.saveToString([block]);
  // highlight-loadFromString
  const loadedBlocks = await engine.block.loadFromString(savedBlocks);

  // highlight-getType
  const blockType = engine.block.getType(block);

  // highlight-setName
  engine.block.setName(block, 'someName');
  // highlight-getName
  const name = engine.block.getName(block);

  // highlight-findAll
  const allIds = engine.block.findAll();
  // highlight-findByType
  const allStars = engine.block.findByType('shapes/star');
  // highlight-findByName
  const ids = engine.block.findByName('someName');

  // highlight-duplicate
  const duplicate = engine.block.duplicate(block);
  // highlight-destroy
  engine.block.destroy(duplicate);

  // highlight-insertChild
  engine.block.insertChild(page, block, 0);
  // highlight-getParent
  const parent = engine.block.getParent(block);
  // highlight-getChildren
  const childIds = engine.block.getChildren(block);
  // highlight-appendChild
  engine.block.appendChild(parent, block);

  // Selection and Visibility

  // highlight-setSelected
  engine.block.setSelected(block, true);
  // highlight-isSelected
  const isSelected = engine.block.isSelected(block);
  // highlight-findAllSelected
  const selectedIds = engine.block.findAllSelected();

  // highlight-isVisible
  const isVisible = engine.block.isVisible(block);
  // highlight-setVisible
  engine.block.setVisible(block, true);

  // Layout

  // highlight-getPosition
  const { x, y } = engine.block.getPosition(block);
  // highlight-setPosition
  engine.block.setPosition(block, { x: 10, y: 10 });

  // highlight-getRotation
  const rad = engine.block.getRotation(block);
  // highlight-setRotation
  engine.block.setRotation(block, Math.PI / 2);
  // highlight-flip
  const flipHorizontal = engine.block.getFlipHorizontal(block);
  const flipVertical = engine.block.getFlipVertical(block);
  engine.block.setFlipHorizontal(block, true);
  engine.block.setFlipVertical(block, false);
  // highlight-flip

  // highlight-getSize
  const { width, height } = engine.block.getSize(block);
  // highlight-setSize
  engine.block.setSize(block, { width: 50, height: 50 });
  // highlight-getFrameSize
  const { width: frameWidth, height: frameHeight } = engine.block.getFrameSize(
    block
  );
  // highlight-getFrameSize

  // highlight-export
  const blob = await engine.block.export(scene, 'image/png');
});
