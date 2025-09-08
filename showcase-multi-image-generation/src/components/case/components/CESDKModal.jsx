import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import classes from './CESDKModal.module.css';

export const CESDKModal = ({ config, configure }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  useEffect(() => {
    if (containerRef.current && !instanceRef.current) {
      CreativeEditorSDK.create(containerRef.current, config).then(
        async (cesdk) => {
          cesdk.addDefaultAssetSources();
          cesdk.addDemoAssetSources({ sceneMode: 'Design' });
          if (configure) {
            await configure(cesdk);
          }
          instanceRef.current = cesdk;
          // change the position of the close button to the left
          const closeComponentId = 'ly.img.close.navigationBar';
          const navBarOrder = cesdk.ui.getNavigationBarOrder();
          let trimmedNavBarOrder = navBarOrder.filter(
            (item) => item.id !== closeComponentId
          );
          cesdk.ui.setNavigationBarOrder(
            [{ id: closeComponentId }].concat(trimmedNavBarOrder)
          );
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

  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <div ref={containerRef} className={classes.cesdkContainer}></div>
      </div>
    </div>
  );
};

export default CESDKModal;
