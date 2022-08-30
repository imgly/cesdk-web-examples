import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import FontSelect from '../FontSelect/FontSelect';
import FontSelectFilter from '../FontSelect/FontSelectFilter';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const ChangeTextFontSecondary = () => {
  const {
    selectedTextProperties,
    customEngine: { changeTextFont }
  } = useEditor();

  const [fontFilterGroup, setFontFilterGroup] = useState();

  return (
    <>
      <SlideUpPanelHeader headline="Font">
        <FontSelectFilter onChange={(value) => setFontFilterGroup(value)} />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <FontSelect
          fontFilter={({ group }) =>
            !fontFilterGroup || fontFilterGroup === group
          }
          onSelect={(fontUri) => changeTextFont(fontUri)}
          activeFontUri={selectedTextProperties?.['text/fontFileUri']}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeTextFontSecondary;
