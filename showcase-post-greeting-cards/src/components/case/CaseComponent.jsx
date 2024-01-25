import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import classes from './CaseComponent.module.css';
import PostcardUI from './components/PostcardUI/PostcardUI';
import { EditorProvider } from './EditorContext';
import { PageSettingsProvider } from './PageSettingsContext';
import { EngineProvider } from './lib/EngineContext';
import { SinglePageModeProvider } from './lib/SinglePageModeContext';
import createUnsplashSource from './lib/UnsplashSource';

const CaseComponent = () => {
  return (
    <div className={classes.fullHeightWrapper}>
      <div className={classes.wrapper}>
        <div className={classes.innerWrapper}>
          <EngineProvider
            LoadingComponent={<LoadingSpinner />}
            config={{
              role: 'Adopter',
              featureFlags: {
                preventScrolling: true
              },
              license: process.env.REACT_APP_LICENSE
            }}
            configure={async (engine) => {
              engine.editor.setSettingBool('page/title/show', false);
              await engine.addDefaultAssetSources({
                baseURL: 'https://cdn.img.ly/assets/v2'
              });
              await engine.addDemoAssetSources({
                sceneMode: 'Design',
                baseURL: 'https://cdn.img.ly/assets/demo/v2',
                withUploadAssetSources: true,
                exclude: ['ly.img.image']
              });

              engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');

              let UNSPLASH_API_URL = ''; // INSERT YOUR UNSPLASH PROXY URL HERE
              engine.asset.addSource(
                createUnsplashSource(UNSPLASH_API_URL, engine)
              );
              const stickers = await engine.asset.findAssets('ly.img.sticker', {
                perPage: 9999
              });
              stickers.assets.forEach((sticker) => {
                if (
                  sticker.groups[0] !==
                  '//ly.img.cesdk.stickers.emoticons/category/emoticons'
                ) {
                  engine.asset.removeAssetFromSource(
                    'ly.img.sticker',
                    sticker.id
                  );
                }
              });
            }}
          >
            <SinglePageModeProvider
              defaultVerticalTextScrollEnabled={true}
              defaultPaddingBottom={92}
              defaultPaddingLeft={40}
              defaultPaddingRight={40}
              defaultPaddingTop={110}
            >
              <EditorProvider>
                <PageSettingsProvider>
                  <PostcardUI />
                </PageSettingsProvider>
              </EditorProvider>
            </SinglePageModeProvider>
          </EngineProvider>
        </div>
      </div>
    </div>
  );
};

export default CaseComponent;
