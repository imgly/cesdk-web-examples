'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { useState } from 'react';
import classes from './CaseComponent.module.css';
import { EditorProvider } from './EditorContext';
import { PageSettingsProvider } from './PageSettingsContext';
import PostcardUI from './components/PostcardUI/PostcardUI';
import { EngineProvider } from './lib/EngineContext';
import { SinglePageModeProvider } from './lib/SinglePageModeContext';
import createUnsplashSource from './lib/UnsplashSource';
import { SelectionProvider } from './lib/UseSelection';

const CaseComponent = () => {
  const [engine, setEngine] = useState(null);
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
              license: process.env.NEXT_PUBLIC_LICENSE
            }}
            configure={async (engine) => {
              setEngine(engine);
              engine.editor.setSetting('page/title/show', false);
              await engine.addDefaultAssetSources({});
              await engine.addDemoAssetSources({
                sceneMode: 'Design',
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
                  <SelectionProvider engine={engine}>
                    <PostcardUI />
                  </SelectionProvider>
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
