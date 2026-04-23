/**
 * DisclaimerSection - Visual explanation of the AI to PSD workflow
 */
import { Icon } from '../Icon/Icon';
import classes from './DisclaimerSection.module.css';

export function DisclaimerSection() {
  return (
    <div className={classes.wrapper}>
      {/* Sub Section 1 */}
      <div className={classes.subSection}>
        <div className={classes.diagram}>
          <Icon name="AiFile" />
          <Icon name="Error" />
          <Icon name="Cesdk" />
        </div>
        <div className={classes.description}>
          Unfortunately it is not possible to <br />
          directly import .ai files to CE.SDK.
        </div>
      </div>
      {/* Sub Section 2 */}
      <div className={classes.subSection}>
        <div className={classes.diagram}>
          <Icon name="AiFile" />
          <Icon name="Arrow" />
          <Icon name="PsdFile" />
          <Icon
            name="Cesdk"
            style={{ marginLeft: '24px' }}
            className={classes.dimmed}
          />
        </div>
        <div className={classes.description}>
          Instead, export your .ai file as .psd, for <br />
          best results follow{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
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
          <Icon name="AiFile" className={classes.dimmed} />
          <Icon name="Arrow" className={classes.dimmed} />
          <Icon name="PsdFile" />
          <Icon name="Arrow" />
          <Icon name="Cesdk" />
        </div>
        <div className={classes.description}>
          With the help of our{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
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
