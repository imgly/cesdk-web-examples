import React from 'react';
import classNames from 'classnames';

import classes from './SegmentedControl.module.css';

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

export const SegmentedControl = <T extends string>({
  name,
  value,
  options,
  onChange,
  className
}: Props<T>) => {
  const getId = (option: IOption<T>) => name + option.value;

  return (
    <div className={classNames(classes.root, className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={getId(option)}
            className={classNames(classes.item, {
              [classes.itemActive]: value === option.value
            })}
            onClick={() => !active && onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
