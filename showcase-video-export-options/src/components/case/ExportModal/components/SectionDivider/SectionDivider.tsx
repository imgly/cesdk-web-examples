import React from 'react';
import classNames from 'classnames';

import classes from './SectionDivider.module.css';

interface Props {
  fullWidth?: boolean;
  className?: string;
}

export const SectionDivider: React.FC<Props> = ({
  fullWidth = true,
  className
}) => {
  return (
    <div
      className={classNames(classes.root, className, {
        [classes.fullWidth]: fullWidth
      })}
    >
      <div className={classes.fill} />
    </div>
  );
};
