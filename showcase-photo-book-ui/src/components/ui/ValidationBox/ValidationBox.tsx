import classNames from 'classnames';
import React, { ReactNode, useMemo } from 'react';
import StyledPopover from '../StyledPopover/StyledPopover';
import BlockLabel, { IBlockLabel } from './BlockLabel';
import { ReactComponent as CheckIcon } from './icons/check.svg';
import { ReactComponent as ClockIcon } from './icons/clock.svg';
import { ReactComponent as InfoIcon } from './icons/info.svg';
import styles from './ValidationBox.module.css';
import ValidationPopover from './ValidationPopover';
interface IValidationResult extends IBlockLabel {
  id: string;
  state: 'failed' | 'warning' | 'success';
  validationName: string;
  validationDescription: string;
  onClick: () => void;
}

interface IValidationBox {
  checkStatus: 'pending' | 'performed';
  results: IValidationResult[];
  emptyComponent: ReactNode;
  successComponent: ReactNode;
}

const ValidationBox = ({
  checkStatus,
  results,
  emptyComponent,
  successComponent
}: IValidationBox) => {
  const unsuccessfulResults = useMemo(
    () => results.filter((result) => result.state !== 'success'),
    [results]
  );
  const StatusIcon = checkStatus === 'pending' ? ClockIcon : CheckIcon;
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.headerTitle + ' space-x-2'}>
          <span>Check {checkStatus}</span>
          <StatusIcon />
        </span>
        <span className={styles.headerInfo}>
          {unsuccessfulResults.length} results
        </span>
      </div>

      <div className={styles.checkWrapper}>
        <div className={styles.checkGrid}>
          {unsuccessfulResults.map((result) => (
            <React.Fragment key={result.id}>
              <span className={styles.checkNameWrapper + ' space-x-2'}>
                <span
                  className={classNames(
                    styles.checkStatus,
                    styles['checkStatus--' + result.state]
                  )}
                ></span>
                <span className={styles.checkName}>
                  {result.validationName}
                </span>

                <StyledPopover
                  content={
                    <ValidationPopover
                      validationTitle={result.validationName}
                      validationDescription={result.validationDescription}
                    />
                  }
                >
                  <InfoIcon style={{ cursor: 'pointer' }} />
                </StyledPopover>
              </span>
              <BlockLabel
                blockType={result.blockType}
                blockName={result.blockName}
              />
              <button className={styles.checkCTA} onClick={result.onClick}>
                Select
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
      {checkStatus === 'pending' && results.length === 0 && (
        <div className={styles.statusText}>{emptyComponent}</div>
      )}
      {checkStatus === 'performed' && unsuccessfulResults.length === 0 && (
        <div className={styles.statusText}>{successComponent}</div>
      )}
    </div>
  );
};

export default ValidationBox;
