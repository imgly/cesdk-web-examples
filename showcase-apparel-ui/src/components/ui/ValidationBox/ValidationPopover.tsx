import styles from './ValidationPopover.module.css';
import validationBoxStyles from './ValidationBox.module.css';
import classNames from 'classnames';

interface IValidationPopover {
  validationTitle: string;
  validationDescription: string;
}

const ValidationPopover = ({
  validationTitle,
  validationDescription
}: IValidationPopover) => {
  return (
    <div className={styles.content}>
      {validationTitle && validationDescription && (
        <div className={styles.body}>
          <span className={styles.title}>{validationTitle}</span>
          <span className={styles.description}>{validationDescription}</span>
        </div>
      )}
      <div className={styles.footer}>
        <span>Probability:</span>
        <div className="flex items-center space-x-2">
          <span
            className={classNames(
              validationBoxStyles.checkStatus,
              validationBoxStyles['checkStatus--failed']
            )}
          ></span>
          <span>Certain</span>
          <span
            className={classNames(
              validationBoxStyles.checkStatus,
              validationBoxStyles['checkStatus--warning']
            )}
          ></span>
          <span>Likely</span>
        </div>
      </div>
    </div>
  );
};

export default ValidationPopover;
