'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import {
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { useState } from 'react';
import classes from './CaseComponent.module.css';
import CUSTOM_LAYOUT_ASSET from './CustomLayout.json';
import CUSTOM_STICKER_ASSETS from './CustomSticker.json';
import { EditorProvider } from './EditorContext';
import PhotoBookUI from './components/PhotoBookUI/PhotoBookUI';
import { EngineProvider } from './lib/EngineContext';
import { PagePreviewProvider } from './lib/PagePreviewContext';
import { SinglePageModeProvider } from './lib/SinglePageModeContext';
import createUnsplashSource from './lib/UnsplashSource';
import { SelectionProvider } from './lib/UseSelection';
import { createApplyLayoutAsset } from './lib/createApplyLayoutAsset';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';
import { caseAssetPath } from './util';

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

              await engine.addPlugin(new ColorPaletteAssetSource());
              await engine.addPlugin(new TypefaceAssetSource());
              await engine.addPlugin(new TextAssetSource());
              await engine.addPlugin(new TextComponentAssetSource());
              await engine.addPlugin(new VectorShapeAssetSource());
              await engine.addPlugin(new EffectsAssetSource());
              await engine.addPlugin(new FiltersAssetSource());
              await engine.addPlugin(new CropPresetsAssetSource());
              await engine.addPlugin(new PagePresetsAssetSource());

              await engine.addPlugin(
                new UploadAssetSources({
                  include: [
                    'ly.img.image.upload',
                    'ly.img.video.upload',
                    'ly.img.audio.upload'
                  ]
                })
              );

              loadAssetSourceFromContentJSON(
                engine,
                CUSTOM_STICKER_ASSETS,
                caseAssetPath('')
              );
              loadAssetSourceFromContentJSON(
                engine,
                CUSTOM_LAYOUT_ASSET,
                caseAssetPath(''),
                createApplyLayoutAsset(engine)
              );

              engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');

              let UNSPLASH_API_URL = ''; // INSERT YOUR UNSPLASH PROXY URL HERE
              engine.asset.addSource(
                createUnsplashSource(UNSPLASH_API_URL, engine)
              );
            }}
          >
            <SinglePageModeProvider
              defaultVerticalTextScrollEnabled={true}
              defaultPaddingBottom={92}
              defaultPaddingLeft={40}
              defaultPaddingRight={40}
              defaultPaddingTop={110}
            >
              <PagePreviewProvider>
                <EditorProvider>
                  <SelectionProvider engine={engine}>
                    <PhotoBookUI />
                  </SelectionProvider>
                </EditorProvider>
              </PagePreviewProvider>
            </SinglePageModeProvider>
          </EngineProvider>
        </div>
      </div>
    </div>
  );
};

export default CaseComponent;
