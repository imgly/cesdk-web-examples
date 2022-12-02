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
  const { creativeEngine, currentPageBlockId } = useEditor();

  const addText = (fontFileUri) => {
    const block = creativeEngine.block.create('text');
    creativeEngine.block.setString(block, 'text/fontFileUri', fontFileUri);
    creativeEngine.block.setFloat(block, 'text/fontSize', 40);
    creativeEngine.block.setEnum(block, 'text/horizontalAlignment', 'Center');
    creativeEngine.block.setHeightMode(block, 'Auto');
    const pageWidth = creativeEngine.block.getWidth(currentPageBlockId);
    creativeEngine.block.setWidth(block, pageWidth * 0.5);
    autoPlaceBlockOnPage(creativeEngine, currentPageBlockId, block);
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
