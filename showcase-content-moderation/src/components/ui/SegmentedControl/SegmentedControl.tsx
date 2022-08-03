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
  buttonStyle: React.CSSProperties;
  size: 'sm' | 'md';
  onChange: (value: string) => void;
}

const SegmentedControl = ({
  options,
  value,
  name,
  label,
  buttonStyle,
  onChange,
  size = 'sm'
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
              style={buttonStyle}
              className={classNames(
                styles.labelWrapper,
                styles['labelWrapper--' + size],
                {
                  [styles.labelWrapperActive]: isActive
                }
              )}
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
