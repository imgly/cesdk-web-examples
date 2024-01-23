import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

import StickerSelect from '../StickerSelect/StickerSelect';
import StickerSelectFilter from '../StickerSelect/StickerSelectFilter';

const AddStickerSecondary = ({ onClose }) => {
  const [group, setGroup] = useState();
  const { engine } = useEditor();

  const addSticker = (asset) => {
    engine.asset.apply('ly.img.sticker', asset);
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
