import { useState } from 'react';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import FontSelect from '../FontSelect/FontSelect';
import FontSelectFilter from '../FontSelect/FontSelectFilter';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const ChangeTextFontSecondary = () => {
  const [fontFileUri, setFontFileUri] = useSelectedProperty('text/fontFileUri');

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
          onSelect={(fontUri) => setFontFileUri(fontUri)}
          activeFontUri={fontFileUri}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeTextFontSecondary;
