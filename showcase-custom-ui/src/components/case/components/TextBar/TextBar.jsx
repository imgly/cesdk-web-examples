import { useMemo, useState } from 'react';
import { ReactComponent as AppearanceIcon } from '../../icons/Appearance.svg';
import { ReactComponent as TextIcon } from '../../icons/Text.svg';
import { ReactComponent as TextAlignMiddleIcon } from '../../icons/TextAlignCenter.svg';
import AlignmentSelect from '../AlignmentSelect/AlignmentSelect';
import ColorSelect from '../ColorSelect/ColorSelect';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import FontSelect from '../FontSelect/FontSelect';
import IconButton from '../IconButton/IconButton';

const ALL_ADJUSTMENTS = [
  {
    component: <ColorSelect />,
    Icon: AppearanceIcon,
    label: 'Color',
    id: 'color'
  },
  {
    component: <FontSelect />,
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

const TextBar = () => {
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
    <div className="align-center flex flex-col">
      <div>{selectedAdjustmentId && AdjustmentComponent}</div>

      <div className="flex justify-center gap-6">
        <div className="flex">
          {ALL_ADJUSTMENTS.map(({ label, id, Icon }) => (
            <IconButton
              key={id}
              onClick={() => setSelectedAdjustmentId(id)}
              icon={<Icon />}
              isActive={selectedAdjustmentId === id}
            >
              {label}
            </IconButton>
          ))}
        </div>
        <div>
          <DeleteSelectedButton />
        </div>
      </div>
    </div>
  );
};
export default TextBar;
