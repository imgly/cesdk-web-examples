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
        <h3 className={classNames(classes.headline, 'h4')}>Custom UI</h3>
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
