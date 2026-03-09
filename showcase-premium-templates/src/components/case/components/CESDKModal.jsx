import CreativeEditorSDK from '@cesdk/cesdk-js';
import { memo, useEffect, useRef } from 'react';
import {
  getTemplateBaseURL,
  addPremiumTemplatesAssetSource
} from '../lib/PremiumTemplateUtilities';
import classes from './CESDKModal.module.css';

export const CESDKModal = memo(({ asset, onClose }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const config = {
    license: process.env.NEXT_PUBLIC_LICENSE,
    callbacks: {
      onClose: () => {
        onClose();
      },
      onUpload: 'local'
    },
    role: 'Adopter',
    ui: {
      elements: {
        navigation: {
          title: `${asset.label.en}`,
          action: {
            close: true
          }
        }
      }
    }
  };
  useEffect(() => {
    if (containerRef.current && !instanceRef.current) {
      CreativeEditorSDK.create(containerRef.current, config).then(
        async (cesdk) => {
          const baseURL = getTemplateBaseURL();

          await Promise.all([
            cesdk.addDefaultAssetSources(),
            cesdk.addDemoAssetSources({ sceneMode: 'Design' }),
            addPremiumTemplatesAssetSource(cesdk, true)
          ]);

          instanceRef.current = cesdk;
          // Change the position of the close button to the left
          const closeComponentId = 'ly.img.close.navigationBar';
          const navBarOrder = cesdk.ui.getNavigationBarOrder();
          let trimmedNavBarOrder = navBarOrder.filter(
            (item) => item.id !== closeComponentId
          );
          cesdk.ui.setNavigationBarOrder(
            [{ id: closeComponentId }].concat(trimmedNavBarOrder)
          );

          cesdk.engine.editor.setSetting('page/title/show', false);

          const archiveURL = asset.meta.uri.replace(
            '{{base_url}}',
            `${baseURL}/dist`
          );
          if (baseURL) {
            await cesdk.engine.scene.loadFromArchiveURL(archiveURL);
          }
        }
      );

      const closeOnOutsideClick = (e) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target) &&
          e.isTrusted
        ) {
          onClose();
        }
      };
      document.addEventListener('click', closeOnOutsideClick);

      return () => {
        document.removeEventListener('click', closeOnOutsideClick);
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
});

CESDKModal.displayName = 'CESDKModal';
export default CESDKModal;
