import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import classes from './CreativeEditor.module.css';

const CreativeEditor = ({ sceneUrl, closeEditor }) => {
  const cesdkContainer = useRef(null);
  const overlayContainer = useRef(null);

  useEffect(() => {
    const config = {
      featureFlags: {
        archiveSceneEnabled: true
      },
      role: 'Creator',
      theme: 'light',
      license: process.env.REACT_APP_LICENSE,
      ui: {
        elements: {
          panels: {
            settings: true
          },
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
          await instance.loadFromURL(sceneUrl);
          cesdk = instance;
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdkContainer, closeEditor, sceneUrl]);

  // Workaround to prevent body scrolling:
  useEffect(() => {
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = 'auto';
    };
  }, []);

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
