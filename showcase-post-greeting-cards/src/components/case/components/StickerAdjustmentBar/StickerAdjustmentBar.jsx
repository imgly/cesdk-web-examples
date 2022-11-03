import { useMemo, useState } from 'react';
import ChangeStickerFileSecondary from '../ChangeStickerFileSecondary/ChangeStickerFileSecondary';

import { ReactComponent as ReplaceIcon } from '../../icons/Replace.svg';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import IconButton from '../IconButton/IconButton';
import DockMenu from '../DockMenu/DockMenu';

const ALL_ADJUSTMENTS = {
  replace: {
    component: <ChangeStickerFileSecondary />,
    Icon: <ReplaceIcon />,
    label: 'Replace',
    id: ''
  }
};
const StickerAdjustmentBar = () => {
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState();

  const AdjustmentComponent = useMemo(
    () => ALL_ADJUSTMENTS[selectedAdjustmentId]?.component || null,
    [selectedAdjustmentId]
  );

  return (
    <>
      {selectedAdjustmentId && AdjustmentComponent}
      <DockMenu>
        {Object.entries(ALL_ADJUSTMENTS).map(([id, { label, Icon }]) => (
          <IconButton
            key={id}
            onClick={() =>
              setSelectedAdjustmentId(
                selectedAdjustmentId !== id ? id : undefined
              )
            }
            icon={Icon}
            isActive={
              selectedAdjustmentId === undefined || selectedAdjustmentId === id
            }
          >
            {label}
          </IconButton>
        ))}
        <DeleteSelectedButton isActive={selectedAdjustmentId === undefined} />
      </DockMenu>
    </>
  );
};
export default StickerAdjustmentBar;
