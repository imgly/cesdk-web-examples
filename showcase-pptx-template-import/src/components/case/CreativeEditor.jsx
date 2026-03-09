import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import classes from './CreativeEditor.module.css';
import { addGoogleFontsAssetLibrary } from '@imgly/pptx-importer';

const CreativeEditor = ({ sceneArchiveUrl, closeEditor }) => {
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
        typefaceLibraries: ['ly.img.google-fonts'],
        elements: {
          view: 'advanced',
          navigation: {
            action: {
              back: true,
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          }
        }
      },
      callbacks: {
        onBack: () => closeEditor(),
        onExport: 'download',
        onUpload: 'local'
      }
    };
    let cesdk;
    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({ sceneMode: 'Design' });
          instance.engine.editor.setSettingBool('page/title/show', false);
          await instance.engine.scene.loadFromArchiveURL(sceneArchiveUrl);
          await addGoogleFontsAssetLibrary(instance.engine);
          // Zoom auto-fit to page
          instance.actions.run('zoom.toPage', {
            autoFit: true
          });
          cesdk = instance;
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdkContainer, closeEditor, sceneArchiveUrl]);

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
