import CreativeEditorSDK from '@cesdk/cesdk-js';
import useOnClickOutside from 'lib/useOnClickOutside';
import React, { useEffect, useRef } from 'react';
import classes from './CESDKModal.module.css';

const CESDKModal = ({ config, configure, onOutsideClick }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  useEffect(() => {
    config.license = process.env.REACT_APP_LICENSE;
    if (containerRef.current && !instanceRef.current) {
      CreativeEditorSDK.create(containerRef.current, config).then(
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({
            sceneMode: 'Design',
            excludeAssetSourceIds: ['ly.img.template']
          });

          if (configure) {
            await configure(instance);
          }
          instanceRef.current = instance;
        }
      );
      return () => {
        if (instanceRef.current) {
          instanceRef.current.dispose();
        }
      };
    }
  }, [config, containerRef]);

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
