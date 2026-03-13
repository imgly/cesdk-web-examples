import CreativeEditorSDK from '@cesdk/cesdk-js';
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
          instance.addDefaultAssetSources();
          await instance.addDemoAssetSources({ sceneMode: 'Video' });
          cesdk = instance;
          const engine = instance.engine;
          let page;
          switch (option) {
            case 'blank':
              await instance.createVideoScene();
              page = engine.scene.getCurrentPage();
              engine.block.setWidth(page, 1280);
              engine.block.setHeight(page, 720);
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
