import BottomControls from './components/BottomControls/BottomControls';
import CESDKCanvas from './components/CESDKCanvas/CESDKCanvas';
import TopBar from './components/TopBar/TopBar';
import { EditorProvider, useEditor } from './EditorContext';
import classes from './CaseComponent.module.css';
import classNames from 'classnames';

const CustomUI = () => {
  const { isLoaded } = useEditor();


  return (
    <>
      {isLoaded && <TopBar />}
      <CESDKCanvas />
      {isLoaded && <BottomControls />}
    </>
  );
};

const CaseComponent = () => {
  return (
    <EditorProvider>
      <div className="flex w-full flex-col">
        <div className="caseHeader">
          <h3>Custom UI</h3>
          <p>Quickly build any UI on top of our API.</p>
          <p>
            Try out customizing a t-shirt design with this mobile apparel editor
            and export a print-ready PDF.{' '}
          </p>
        </div>
        <div className={classes.wrapper}>
          <div className={classes.kioskWrapper}>
            <CustomUI />
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default CaseComponent;
