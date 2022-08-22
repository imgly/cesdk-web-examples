import { useEditor } from '../../EditorContext';
import ColorSelect from '../ColorSelect/ColorSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const ChangeTextColorSecondary = () => {
  const {
    selectedTextProperties,
    customEngine: { changeTextColor }
  } = useEditor();

  return (
    <>
      <SlideUpPanelHeader headline="Color"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ColorSelect
          onClick={(color) => changeTextColor(color)}
          activeColor={selectedTextProperties['fill/color']}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeTextColorSecondary;
