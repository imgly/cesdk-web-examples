import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef } from 'react';

const CaseComponent = () => {
  const cesdkContainer = useRef(null);
  useEffect(() => {
    const config = {
      role: 'Creator',
      theme: 'dark',
      license: process.env.REACT_APP_LICENSE,
      ui: {
        elements: {
          view: 'advanced',
          panels: {
            inspector: {
              show: true,
              position: 'right'
            },
            settings: true
          },
          dock: {
            iconSize: 'normal',
            hideLabels: true
          },
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          }
        }
      },
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      }
    };


    let cesdk;
    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({sceneMode: 'Design'});
          cesdk = instance;
          await instance.loadFromURL(`${window.location.protocol + "//" + window.location.host}/cases/advanced-ui/example.scene`);
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdkContainer]);

  return (
    <div style={cesdkWrapperStyle}>
      <div ref={cesdkContainer} style={cesdkStyle}></div>
    </div>
  );
};

const cesdkStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

const cesdkWrapperStyle = {
  position: 'relative',
  minHeight: '640px',
  overflow: 'hidden',
  flexGrow: 1,
  display: 'flex',
  borderRadius: '0.75rem',
  boxShadow:
    '0px 0px 2px rgba(22, 22, 23, 0.25), 0px 4px 6px -2px rgba(22, 22, 23, 0.12), 0px 2px 2.5px -2px rgba(22, 22, 23, 0.12), 0px 1px 1.75px -2px rgba(22, 22, 23, 0.12)'
};

export default CaseComponent;
