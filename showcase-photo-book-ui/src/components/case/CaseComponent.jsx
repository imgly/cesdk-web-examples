import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import classes from './CaseComponent.module.css';
import PhotobookUI from './components/PhotobookUI/PhotobookUI';
import { EditorProvider } from './EditorContext';
import { EngineProvider } from './lib/EngineContext';
import { PagePreviewProvider } from './lib/PagePreviewContext';
import { SinglePageModeProvider } from './lib/SinglePageModeContext';

const CaseComponent = () => {
  return (
    <div className={classes.fullHeightWrapper}>
      <div className={classes.caseWrapper}>
        <div className="caseHeader">
          <h3 className="caseHeader__title">Photo Book UI</h3>
          <p>
            This custom UI was implemented using the CE.SDK headless API to
            optimally guide users through the creation of a photo book.
          </p>
        </div>
        <div className={classes.wrapper}>
          <div className={classes.innerWrapper}>
            <EngineProvider
              LoadingComponent={<LoadingSpinner />}
              config={{
                role: 'Adopter',
                featureFlags: {
                  preventScrolling: true
                },
                page: {
                  title: {
                    show: false
                  }
                },
                license: process.env.REACT_APP_LICENSE
              }}
            >
              <SinglePageModeProvider
                defaultVerticalTextScrollEnabled={true}
                defaultPaddingBottom={40}
                defaultPaddingLeft={40}
                defaultPaddingRight={40}
                defaultPaddingTop={40}
              >
                <PagePreviewProvider>
                  <EditorProvider>
                    <PhotobookUI />
                  </EditorProvider>
                </PagePreviewProvider>
              </SinglePageModeProvider>
            </EngineProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseComponent;
