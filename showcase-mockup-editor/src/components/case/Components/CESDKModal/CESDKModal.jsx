import CreativeEditorSDK from '@cesdk/cesdk-js';
import useOnClickOutside from 'lib/useOnClickOutside';
import { useEffect, useRef } from 'react';
import classes from './CESDKModal.module.css';

const CESDKModal = ({ config, onOutsideClick }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  useEffect(() => {
    if (containerRef.current && !instanceRef.current) {
      CreativeEditorSDK.init(containerRef.current, config).then((instance) => {
        instance.addDefaultAssetSources();
        instance.addDemoAssetSources();
        instanceRef.current = instance;
      });
      return () => {
        if (instanceRef.current) {
          instanceRef.current.dispose();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  useOnClickOutside(containerRef, onOutsideClick);

  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <div ref={containerRef} className={classes.cesdkContainer}></div>
      </div>
    </div>
  );
};

export default CESDKModal;
