import { useMemo, useState } from 'react';
import { ReactComponent as AppearanceIcon } from '../../icons/Appearance.svg';
import { ReactComponent as TextIcon } from '../../icons/Text.svg';
import { ReactComponent as TextAlignMiddleIcon } from '../../icons/TextAlignCenter.svg';
import AlignmentSelect from '../AlignmentSelect/AlignmentSelect';
import ChangeFontSecondary from '../ChangeFontSecondary/ChangeFontSecondary';
import ChangeTextColorSecondary from '../ChangeTextColorSecondary/ChangeTextColorSecondary';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import IconButton from '../IconButton/IconButton';

const ALL_ADJUSTMENTS = [
  {
    component: <ChangeTextColorSecondary />,
    Icon: AppearanceIcon,
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
    component: <AlignmentSelect />,
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
    <div className="align-center gap-xs flex flex-col">
      <div>{selectedAdjustmentId && AdjustmentComponent}</div>

      <div className="gap-md flex justify-center">
        <div className="gap-xs flex">
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
export default TextAdjustmentsBar;
