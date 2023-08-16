import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import classes from './CreativeEditor.module.css';
import { useImageMatting } from './ImageMattingContext';

const CreativeEditor = ({ closeEditor }) => {
  const cesdkContainer = useRef(null);
  const overlayContainer = useRef(null);

  const { imageUrl, hasProcessedImage, originalImageUrl } = useImageMatting();

  useEffect(() => {
    const config = {
      role: 'Adopter',
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
          await instance.createFromImage(imageUrl);
          const [page] = instance.engine.block.findByType('page');
          instance.engine.editor.setSettingBool('page/title/show', false);
          instance.engine.block.setFillEnabled(page, false);
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

  if (!hasProcessedImage) {
    return null;
  }

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
