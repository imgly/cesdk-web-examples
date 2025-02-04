import { useMemo, useState } from 'react';
import { ReactComponent as TextIcon } from '../../icons/Text.svg';
import { ReactComponent as TextAlignMiddleIcon } from '../../icons/TextAlignCenter.svg';
import ChangeFontSecondary from '../ChangeFontSecondary/ChangeFontSecondary';
import ChangeTextAlignmentSecondary from '../ChangeTextAlignmentSecondary/ChangeTextAlignmentSecondary';
import ChangeTextColorSecondary from '../ChangeTextColorSecondary/ChangeTextColorSecondary';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import DockMenu from '../DockMenu/DockMenu';
import IconButton from '../IconButton/IconButton';
import TextColorIcon from '../TextColorIcon/TextColorIcon';

const ALL_ADJUSTMENTS = [
  {
    component: <ChangeTextColorSecondary />,
    Icon: TextColorIcon,
    label: 'Color',
    id: 'color'
  },
  {
    component: <ChangeFontSecondary />,
    Icon: TextIcon,
    label: 'Font',
    id: 'font'
  },
  {
    component: <ChangeTextAlignmentSecondary />,
    Icon: TextAlignMiddleIcon,
    label: 'Align',
    id: 'align'
  }
];

const TextAdjustmentsBar = () => {
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState();

  const AdjustmentComponent = useMemo(() => {
    const selectedAdjustment = ALL_ADJUSTMENTS.find(
      ({ id }) => selectedAdjustmentId === id
    );
    if (selectedAdjustment) {
      return selectedAdjustment.component;
    }
  }, [selectedAdjustmentId]);

  return (
    <>
      {selectedAdjustmentId && AdjustmentComponent}

      <DockMenu>
        {ALL_ADJUSTMENTS.map(({ label, id, Icon }) => (
          <IconButton
            key={id}
            onClick={() =>
              setSelectedAdjustmentId(
                selectedAdjustmentId !== id ? id : undefined
              )
            }
            icon={<Icon />}
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
export default TextAdjustmentsBar;
