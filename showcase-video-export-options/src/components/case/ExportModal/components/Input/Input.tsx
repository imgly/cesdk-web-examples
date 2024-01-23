import React, { useCallback } from 'react';
import classNames from 'classnames';

import classes from './Input.module.css';

interface Props {
  value?: string | number;
  min?: number;
  max?: number;
  name: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  suffix?: string;
  placeholder?: string;
  error?: boolean;
  onChange: (value: string) => void;
  className?: string;
}

export const Input: React.FC<Props> = ({
  value,
  min,
  max,
  type,
  name,
  suffix,
  placeholder,
  error,
  onChange,
  className
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.currentTarget.value);
    },
    [onChange]
  );

  return (
    <div
      className={classNames(className, classes.root, {
        [classes.error]: error
      })}
    >
      <input
        name={name}
        className={classes.input}
        placeholder={placeholder}
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
      ></input>
      <span className={classes.suffix}>{suffix}</span>
    </div>
  );
};
