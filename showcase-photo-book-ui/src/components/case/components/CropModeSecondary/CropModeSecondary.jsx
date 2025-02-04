import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';

import { ReactComponent as CheckmarkIcon } from '../../icons/Checkmark.svg';
import { ReactComponent as ResetIcon } from '../../icons/Reset.svg';
import { useEngine } from '../../lib/EngineContext';

const CropModeSecondary = () => {
  const { engine } = useEngine();

  const resetCurrentCrop = () => {
    const allSelectedImageElements = engine.block.findAllSelected();
    allSelectedImageElements.forEach((imageElementId) => {
      engine.block.resetCrop(imageElementId);
    });
  };

  return (
    <AdjustmentsBar>
      <AdjustmentsBarButton
        onClick={() => engine.editor.setEditMode('Transform')}
      >
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
