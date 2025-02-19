import SmallButton from '../SmallButton/SmallButton';
import { ReactComponent as ResetIcon } from '../../icons/Reset.svg';
import classes from './ResetButton.module.css';

export default function ResetButton({ disabled, onClick }) {
  return (
    <SmallButton
      variant={'secondary-plain'}
      disabled={disabled}
      onClick={onClick}
    >
      <ResetIcon />
      <span className={classes.text}>Reset</span>
    </SmallButton>
  );
}
