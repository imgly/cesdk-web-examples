import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef } from 'react';

const CaseComponent = (props = { locale: 'en' }) => {
  const cesdk_container = useRef(null);
  useEffect(() => {
    let config = {
      locale: props.locale,
      role: 'Adopter',
      theme: 'light',
      initialSceneURL: `${window.location.protocol + "//" + window.location.host}/example-1-adopter.scene`,
      ui: {
        elements: {
          panels: {
            settings: true
          }
        }
      }
    };
    let cesdk;
    if (navigator.userAgent !== 'ReactSnap' && cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        (instance) => {
          cesdk = instance;
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [props.locale, cesdk_container]);

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
