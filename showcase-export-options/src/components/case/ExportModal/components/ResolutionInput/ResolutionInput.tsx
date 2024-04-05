import React, { useCallback } from 'react';
import classNames from 'classnames';

import { ReactComponent as LockIcon } from '../../icons/Lock.svg';
import { Input } from '../Input/Input';

import classes from './ResolutionInput.module.css';

interface Props {
  errorWidth?: boolean;
  errorHeight?: boolean;
  width: number;
  height: number;
  setWidth: (value: number) => void;
  setHeight: (value: number) => void;
  className?: string;
}

export const ResolutionInput: React.FC<Props> = ({
  errorWidth,
  errorHeight,
  width,
  height,
  setWidth,
  setHeight,
  className
}) => {
  const handleSetWidth = useCallback(
    (value: string) => {
      if (!value) {
        setWidth(0);
      } else {
        setWidth(parseInt(value));
      }
    },
    [setWidth]
  );

  const handleSetHeight = useCallback(
    (value: string) => {
      if (!value) {
        setHeight(0);
      } else {
        setHeight(parseInt(value));
      }
    },
    [setHeight]
  );

  return (
    <div className={classNames(classes.root, className)}>
      <Input
        name="Resolution-Width"
        suffix="px"
        value={width}
        type="number"
        min={0}
        max={4096}
        error={errorWidth}
        onChange={handleSetWidth}
      />
      <LockIcon className={classes.icon} />
      <Input
        name="Resolution-Height"
        suffix="px"
        value={height}
        type="number"
        min={0}
        max={4096}
        error={errorHeight}
        onChange={handleSetHeight}
      />
    </div>
  );
};
