import classes from './CaseComponent.module.css';
import MobileUI from './components/MobileUI/MobileUI';
import { EditorProvider } from './EditorContext';

const CaseComponent = () => {
  return (
    <EditorProvider>
      <div className={classes.fullHeightWrapper}>
        <div className={classes.caseWrapper}>
          <div className="caseHeader">
            <h3>Mobile UI</h3>
            <p>
              This mobile product ad designer lets users customize templates and
              choose presets for different ad channels.{' '}
            </p>
          </div>
          <div className={classes.wrapper}>
            <div className={classes.kioskWrapper}>
              <MobileUI />
            </div>
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default CaseComponent;
