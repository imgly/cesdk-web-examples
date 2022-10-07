import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import FontSelect from '../FontSelect/FontSelect';
import FontSelectFilter from '../FontSelect/FontSelectFilter';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const AddTextSecondary = ({ onClose }) => {
  const {
    customEngine: { addText }
  } = useEditor();

  const [fontFilterGroup, setFontFilterGroup] = useState();

  return (
    <SlideUpPanel isExpanded onExpandedChanged={(value) => !value && onClose()}>
      <SlideUpPanelHeader headline="Add Text">
        <FontSelectFilter onChange={(value) => setFontFilterGroup(value)} />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <FontSelect
          fontFilter={({ group }) =>
            !fontFilterGroup || fontFilterGroup === group
          }
          onSelect={(font) => addText(font)}
        />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddTextSecondary;
