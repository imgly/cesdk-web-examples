'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { useState } from 'react';
import classes from './CaseComponent.module.css';
import { EditorProvider } from './EditorContext';
import ApparelUI from './components/ApparelUI/ApparelUI';
import { EngineProvider } from './lib/EngineContext';
import { SinglePageModeProvider } from './lib/SinglePageModeContext';
import createUnsplashSource from './lib/UnsplashSource';
import { SelectionProvider } from './lib/UseSelection';
import {
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

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
              await engine.addPlugin(new StickerAssetSource());
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
              await engine.addPlugin(
                new DemoAssetSources({
                  include: ['ly.img.templates.*']
                })
              );
              engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');

              let UNSPLASH_API_URL = ''; // INSERT YOUR UNSPLASH PROXY URL HERE
              engine.asset.addSource(
                createUnsplashSource(UNSPLASH_API_URL, engine)
              );
              const stickers = await engine.asset.findAssets('ly.img.sticker', {
                perPage: 9999
              });
              stickers.assets.forEach((sticker) => {
                if (sticker.groups[0] !== 'emoticons') {
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
                <SelectionProvider engine={engine}>
                  <ApparelUI />
                </SelectionProvider>
              </EditorProvider>
            </SinglePageModeProvider>
          </EngineProvider>
        </div>
      </div>
    </div>
  );
};

export default CaseComponent;
