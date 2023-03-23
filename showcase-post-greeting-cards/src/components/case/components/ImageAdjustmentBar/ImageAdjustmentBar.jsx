import { useEffect, useMemo, useState } from 'react';
import ChangeImageFileSecondary from '../ChangeImageFileSecondary/ChangeImageFileSecondary';

import { useEditor } from '../../EditorContext';
import { ReactComponent as CropIcon } from '../../icons/Crop.svg';
import { ReactComponent as ReplaceIcon } from '../../icons/Replace.svg';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import CropModeSecondary from '../CropModeSecondary/CropModeSecondary';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import DockMenu from '../DockMenu/DockMenu';
import IconButton from '../IconButton/IconButton';

const ALL_ADJUSTMENTS = {
  replace: {
    component: <ChangeImageFileSecondary />
  },
  crop: {
    component: <CropModeSecondary />
  }
};
const ImageAdjustmentBar = () => {
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState();
  const { editMode, creativeEngine } = useEditor();
  const [showsPlaceholderOverlay] = useSelectedProperty(
    'placeholderControls/showOverlay'
  );
  const calculatedAdjustmentId = useMemo(
    () => (editMode === 'Crop' ? 'crop' : selectedAdjustmentId),
    [editMode, selectedAdjustmentId]
  );

  const selectedAdjustment = useMemo(
    () => ALL_ADJUSTMENTS[calculatedAdjustmentId],
    [calculatedAdjustmentId]
  );
  const AdjustmentComponent = useMemo(() => {
    if (selectedAdjustment) {
      return selectedAdjustment.component;
    }
  }, [selectedAdjustment]);

  useEffect(() => {
    if (showsPlaceholderOverlay) {
      setSelectedAdjustmentId('replace');
    }
  }, [showsPlaceholderOverlay]);

  return (
    <>
      {calculatedAdjustmentId && AdjustmentComponent}
      <DockMenu>
        <IconButton
          key="replace"
          // Disable cropping on placeholders
          onClick={() => {
            if (calculatedAdjustmentId === 'replace') {
              setSelectedAdjustmentId();
            } else {
              setSelectedAdjustmentId('replace');
              creativeEngine.editor.setEditMode('Transform');
            }
          }}
          icon={<ReplaceIcon />}
          isActive={
            calculatedAdjustmentId === undefined ||
            calculatedAdjustmentId === 'replace'
          }
        >
          Replace
        </IconButton>
        <IconButton
          key="crop"
          // Disable cropping on placeholders
          disabled={showsPlaceholderOverlay}
          onClick={() => {
            if (calculatedAdjustmentId === 'crop') {
              creativeEngine.editor.setEditMode('Transform');
            } else {
              setSelectedAdjustmentId();
              creativeEngine.editor.setEditMode('Crop');
            }
          }}
          icon={<CropIcon />}
          isActive={
            calculatedAdjustmentId === undefined ||
            calculatedAdjustmentId === 'crop'
          }
        >
          Crop
        </IconButton>

        <DeleteSelectedButton isActive={calculatedAdjustmentId === undefined} />
      </DockMenu>
    </>
  );
};
export default ImageAdjustmentBar;
