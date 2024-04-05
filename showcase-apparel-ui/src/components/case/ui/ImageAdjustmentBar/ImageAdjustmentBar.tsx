import { useEffect, useMemo, useState } from 'react';
import { ReactComponent as CropIcon } from '../../icons/Crop.svg';
import { ReactComponent as ReplaceIcon } from '../../icons/Replace.svg';
import { useEngine } from '../../lib/EngineContext';
import { useEditMode } from '../../lib/UseEditMode';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import ChangeImageFileSecondary from '../ChangeImageFileSecondary/ChangeImageFileSecondary';
import CropModeSecondary from '../CropModeSecondary/CropModeSecondary';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import DockMenu from '../DockMenu/DockMenu';
import IconButton from '../IconButton/IconButton';
import DockMenuGroup from '../DockMenuGroup/DockMenuGroup';

const ALL_ADJUSTMENTS = {
  replace: {
    component: <ChangeImageFileSecondary />
  },
  crop: {
    component: <CropModeSecondary />
  }
};

const ImageAdjustmentBar = () => {
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState<
    null | keyof typeof ALL_ADJUSTMENTS
  >(null);
  const { engine } = useEngine();
  const { editMode } = useEditMode({ engine });
  const [showsPlaceholderOverlay] = useSelectedProperty('placeholder/enabled');
  const calculatedAdjustmentId = useMemo(
    () => (editMode === 'Crop' ? 'crop' : selectedAdjustmentId),
    [editMode, selectedAdjustmentId]
  );

  const selectedAdjustment = useMemo(
    // @ts-ignore
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
        <DockMenuGroup>
          <IconButton
            key="replace"
            // Disable cropping on placeholders
            onClick={() => {
              if (calculatedAdjustmentId === 'replace') {
                setSelectedAdjustmentId(null);
              } else {
                setSelectedAdjustmentId('replace');
                engine.editor.setEditMode('Transform');
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
            // @ts-ignore
            disabled={showsPlaceholderOverlay}
            onClick={() => {
              if (calculatedAdjustmentId === 'crop') {
                engine.editor.setEditMode('Transform');
              } else {
                setSelectedAdjustmentId(null);
                engine.editor.setEditMode('Crop');
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
        </DockMenuGroup>
        <DockMenuGroup>
          <DeleteSelectedButton
            isActive={calculatedAdjustmentId === undefined}
          />
        </DockMenuGroup>
      </DockMenu>
    </>
  );
};
export default ImageAdjustmentBar;
