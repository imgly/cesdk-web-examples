import React from 'react';
import classNames from 'classnames';

import classes from './HelperText.module.css';

interface Props {
  error?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const HelperText: React.FC<Props> = ({ error, className, children }) => {
  return (
    <div
      className={classNames(classes.root, className, {
        [classes.error]: error
      })}
    >
      {children}
    </div>
  );
};
