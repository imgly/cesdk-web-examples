import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import { useImageMatting } from './utils/matting';

import classes from './CreativeEditor.module.css';

const CreativeEditor = ({ closeEditor }) => {
  const cesdkContainer = useRef(null);
  const overlayContainer = useRef(null);

  const { imageUrl, hasProcessedImage } = useImageMatting();

  useEffect(() => {
    const config = {
      role: 'Adopter',
      theme: 'light',
      initialImageURL: imageUrl,
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
      CreativeEditorSDK.init(cesdkContainer.current, config).then(
        (instance) => {
          const [page] = instance.engine.block.findByType('page');
          instance.engine.editor.setSettingBool('page/title/show', false);
          instance.engine.block.setFillEnabled(page, false);
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources();
          cesdk = instance;
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdkContainer, hasProcessedImage, closeEditor, imageUrl]);

  if (hasProcessedImage) {
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
        <div ref={cesdkContainer} className={classes.cesdk}></div>
      </div>
    );
  } else {
    return null;
  }
};

export default CreativeEditor;
