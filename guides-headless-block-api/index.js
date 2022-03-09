// highlight-setup
import 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.4/cesdk-engine.umd.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.4.4/assets'
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

  // highlight-getPositionX
  const x = engine.block.getPositionX(block);
  // highlight-getPositionXMode
  const xMode = engine.block.getPositionXMode(block);
  // highlight-getPositionY
  const y = engine.block.getPositionY(block);
  // highlight-getPositionYMode
  const yMode = engine.block.getPositionYMode(block);
  // highlight-setPositionX
  engine.block.setPositionX(block, 0.25);
  // highlight-setPositionXMode
  engine.block.setPositionXMode(block, 'Percent');
  // highlight-setPositionY
  engine.block.setPositionY(block, 0.25);
  // highlight-setPositionYMode
  engine.block.setPositionYMode(block, 'Percent');

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

  // highlight-getWidth
  const width = engine.block.getWidth(block);
  // highlight-getWidthMode
  const widthMode = engine.block.getWidthMode(block);
  // highlight-getHeight
  const height = engine.block.getHeight(block);
  // highlight-getHeightMode
  const heightMode = engine.block.getHeightMode(block);
  // highlight-setWidth
  engine.block.setWidth(block, 0.5);
  // highlight-setWidthMode
  engine.block.setWidthMode(block, 'Percent');
  // highlight-setHeight
  engine.block.setHeight(block, 0.5);
  // highlight-setHeightMode
  engine.block.setHeightMode(block, 'Percent');
  // highlight-getFrameWidth
  const frameWidth = engine.block.getFrameWidth(block);
  // highlight-getFrameHeight
  const frameHeight = engine.block.getFrameHeight(block);

  // highlight-getGlobalBoundingBoxX
  const globalX = engine.block.getGlobalBoundingBoxX(block);
  // highlight-getGlobalBoundingBoxY
  const globalY = engine.block.getGlobalBoundingBoxY(block);
  // highlight-getGlobalBoundingBoxWidth
  const globalWidth = engine.block.getGlobalBoundingBoxWidth(block);
  // highlight-getGlobalBoundingBoxHeight
  const globalHeight = engine.block.getGlobalBoundingBoxHeight(block);

  // highlight-referencesAnyVariables
  const referencesVariables = engine.block.referencesAnyVariables(block);

  // highlight-export
  const blob = await engine.block.export(scene, 'image/png');
});
