import { useEditor } from '../../EditorContext';

import ShapeSelect from '../ShapeSelect/ShapeSelect';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const AddShapeSecondary = ({ onClose }) => {
  const {
    customEngine: { addShape }
  } = useEditor();

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
