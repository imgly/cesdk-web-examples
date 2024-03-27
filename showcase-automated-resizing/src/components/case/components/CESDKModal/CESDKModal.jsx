import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef } from 'react';
import classes from './CESDKModal.module.css';

const useOnClickOutside = (ref, callback) => {
  const handleClick = (e) => {
    // Use isTrusted to check if the event is coming from a real user, or is coming from a script.
    if (ref.current && !ref.current.contains(e.target) && e.isTrusted) {
      callback();
    }
  };
  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

const CESDKModal = ({ config, configure, onOutsideClick }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  useEffect(() => {
    config.license = process.env.NEXT_PUBLIC_LICENSE;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
