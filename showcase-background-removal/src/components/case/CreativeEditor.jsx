import CreativeEditorSDK from '@cesdk/cesdk-js';
import useOnClickOutside from 'lib/useOnClickOutside';
import { useEffect, useRef } from 'react';
import { useImageMatting } from './utils/matting';

import classes from './CreativeEditor.module.css';

const CreativeEditor = ({ closeEditor }) => {
  const cesdkContainer = useRef(null);

  const { processedImage, resetState } = useImageMatting();

  function close() {
    resetState();
    closeEditor();
  }

  useEffect(() => {
    const config = {
      role: 'Adopter',
      theme: 'light',
      initialImageURL: processedImage
        ? URL.createObjectURL(processedImage)
        : undefined,
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
        onBack: () => close(),
        onExport: 'download',
        onUpload: 'local'
      }
    };
    let cesdk;
    if (cesdkContainer.current) {
      CreativeEditorSDK.init(cesdkContainer.current, config).then(
        (instance) => {
          const [page] = instance.engine.block.findByType('page');
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
  }, [cesdkContainer, processedImage]);

  useOnClickOutside(cesdkContainer, close);

  if (processedImage) {
    return (
      <div className={classes.overlay}>
        <div ref={cesdkContainer} className={classes.cesdk}></div>
      </div>
    );
  } else {
    return null;
  }
};

export default CreativeEditor;
