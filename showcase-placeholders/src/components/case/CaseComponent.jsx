import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef } from 'react';

const CaseComponent = () => {
  const cesdk_container = useRef(null);
  useEffect(() => {
    const config = {
      role: 'Adopter',
      theme: 'light',
      initialSceneURL: `${window.location.protocol + "//" + window.location.host}/cases/placeholders/example.scene`,
      ui: {
        elements: {
          panels: {
            settings: true
          }
        }
      }
    };
    let cesdkInstance;
    if (navigator.userAgent !== 'ReactSnap' && cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then((cesdk) => {
        cesdkInstance = cesdk;
      });
    }
    return () => {
      if (cesdkInstance) {
        cesdkInstance.dispose();
      }
    };
  }, [cesdk_container]);

  return (
    <div style={wrapperStyle}>
      <div ref={cesdk_container} style={cesdkStyle}></div>
    </div>
  );
};

const cesdkStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '0.75rem'
};

const wrapperStyle = {
  borderRadius: '0.75rem',
  flexGrow: '1',
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)'
};

export default CaseComponent;
