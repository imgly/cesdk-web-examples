import { Fragment, useMemo } from 'react';
import { useEditor } from '../../EditorContext';
import BackPageToolbar from './BackPageToolbar';
import FrontPageToolbar from './FrontPageToolbar';

import classes from './PageToolbar.module.css';

const PAGE_TOOLBARS = { Design: FrontPageToolbar, Write: BackPageToolbar };

const PageToolbar = () => {
  const { currentStep } = useEditor();

  const CurrentToolbar = useMemo(
    () => PAGE_TOOLBARS[currentStep] ?? Fragment,
    [currentStep]
  );
  return (
    <div className={classes.outerWrapper}>
      <div className={classes.innerWrapper}>
        <CurrentToolbar />
      </div>
    </div>
  );
};
export default PageToolbar;
