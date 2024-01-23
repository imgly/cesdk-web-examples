import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import { autoPlaceBlockOnPage } from '../../lib/CreativeEngineUtils';
import FontSelect from '../FontSelect/FontSelect';
import FontSelectFilter from '../FontSelect/FontSelectFilter';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const AddTextSecondary = ({ onClose }) => {
  const { engine, currentPageBlockId } = useEditor();

  const addText = (fontFileUri) => {
    const block = engine.block.create('text');
    engine.block.setString(block, 'text/fontFileUri', fontFileUri);
    engine.block.setFloat(block, 'text/fontSize', 40);
    engine.block.setEnum(block, 'text/horizontalAlignment', 'Center');
    engine.block.setHeightMode(block, 'Auto');
    const pageWidth = engine.block.getWidth(currentPageBlockId);
    engine.block.setWidth(block, pageWidth * 0.5);
    autoPlaceBlockOnPage(engine, currentPageBlockId, block);
  };

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
