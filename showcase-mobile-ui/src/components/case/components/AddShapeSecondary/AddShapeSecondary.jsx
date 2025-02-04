import { useEditor } from '../../EditorContext';
import { autoPlaceBlockOnPage } from '../../lib/CreativeEngineUtils';

import ShapeSelect from '../ShapeSelect/ShapeSelect';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const AddShapeSecondary = ({ onClose }) => {
  const { creativeEngine, currentPageBlockId } = useEditor();

  const addShape = (shapeBlockType, properties = {}) => {
    const block = creativeEngine.block.create(shapeBlockType);
    const pageWidth = creativeEngine.block.getWidth(currentPageBlockId);
    creativeEngine.block.setHeightMode(block, 'Absolute');
    creativeEngine.block.setHeight(block, pageWidth * 0.5);
    creativeEngine.block.setWidthMode(block, 'Absolute');
    creativeEngine.block.setWidth(block, pageWidth * 0.5);
    // Set default parameters for some shape types
    // When we add a polygon, we add a triangle
    if (shapeBlockType === 'shapes/polygon') {
      creativeEngine.block.setInt(block, 'shapes/polygon/sides', 3);
    }
    // When we add a line, we need to resize the height again
    else if (shapeBlockType === 'shapes/star') {
      creativeEngine.block.setFloat(block, 'shapes/star/innerDiameter', 0.4);
    }
    Object.entries(properties).forEach(([key, value]) => {
      creativeEngine.block.setString(block, key, value);
    });
    autoPlaceBlockOnPage(creativeEngine, currentPageBlockId, block);

    // Workaround: To set a rotation, the block currently has to be attached to a scene
    if (shapeBlockType === 'shapes/line') {
      creativeEngine.block.setRotation(block, -Math.PI / 4);
      creativeEngine.block.setHeightMode(block, 'Absolute');
      creativeEngine.block.setHeight(
        block,
        creativeEngine.block.getWidth(block) * 0.05
      );
    }
  };

  return (
    <SlideUpPanel
      isExpanded={true}
      onExpandedChanged={(value) => !value && onClose()}
    >
      <SlideUpPanelHeader headline="Add Shape"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ShapeSelect
          onClick={({ type, properties }) => addShape(type, properties)}
        />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddShapeSecondary;
