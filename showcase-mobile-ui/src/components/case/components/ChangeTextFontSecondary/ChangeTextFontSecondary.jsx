import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import FontSelect from '../FontSelect/FontSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const getTypeface = (engine) => {
  try {
    return engine.block.getTypeface(engine.block.findAllSelected()[0]);
  } catch {
    console.error('Error getting typeface');
    return null;
  }
};

const ChangeTextFontSecondary = () => {
  const { engine } = useEditor();
  const [activeTypeface, setActiveTypeface] = useState(getTypeface(engine));

  return (
    <>
      <SlideUpPanelHeader headline="Font"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <FontSelect
          onSelect={(font, typeface) => {
            engine.block.findAllSelected().forEach((block) => {
              engine.block.setFont(block, font.uri, typeface);
            });
            setActiveTypeface(typeface);
          }}
          activeTypeface={activeTypeface}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeTextFontSecondary;
