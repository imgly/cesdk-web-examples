'use client';

import classes from './CaseComponent.module.css';
import FileProcessing from './FileProcessing';
import { FileProcessingContextProvider } from './FileProcessingContext';
import { ShowcaseAlert } from './ShowcaseAlert/ShowcaseAlert';

const CaseComponent = () => {
  return (
    <FileProcessingContextProvider>
      <div className={classes.outerWrapper}>
        <ShowcaseAlert title={'Early Access: Alpha Version'}>
          This is an early access preview of our ongoing work. Please{' '}
          <a href="https://img.ly/company/contact-us">let us know</a> if you
          encounter any issues.
        </ShowcaseAlert>
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
