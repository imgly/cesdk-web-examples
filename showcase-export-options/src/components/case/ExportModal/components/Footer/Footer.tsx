import React from 'react';
import classNames from 'classnames';

import { SectionDivider } from '../SectionDivider/SectionDivider';
import DownloadIcon from '../../icons/Download.svg';

import classes from './Footer.module.css';

interface Props {
  onExport: () => void;
  className?: string;
}

export const Footer: React.FC<Props> = ({ onExport, className }) => {
  return (
    <div className={classNames(classes.root, className)}>
      <SectionDivider />
      <div className={classes.buttons}>
        <button
          className={classes.buttonDownload}
          type="button"
          onClick={onExport}
        >
          Download
          <DownloadIcon />
        </button>
      </div>
    </div>
  );
};
