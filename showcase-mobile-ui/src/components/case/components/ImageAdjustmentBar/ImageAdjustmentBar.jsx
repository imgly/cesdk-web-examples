import { useMemo, useState } from 'react';
import ChangeImageFileSecondary from '../ChangeImageFileSecondary/ChangeImageFileSecondary';

import { useEditor } from '../../EditorContext';
import { ReactComponent as CropIcon } from '../../icons/Crop.svg';
import { ReactComponent as ReplaceIcon } from '../../icons/Replace.svg';
import ChangeCropSecondary from '../ChangeCropSecondary/ChangeCropSecondary';
import InspectorBar from '../InspectorBar/InspectorBar';
import SlideUpPanel from '../SlideUpPanel/SlideUpPanel';

const ALL_ADJUSTMENTS = [
  {
    Body: ChangeCropSecondary,
    Icon: CropIcon,
    id: 'crop'
  },
  {
    Body: ChangeImageFileSecondary,
    Icon: ReplaceIcon,
    id: 'replace',
    align: 'left'
  }
];

const ImageAdjustmentBar = () => {
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState();
  const { editMode, engine } = useEditor();

  const calculatedAdjustmentId = useMemo(
    () => (editMode === 'Crop' ? 'crop' : selectedAdjustmentId),
    [editMode, selectedAdjustmentId]
  );

  const selectedAdjustment = useMemo(
    () => ALL_ADJUSTMENTS.find(({ id }) => calculatedAdjustmentId === id),
    [calculatedAdjustmentId]
  );
  const AdjustmentComponent = useMemo(() => {
    if (selectedAdjustment) {
      return selectedAdjustment.Body;
    }
  }, [selectedAdjustment]);

  return (
    <SlideUpPanel
      defaultHeadline="Image"
      isExpanded={!!calculatedAdjustmentId}
      onExpandedChanged={(value) => {
        if (!value) {
          engine.editor.setEditMode('Transform');
          setSelectedAdjustmentId();
        }
      }}
      InspectorBar={
        <InspectorBar
          activeAdjustmentId={calculatedAdjustmentId}
          onAdjustmentChange={(newAdjustmentId) => {
            if (newAdjustmentId === 'crop') {
              setSelectedAdjustmentId();
              engine.editor.setEditMode('Crop');
            } else {
              setSelectedAdjustmentId(newAdjustmentId);
              engine.editor.setEditMode('Transform');
            }
          }}
          adjustments={ALL_ADJUSTMENTS}
        />
      }
    >
      {AdjustmentComponent && (
        <AdjustmentComponent onClose={() => setSelectedAdjustmentId()} />
      )}
    </SlideUpPanel>
  );
};
export default ImageAdjustmentBar;
