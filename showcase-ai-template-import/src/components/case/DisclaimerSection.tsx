import classes from './DisclaimerSection.module.css';
import AiFileIcon from './icons/AiFile.svg';
import ErrorIcon from './icons/Error.svg';
import CesdkIcon from './icons/Cesdk.svg';
import ArrowIcon from './icons/Arrow.svg';
import PsdFileIcon from './icons/PsdFile.svg';

function DisclaimerSection() {
  return (
    <div className={classes.wrapper}>
      {/* Sub Section 1 */}
      <div className={classes.subSection}>
        <div className={classes.diagram}>
          <AiFileIcon />
          <ErrorIcon />
          <CesdkIcon />
        </div>
        <div className={classes.description}>
          Unfortunately it is not possible to <br />
          directly import .ai files to CE.SDK.
        </div>
      </div>
      {/* Sub Section 2 */}
      <div className={classes.subSection}>
        <div className={classes.diagram}>
          <AiFileIcon />
          <ArrowIcon />
          <PsdFileIcon />
          <CesdkIcon
            style={{ marginLeft: '24px' }}
            className={classes.dimmed}
          />
        </div>
        <div className={classes.description}>
          Instead, export your .ai file as .psd, for <br />
          best results follow{' '}
          <a
            target="_blank"
            href="https://sergosokin.medium.com/how-to-export-a-illustrator-file-into-a-vector-layered-photoshop-file-2dcc274abf66"
          >
            this guide
          </a>
          .
        </div>
      </div>
      {/* Sub Section 3 */}
      <div className={classes.subSection}>
        <div className={classes.diagram}>
          <AiFileIcon className={classes.dimmed} />
          <ArrowIcon className={classes.dimmed} />
          <PsdFileIcon />
          <ArrowIcon />
          <CesdkIcon />
        </div>
        <div className={classes.description}>
          With the help of our{' '}
          <a
            target="_blank"
            href="https://img.ly/showcases/cesdk/psd-template-import/web"
          >
            PSD Importer
          </a>{' '}
          you <br />
          can then import the .psd file to CE.SDK.
        </div>
      </div>
    </div>
  );
}

export default DisclaimerSection;
