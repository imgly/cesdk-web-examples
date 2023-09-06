import classNames from 'classnames';
import React from 'react';
import RadioButton from '../RadioButton/RadioButton';
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
          <RadioButton
            value={option.value}
            key={option.value}
            checked={active}
            name={name}
            id={getId(option)}
            onChange={() => onChange(option.value)}
          >
            <div className={classes.labelContainer}>
              <span>{option.label}</span>
              <span className={classes.description}>{option.description}</span>
            </div>
          </RadioButton>
        );
      })}
    </div>
  );
};
