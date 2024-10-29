import React from 'react';
import classNames from 'classnames';

import classes from './RadioGroup.module.css';

interface IOption<T> {
  label: string;
  value: T;
  description?: string | React.ReactNode;
}

interface Props<T> {
  name: string;
  value: T;
  options: IOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export const RadioGroup = <T extends string>({
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
        const active = value === option.value;
        return (
          <label key={getId(option)} className={classes.item}>
            <input
              className={classes.radio}
              type="radio"
              checked={active}
              value={option.value}
              onChange={() => !active && onChange(option.value)}
            />
            <span className={classes.labelContainer}>
              <span className={classes.label}>{option.label}</span>
              {option.description && (
                <span className={classes.description}>
                  {option.description}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
};
