import classes from './CaseComponent.module.css';
import PostcardUI from './components/PostcardUI/PostcardUI';
import { EditorProvider } from './EditorContext';
import { PageSettingsProvider } from './PageSettingsContext';

const CaseComponent = () => {
  return (
    <div className={classes.fullHeightWrapper}>
      <div className={classes.wrapper}>
        <div className={classes.innerWrapper}>
          <EditorProvider>
            <PageSettingsProvider>
              <PostcardUI />
            </PageSettingsProvider>
          </EditorProvider>
        </div>
      </div>
    </div>
  );
};

export default CaseComponent;
