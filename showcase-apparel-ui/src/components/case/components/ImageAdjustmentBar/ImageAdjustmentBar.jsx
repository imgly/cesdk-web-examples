import { useEffect, useMemo, useState } from 'react';
import { caseAssetPath } from '../../util';
import ChangeImageFileSecondary from '../ChangeImageFileSecondary/ChangeImageFileSecondary';

import ReplaceIcon from '../../icons/Replace.svg';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import IconButton from '../IconButton/IconButton';
import { useEditor } from '../../EditorContext';

export const ALL_IMAGES = [
  caseAssetPath('/images/image2.svg'),
  caseAssetPath('/images/image1.svg'),
  caseAssetPath('/images/image4.svg'),
  caseAssetPath('/images/image3.svg')
];

const ALL_ADJUSTMENTS = {
  replace: {
    component: <ChangeImageFileSecondary />,
    Icon: <ReplaceIcon />,
    label: 'Replace',
    id: 'replace'
  }
};
const ImageAdjustmentBar = () => {
  const { selectedImageProperties } = useEditor();
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState();

  const AdjustmentComponent = useMemo(
    () => ALL_ADJUSTMENTS[selectedAdjustmentId]?.component || null,
    [selectedAdjustmentId]
  );

  useEffect(() => {
    if (
      selectedImageProperties['placeholderControlsButtonEnabled'] ||
      selectedImageProperties['placeholderControlsOverlayEnabled']
    ) {
      setSelectedAdjustmentId('replace');
    }
  }, [selectedImageProperties]);

  return (
    <div className="align-center gap-sm flex flex-col">
      <div>{selectedAdjustmentId && AdjustmentComponent}</div>

      <div className="gap-sm flex justify-center">
        <div className="gap-xs flex">
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
export default ImageAdjustmentBar;
