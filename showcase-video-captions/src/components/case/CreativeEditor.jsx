import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
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
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { VideoEditorConfig } from './lib/video-editor/plugin';

import { useEffect, useRef } from 'react';
import classes from './CreativeEditor.module.css';
import { caseAssetPath } from './util';

const CreativeEditor = ({ option, closeEditor }) => {
  const cesdkContainer = useRef(null);
  const overlayContainer = useRef(null);

  useEffect(() => {
    const config = {
      featureFlags: {
        archiveSceneEnabled: true
      },
      role: 'Creator',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      ui: {
        elements: {
          navigation: {
            action: {
              close: true,
              export: {
                show: true,
                format: ['video/mp4']
              }
            }
          }
        }
      },
      callbacks: {
        onClose: () => closeEditor(),
        onExport: 'download',
        onUpload: 'local'
      }
    };
    let cesdk;
    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          // Add the video editor configuration plugin first
          await instance.addPlugin(new VideoEditorConfig());

          // Asset Source Plugins (replaces addDefaultAssetSources)
          await instance.addPlugin(new ColorPaletteAssetSource());
          await instance.addPlugin(new TypefaceAssetSource());
          await instance.addPlugin(new TextAssetSource());
          await instance.addPlugin(new TextComponentAssetSource());
          await instance.addPlugin(new VectorShapeAssetSource());
          await instance.addPlugin(new StickerAssetSource());
          await instance.addPlugin(new EffectsAssetSource());
          await instance.addPlugin(new FiltersAssetSource());
          await instance.addPlugin(new BlurAssetSource());
          await instance.addPlugin(new PagePresetsAssetSource());
          await instance.addPlugin(new CaptionPresetsAssetSource());
          await instance.addPlugin(new CropPresetsAssetSource());
          await instance.addPlugin(
            new UploadAssetSources({
              include: [
                'ly.img.image.upload',
                'ly.img.video.upload',
                'ly.img.audio.upload'
              ]
            })
          );

          // Demo assets (replaces addDemoAssetSources)
          await instance.addPlugin(
            new DemoAssetSources({
              include: [
                'ly.img.templates.video.*',
                'ly.img.image.*',
                'ly.img.video.*',
                'ly.img.audio.*'
              ]
            })
          );

          cesdk = instance;
          const engine = instance.engine;
          let page;
          switch (option) {
            case 'blank':
              await cesdk.actions.run('scene.create', {
                mode: 'Video',
                page: { width: 1280, height: 720, unit: 'Pixel' }
              });
              engine.block.setColor(
                engine.block.getFill(page),
                'fill/color/value',
                {
                  r: 1,
                  g: 1,
                  b: 1,
                  a: 1
                }
              );
              engine.block.setSelected(page, false);
              break;
            case 'import':
              await engine.scene.loadFromArchiveURL(
                caseAssetPath('/captions.archive')
              );
              page = engine.scene.getCurrentPage();
              engine.block.setPlaybackTime(page, 1);
              break;
            case 'pre-captioned':
              await engine.scene.loadFromArchiveURL(
                caseAssetPath('/captions-pre-captioned.archive')
              );
              page = engine.scene.getCurrentPage();
              engine.block.setPlaybackTime(page, 1);
              const captionTrack = engine.block.findByType('captionTrack')[0];
              engine.block.findAllSelected().forEach((block) => {
                engine.block.setSelected(block, false);
              });
              engine.block.setSelected(
                engine.block.getChildren(captionTrack)[0],
                true
              );
              break;
          }
          // change the position of the close button to the left and remove preview button
          instance.ui.setNavigationBarOrder(
            [{ id: 'ly.img.close.navigationBar' }].concat(
              instance.ui
                .getNavigationBarOrder()
                .filter(
                  (item) =>
                    ![
                      'ly.img.close.navigationBar',
                      'ly.img.preview.navigationBar'
                    ].includes(item.id)
                )
            )
          );
          instance.feature.enable('ly.img.page.resize', false);
          instance.ui.openPanel('//ly.img.panel/inspector/caption');
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdkContainer, closeEditor, option]);

  return (
    <div
      className={classes.overlay}
      ref={overlayContainer}
      onClick={(event) => {
        if (
          overlayContainer.current &&
          overlayContainer.current === event.target
        ) {
          closeEditor();
        }
      }}
    >
      <div className={classes.modal}>
        <div ref={cesdkContainer} className={classes.cesdkContainer}></div>
      </div>
    </div>
  );
};

export default CreativeEditor;
