import classNames from 'classnames';
import { ReactNode, useMemo } from 'react';
import StyledPopover from '../StyledPopover/StyledPopover';
import BlockLabel, { IBlockLabel } from './BlockLabel';
import styles from './ValidationBox.module.css';
import ValidationPopover from './ValidationPopover';
import CheckIcon from './icons/check.svg';
import ClockIcon from './icons/clock.svg';
import InfoIcon from './icons/info.svg';
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
  headerComponent: ReactNode;
}

const ValidationBox = ({
  checkStatus,
  results,
  emptyComponent,
  successComponent,
  headerComponent
}: IValidationBox) => {
  const unsuccessfulResults = useMemo(
    () => results.filter((result) => result.state !== 'success'),
    [results]
  );
  const StatusIcon = checkStatus === 'pending' ? ClockIcon : CheckIcon;
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {headerComponent ? (
          headerComponent
        ) : (
          <span className={styles.headerTitle + ' space-x-2'}>
            <span>Check {checkStatus}</span>
            <StatusIcon />
          </span>
        )}
        <span className={styles.headerInfo}>
          {unsuccessfulResults.length} results
        </span>
      </div>

      <div className={styles.checksOverflowWrapper}>
        <div className={styles.checkCollectionWrapper}>
          {unsuccessfulResults.map((result) => (
            <div key={result.id} className={styles.checkItemWrapper}>
              <div className={styles.checkItemHeader}>
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
                    size="md"
                  >
                    <span>
                      <InfoIcon style={{ cursor: 'pointer' }} />
                    </span>
                  </StyledPopover>
                </span>
                <button className={styles.checkCTA} onClick={result.onClick}>
                  Select
                </button>
              </div>
              <BlockLabel
                blockType={result.blockType}
                blockName={result.blockName}
              />
            </div>
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
