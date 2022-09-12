import { useEditor } from '../../EditorContext';
import AlignmentSelect from '../AlignmentSelect/AlignmentSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const ChangeTextAlignmentSecondary = () => {
  const {
    selectedTextProperties,
    customEngine: { changeTextAlignment }
  } = useEditor();

  return (
    <>
      <SlideUpPanelHeader headline="Align"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <AlignmentSelect
          onClick={(value) => changeTextAlignment(value)}
          activeAlignment={selectedTextProperties['text/horizontalAlignment']}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeTextAlignmentSecondary;
