import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import classes from './CaseComponent.module.css';
import BottomControls from './components/BottomControls/BottomControls';
import CESDKCanvas from './components/CESDKCanvas/CESDKCanvas';
import TopBar from './components/TopBar/TopBar';
import { EditorProvider, useEditor } from './EditorContext';

const CustomUI = () => {
  const { isLoaded } = useEditor();


  return (
    <>
      {!isLoaded && <LoadingSpinner />}
      {isLoaded && <TopBar />}
      <CESDKCanvas />
      {isLoaded && <BottomControls />}
    </>
  );
};

const CaseComponent = () => {
  return (
    <EditorProvider>
      {/* Use this element to fix the size in iOS Safari. */}
      <div className={classes.fullHeightWrapper}>
        <div className={classes.caseWrapper}>
          <div className="caseHeader">
            <h3>Apparel UI</h3>
            <p>
              Try out customizing a t-shirt design with this mobile apparel
              editor and export a print-ready PDF.{' '}
            </p>
          </div>
          <div className={classes.wrapper}>
            <div className={classes.kioskWrapper}>
              <CustomUI />
            </div>
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default CaseComponent;
