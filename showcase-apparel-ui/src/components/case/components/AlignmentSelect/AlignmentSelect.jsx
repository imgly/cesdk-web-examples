import { useEditor } from '../../EditorContext';
import { ReactComponent as TextAlignCenterIcon } from '../../icons/TextAlignCenter.svg';
import { ReactComponent as TextAlignLeftIcon } from '../../icons/TextAlignLeft.svg';
import { ReactComponent as TextAlignRightIcon } from '../../icons/TextAlignRight.svg';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';

const ALL_ALIGNMENTS = [
  {
    value: 'Left',
    Icon: <TextAlignLeftIcon />
  },
  {
    value: 'Center',
    Icon: <TextAlignCenterIcon />
  },
  {
    value: 'Right',
    Icon: <TextAlignRightIcon />
  }
];

const AlignmentSelect = () => {
  const {
    selectedTextProperties,
    customEngine: { changeTextAlignment }
  } = useEditor();

  return (
    <AdjustmentsBar>
      {ALL_ALIGNMENTS.map(({ value, Icon }) => (
        <AdjustmentsBarButton
          key={value}
          isActive={
            value === selectedTextProperties['text/horizontalAlignment']
          }
          onClick={() => changeTextAlignment(value)}
        >
          <span>{Icon}</span>
          <span>{value}</span>
        </AdjustmentsBarButton>
      ))}
    </AdjustmentsBar>
  );
};
export default AlignmentSelect;
