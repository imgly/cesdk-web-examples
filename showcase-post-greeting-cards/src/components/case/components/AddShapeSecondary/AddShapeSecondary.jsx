import { useEditor } from '../../EditorContext';
import { autoPlaceBlockOnPage } from '../../lib/CreativeEngineUtils';

import ShapesBar from '../ShapesBar/ShapesBar';

const AddShapeSecondary = () => {
  const { creativeEngine, currentPageBlockId } = useEditor();

  const addShape = (shapeBlockType) => {
    const block = creativeEngine.block.create(shapeBlockType);

    const pageWidth = creativeEngine.block.getWidth(currentPageBlockId);
    creativeEngine.block.setHeightMode(block, 'Absolute');
    creativeEngine.block.setHeight(block, pageWidth * 0.25);
    creativeEngine.block.setWidthMode(block, 'Absolute');
    creativeEngine.block.setWidth(block, pageWidth * 0.25);
    // Set default parameters for some shape types
    // When we add a polygon, we add a triangle
    if (shapeBlockType === 'shapes/polygon') {
      creativeEngine.block.setInt(block, 'shapes/polygon/sides', 3);
    }
    // When we add a line, we need to resize the height again
    else if (shapeBlockType === 'shapes/line') {
      creativeEngine.block.setHeightMode(block, 'Absolute');
      creativeEngine.block.setHeight(block, 1);
    } else if (shapeBlockType === 'shapes/star') {
      creativeEngine.block.setFloat(block, 'shapes/star/innerDiameter', 0.4);
    }
    autoPlaceBlockOnPage(creativeEngine, currentPageBlockId, block);
    // Workaround: To set a rotation, the block currently has to be attached to a scene
    if (shapeBlockType === 'shapes/line') {
      creativeEngine.block.setRotation(block, -Math.PI / 4);
    }
  };

  return <ShapesBar onClick={(type) => addShape(type)} />;
};
export default AddShapeSecondary;
