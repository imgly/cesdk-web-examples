import { ReactComponent as TextAlignCenterIcon } from '../../icons/TextAlignCenter.svg';
import { ReactComponent as TextAlignLeftIcon } from '../../icons/TextAlignLeft.svg';
import { ReactComponent as TextAlignRightIcon } from '../../icons/TextAlignRight.svg';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';

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

const TextAlignmentIcon = () => {
  const [horizontalAlignment] = useSelectedProperty('text/horizontalAlignment');

  return (
    ALL_ALIGNMENTS.find(({ value }) => value === horizontalAlignment)?.Icon || (
      <TextAlignCenterIcon />
    )
  );
};
export default TextAlignmentIcon;
