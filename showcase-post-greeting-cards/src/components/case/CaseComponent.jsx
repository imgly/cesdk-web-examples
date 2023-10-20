import classes from './CaseComponent.module.css';
import PostcardUI from './components/PostcardUI/PostcardUI';
import { EditorProvider } from './EditorContext';
import { PageSettingsProvider } from './PageSettingsContext';

const CaseComponent = () => {
  return (
    <div className={classes.fullHeightWrapper}>
      <div className={classes.caseWrapper}>
        <div className="caseHeader">
          <h3 className="caseHeader__title--small">Postcard UI</h3>
          <h3 className="caseHeader__title--large">Post- & Greeting-Card UI</h3>
          <p>
            This custom UI was implemented using the CE.SDK headless API to
            optimally guide users through adapting a post or greeting card
            template.
          </p>
        </div>
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
    </div>
  );
};

export default CaseComponent;
