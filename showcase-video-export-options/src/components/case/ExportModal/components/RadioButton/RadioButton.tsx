import classNames from 'classnames';
import React from 'react';
import styles from './RadioButton.module.css';
import CheckedHoverIcon from './checked-hover.svg';
import UncheckedIcon from './unchecked.svg';

interface Props {
  children: React.ReactNode;
  name: string;
  id: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}

export const RadioButton = ({
  children,
  id,
  name,
  value,
  checked,
  onChange
}: Props) => {
  return (
    <label
      className={classNames(styles.container, {
        [styles.checked]: checked
      })}
    >
      {checked && <CheckedHoverIcon />}
      {!checked && <UncheckedIcon />}
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        aria-labelledby={`${name}-${value}-label`}
      />
      <span id={`${name}-${value}-label`} className={styles.srOnly}>
        {children}
      </span>
      {children}
    </label>
  );
};

export default RadioButton;
