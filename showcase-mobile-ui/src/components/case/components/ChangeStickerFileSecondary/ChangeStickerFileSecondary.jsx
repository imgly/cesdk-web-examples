import { useState } from 'react';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import StickerSelect from '../StickerSelect/StickerSelect';
import StickerSelectFilter from '../StickerSelect/StickerSelectFilter';

const ChangeStickerFileSecondary = () => {
  const [group, setGroup] = useState();
  // eslint-disable-next-line no-unused-vars
  const [_imageFileURI, setImageFileURI] = useSelectedProperty(
    'sticker/imageFileURI'
  );

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
          onClick={(stickerUri) => setImageFileURI(stickerUri)}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeStickerFileSecondary;
