import classNames from 'classnames';
import styles from './SegmentedControl.module.css';

interface IOption {
  label: string;
  value: string;
}
interface ISegmentedControl {
  options: IOption[];
  value: string;
  onChange: (value: string) => void;
}

export const SegmentedControl = ({
  options,
  value,
  onChange,
}: ISegmentedControl) => {

  return (
    <div className={styles.optionWrapper}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.label}
            className={classNames(styles.labelWrapper, {
              [styles.labelWrapperActive]: isActive && options.length > 1
            })}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
