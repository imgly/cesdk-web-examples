import { useState } from 'react';
import { useEditor } from '../../EditorContext';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import StickerSelect from '../StickerSelect/StickerSelect';
import StickerSelectFilter from '../StickerSelect/StickerSelectFilter';

const ChangeStickerFileSecondary = () => {
  const [group, setGroup] = useState();
  const {
    customEngine: { changeStickerFile }
  } = useEditor();

  return (
    <>
      <SlideUpPanelHeader headline="Replace">
        <StickerSelectFilter
          currentGroup={group}
          onChange={(group) => setGroup(group)}
        />{' '}
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <StickerSelect
          group={group}
          onClick={(color) => changeStickerFile(color)}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeStickerFileSecondary;
