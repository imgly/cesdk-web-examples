import React, { useCallback } from 'react';
import classNames from 'classnames';

import classes from './Select.module.css';

interface IOption<T> {
  label: string;
  value: T;
}

interface Props<T> {
  name: string;
  value: T;
  options: IOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export const Select = <T extends string>({
  name,
  value,
  options,
  onChange,
  className
}: Props<T>) => {
  const getId = (option: IOption<T>) => name + option.value;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.currentTarget.value as T);
    },
    [onChange]
  );

  return (
    <select
      name={name}
      value={value}
      className={classNames(classes.root, className)}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={getId(option)} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
