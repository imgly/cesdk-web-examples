import { useMemo, useState } from 'react';
import ChangeStickerFileSecondary from '../ChangeStickerFileSecondary/ChangeStickerFileSecondary';

import { ReactComponent as ReplaceIcon } from '../../icons/Replace.svg';
import SlideUpPanel from '../SlideUpPanel/SlideUpPanel';
import InspectorBar from '../InspectorBar/InspectorBar';

const ALL_ADJUSTMENTS = [
  {
    Body: ChangeStickerFileSecondary,
    Icon: ReplaceIcon,
    id: 'replace'
  }
];
const StickerAdjustmentBar = () => {
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState();

  const selectedAdjustment = useMemo(
    () => ALL_ADJUSTMENTS.find(({ id }) => selectedAdjustmentId === id),
    [selectedAdjustmentId]
  );

  const AdjustmentComponent = useMemo(() => {
    if (selectedAdjustment) {
      return selectedAdjustment.Body;
    }
  }, [selectedAdjustment]);

  return (
    <SlideUpPanel
      defaultHeadline={'Sticker'}
      isExpanded={!!selectedAdjustmentId}
      onExpandedChanged={(value) => !value && setSelectedAdjustmentId()}
      InspectorBar={
        <InspectorBar
          activeAdjustmentId={selectedAdjustmentId}
          onAdjustmentChange={(newAdjustmentId) =>
            setSelectedAdjustmentId(newAdjustmentId)
          }
          adjustments={ALL_ADJUSTMENTS}
        />
      }
    >
      {AdjustmentComponent && <AdjustmentComponent />}
    </SlideUpPanel>
  );
};
export default StickerAdjustmentBar;
