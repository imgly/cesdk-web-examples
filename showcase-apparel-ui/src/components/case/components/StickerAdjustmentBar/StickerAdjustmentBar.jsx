import { useMemo, useState } from 'react';
import ChangeStickerFileSecondary from '../ChangeStickerFileSecondary/ChangeStickerFileSecondary';

import { ReactComponent as ReplaceIcon } from '../../icons/Replace.svg';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import IconButton from '../IconButton/IconButton';

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
    <div className="align-center gap-xs flex flex-col">
      <div>{selectedAdjustmentId && AdjustmentComponent}</div>

      <div className="gap-md flex justify-center">
        <div className="gap-sm flex">
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
                selectedAdjustmentId === undefined ||
                selectedAdjustmentId === id
              }
            >
              {label}
            </IconButton>
          ))}
        </div>
        <div>
          <DeleteSelectedButton isActive={selectedAdjustmentId === undefined} />
        </div>
      </div>
    </div>
  );
};
export default StickerAdjustmentBar;
