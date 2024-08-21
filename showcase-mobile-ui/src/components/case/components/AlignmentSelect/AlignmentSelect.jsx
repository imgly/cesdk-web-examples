import { ReactComponent as TextAlignCenterIcon } from '../../icons/TextAlignCenter.svg';
import { ReactComponent as TextAlignLeftIcon } from '../../icons/TextAlignLeft.svg';
import { ReactComponent as TextAlignRightIcon } from '../../icons/TextAlignRight.svg';
import IconButton from '../IconButton/IconButton';
import classes from './AlignmentSelect.module.css';

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

const AlignmentSelect = ({ onClick, activeAlignment }) => {
  return (
    <div className={classes.wrapper}>
      {ALL_ALIGNMENTS.map(({ value, Icon }) => (
        <IconButton
          key={value}
          isActive={value === activeAlignment}
          onClick={() => onClick(value)}
          icon={Icon}
        />
      ))}
    </div>
  );
};
export default AlignmentSelect;
