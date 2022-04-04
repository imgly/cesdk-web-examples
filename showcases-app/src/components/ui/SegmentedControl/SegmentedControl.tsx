import classNames from 'classnames';
import styles from './SegmentedControl.module.css';

interface IOption {
  label: string;
  value: string;
}
interface ISegmentedControl {
  options: IOption[];
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const SegmentedControl = ({
  options,
  value,
  name,
  label,
  onChange
}: ISegmentedControl) => {
  const getId = (option: IOption) => name + option.value;

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.description}>{label}</span>}
      <div className={styles.optionWrapper}>
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={getId(option)}
              className={classNames(styles.labelWrapper, {
                [styles.labelWrapperActive]: isActive
              })}
              onClick={() => !isActive && onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedControl;
