import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import { autoPlaceBlockOnPage } from '../../lib/CreativeEngineUtils';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

import StickerSelect from '../StickerSelect/StickerSelect';
import StickerSelectFilter from '../StickerSelect/StickerSelectFilter';

const AddStickerSecondary = ({ onClose }) => {
  const [group, setGroup] = useState();
  const { creativeEngine, currentPageBlockId } = useEditor();

  const addSticker = (stickerURI) => {
    const block = creativeEngine.block.create('sticker');
    creativeEngine.block.setString(block, 'sticker/imageFileURI', stickerURI);
    const pageWidth = creativeEngine.block.getWidth(currentPageBlockId);
    creativeEngine.block.setHeightMode(block, 'Absolute');
    creativeEngine.block.setHeight(block, pageWidth * 0.5);
    creativeEngine.block.setWidthMode(block, 'Absolute');
    creativeEngine.block.setWidth(block, pageWidth * 0.5);
    autoPlaceBlockOnPage(creativeEngine, currentPageBlockId, block);
  };

  return (
    <SlideUpPanel isExpanded onExpandedChanged={(value) => !value && onClose()}>
      <SlideUpPanelHeader headline="Add Sticker">
        <StickerSelectFilter
          currentGroup={group}
          onChange={(group) => setGroup(group)}
        />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <StickerSelect group={group} onClick={(type) => addSticker(type)} />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddStickerSecondary;
