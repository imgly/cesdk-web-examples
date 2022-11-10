import { useMemo, useState } from 'react';
import ChangeShapeColorSecondary from '../ChangeShapeColorSecondary/ChangeShapeColorSecondary';

import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import DockMenu from '../DockMenu/DockMenu';
import IconButton from '../IconButton/IconButton';
import ShapeColorIcon from '../ShapeColorIcon/ShapeColorIcon';

const ALL_ADJUSTMENTS = {
  replace: {
    component: <ChangeShapeColorSecondary />,
    Icon: <ShapeColorIcon />,
    label: 'Color',
    id: ''
  }
};
const ShapesAdjustmentBar = () => {
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
export default ShapesAdjustmentBar;
