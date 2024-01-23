import classes from './CaseComponent.module.css';
import MobileUI from './components/MobileUI/MobileUI';
import { EditorProvider } from './EditorContext';

const CaseComponent = () => {
  return (
    <EditorProvider>
      <div className={classes.fullHeightWrapper}>
        <div className={classes.wrapper}>
          <div className={classes.kioskWrapper}>
            <MobileUI />
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default CaseComponent;
