import classNames from 'classnames';
import styles from './SegmentedControl.module.css';

interface IOption {
  label: string;
  id: string;
}
interface ISegmentedControl {
  options: IOption[];
  value: IOption;
  onChange: (value: IOption) => void;
}

export const SegmentedControl = ({
  options,
  value,
  onChange,
}: ISegmentedControl) => {

  return (
    <div className={styles.optionWrapper}>
      {options.map((option) => {
        const isActive = option.id === value.id;
        return (
          <button
            key={option.label}
            className={classNames(styles.labelWrapper, {
              [styles.labelWrapperActive]: isActive && options.length > 1
            })}
            onClick={() => onChange(option)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
