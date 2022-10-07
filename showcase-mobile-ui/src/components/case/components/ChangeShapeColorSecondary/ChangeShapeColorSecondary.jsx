import { useEditor } from '../../EditorContext';
import ColorSelect from '../ColorSelect/ColorSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const ChangeShapeColorSecondary = () => {
  const {
    selectedShapeProperties,
    customEngine: { changeShapeColor }
  } = useEditor();

  return (
    <>
      <SlideUpPanelHeader headline="Color"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ColorSelect
          onClick={(color) => changeShapeColor(color)}
          activeColor={selectedShapeProperties['fill/solid/color']}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeShapeColorSecondary;
