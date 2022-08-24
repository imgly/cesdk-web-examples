import { useEditor } from '../../EditorContext';
import { ReactComponent as TextAlignCenterIcon } from '../../icons/TextAlignCenter.svg';
import { ReactComponent as TextAlignLeftIcon } from '../../icons/TextAlignLeft.svg';
import { ReactComponent as TextAlignRightIcon } from '../../icons/TextAlignRight.svg';

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
  const { selectedTextProperties } = useEditor();

  return (
    ALL_ALIGNMENTS.find(
      ({ value }) =>
        value === selectedTextProperties['text/horizontalAlignment']
    )?.Icon || <TextAlignCenterIcon />
  );
};
export default TextAlignmentIcon;
