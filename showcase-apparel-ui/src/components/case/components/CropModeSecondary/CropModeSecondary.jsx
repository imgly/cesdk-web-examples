import { useEffect } from 'react';
import { useEditor } from '../../EditorContext';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';

import CheckmarkIcon from '../../icons/Checkmark.svg';
import ResetIcon from '../../icons/Reset.svg';

const CropModeSecondary = () => {
  const {
    customEngine: { setEditMode, resetCurrentCrop }
  } = useEditor();

  useEffect(() => {
    setEditMode('Crop');
  }, [setEditMode]);

  return (
    <AdjustmentsBar>
      <AdjustmentsBarButton onClick={() => setEditMode('Transform')}>
        <span>
          <CheckmarkIcon style={{ color: 'green' }} />
        </span>
        <span>Done</span>
      </AdjustmentsBarButton>
      <AdjustmentsBarButton onClick={() => resetCurrentCrop()}>
        <span>
          <ResetIcon />
        </span>
        <span>Reset</span>
      </AdjustmentsBarButton>
    </AdjustmentsBar>
  );
};
export default CropModeSecondary;
