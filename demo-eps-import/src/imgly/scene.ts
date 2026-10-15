import type CreativeEngine from '@cesdk/engine';
import type { RGBAColor } from '@cesdk/engine';

export const ARTWORK_FRAME = { x: 54, y: 180, width: 360, height: 240 };

export function createTemplate(engine: CreativeEngine) {
  const scene = engine.scene.create('VerticalStack', {
    designUnit: 'Pixel',
    page: { size: { width: 468, height: 648 } }
  });
  engine.block.setFloat(scene, 'scene/dpi', 72);
  engine.block.setName(scene, 'EPS artwork study');
  const page = engine.block.findByType('page')[0];
  engine.block.setName(page, 'Artwork layout');
  const ink = { r: 0.09, g: 0.09, b: 0.1, a: 1 };
  const cyan = { r: 0, g: 0.68, b: 0.93, a: 1 };

  rectangle(
    engine,
    page,
    { x: 0, y: 0, width: 468, height: 100 },
    ink,
    'Header'
  );
  rectangle(
    engine,
    page,
    { x: 54, y: 47, width: 130, height: 8 },
    cyan,
    'Header accent'
  );
  rectangle(
    engine,
    page,
    { x: 54, y: 64, width: 82, height: 5 },
    { r: 1, g: 1, b: 1, a: 1 },
    'Header detail'
  );
  const placeholder = rectangle(
    engine,
    page,
    ARTWORK_FRAME,
    { r: 0.91, g: 0.9, b: 0.94, a: 1 },
    'Artwork'
  );
  engine.block.setPlaceholderEnabled(placeholder, true);
  engine.block.setMetadata(placeholder, 'eps-demo/slot', 'artwork');
  rectangle(
    engine,
    page,
    { x: 54, y: 466, width: 208, height: 12 },
    ink,
    'Layout headline'
  );
  for (let row = 0; row < 4; row += 1) {
    rectangle(
      engine,
      page,
      { x: 54, y: 500 + row * 14, width: row === 3 ? 192 : 320, height: 4 },
      { r: 0.72, g: 0.7, b: 0.75, a: 1 },
      `Layout line ${row + 1}`
    );
  }
  rectangle(
    engine,
    page,
    { x: 54, y: 590, width: 360, height: 2 },
    cyan,
    'Footer rule'
  );
  engine.editor.addUndoStep();
  return { page, placeholder };
}

function rectangle(
  engine: CreativeEngine,
  parent: number,
  frame: { x: number; y: number; width: number; height: number },
  color: RGBAColor,
  name: string
) {
  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('rect'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', color);
  engine.block.setFill(block, fill);
  engine.block.setStrokeEnabled(block, false);
  engine.block.setName(block, name);
  engine.block.setPositionXMode(block, 'Absolute');
  engine.block.setPositionYMode(block, 'Absolute');
  engine.block.setWidthMode(block, 'Absolute');
  engine.block.setHeightMode(block, 'Absolute');
  engine.block.setPositionX(block, frame.x);
  engine.block.setPositionY(block, frame.y);
  engine.block.setWidth(block, frame.width);
  engine.block.setHeight(block, frame.height);
  engine.block.appendChild(parent, block);
  return block;
}
