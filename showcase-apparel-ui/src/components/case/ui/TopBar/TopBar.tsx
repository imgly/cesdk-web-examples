import { ReactNode } from 'react';
import ExportButton from '../ExportButton/ExportButton';
import UndoRedoButtons from '../UndoRedoButtons/UndoRedoButtons';
import classes from './TopBar.module.css';

interface TopBarProps {
  children?: ReactNode;
  exportFileName?: string;
}

const TopBar = ({ children, exportFileName }: TopBarProps) => {
  return (
    <div className={classes.topBar}>
      <div>
        <UndoRedoButtons />
      </div>
      <div>{children}</div>
      <div>
        <ExportButton fileName={exportFileName} />
      </div>
    </div>
  );
};
export default TopBar;
