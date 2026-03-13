import { useEditor } from '../../EditorContext';

import ShapeSelect from '../ShapeSelect/ShapeSelect';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const AddShapeSecondary = ({ onClose }) => {
  const { engine } = useEditor();

  const addShape = (asset) => {
    engine.asset.apply('ly.img.vectorpath', asset);
  };

  return (
    <SlideUpPanel
      isExpanded={true}
      onExpandedChanged={(value) => !value && onClose()}
    >
      <SlideUpPanelHeader headline="Add Shape"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ShapeSelect onClick={(asset) => addShape(asset)} />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddShapeSecondary;
