import { useMemo, useState } from 'react';
import InspectorBar from '../InspectorBar/InspectorBar';
import SlideUpPanel from '../SlideUpPanel/SlideUpPanel';

const ALL_ADJUSTMENTS = [];
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
