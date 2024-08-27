'use client';

import classes from './CaseComponent.module.css';
import FileProcessing from './FileProcessing';
import { FileProcessingContextProvider } from './FileProcessingContext';

const CaseComponent = () => {
  return (
    <FileProcessingContextProvider>
      <div className={classes.outerWrapper}>
        <div className={classes.wrapper}>
          <div className={classes.block}>
            <FileProcessing />
          </div>
        </div>
      </div>
    </FileProcessingContextProvider>
  );
};
export default CaseComponent;
