import { useEffect, useMemo, useState } from 'react';
import { useEditor } from '../../EditorContext';
import { caseAssetPath } from '../../util';
import ChangeShapeColorSecondary from '../ChangeShapeColorSecondary/ChangeShapeColorSecondary';

import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import IconButton from '../IconButton/IconButton';
import ShapeColorIcon from '../ShapeColorIcon/ShapeColorIcon';

export const ALL_IMAGES = [
  caseAssetPath('/images/image2.svg'),
  caseAssetPath('/images/image1.svg'),
  caseAssetPath('/images/image4.svg'),
  caseAssetPath('/images/image3.svg')
];

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

  const {
    editorState: { editMode }
  } = useEditor();

  useEffect(() => {
    if (editMode === 'Transform' && selectedAdjustmentId === 'crop') {
      setSelectedAdjustmentId();
    }
    if (editMode === 'Crop' && selectedAdjustmentId !== 'crop') {
      setSelectedAdjustmentId('crop');
    }
  }, [editMode, selectedAdjustmentId]);

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
export default ShapesAdjustmentBar;
