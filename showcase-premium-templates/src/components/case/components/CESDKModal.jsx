import CreativeEditorSDK from '@cesdk/cesdk-js';
import { memo, useEffect, useRef } from 'react';
import {
  getTemplateBaseURL,
  persistSelectedTemplateToURL
} from '../lib/TemplateUtilities';
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
          const engine = cesdk.engine;

          // Fetch and prepare asset source with replaced base URLs
          const assetSourcePromise = baseURL
            ? (async () => {
                const response = await fetch(
                  `${baseURL}/dist/templates/content.json`
                );
                const assetSourceData = await response.json();

                // Replace {{base_url}} placeholders in the JSON
                const assetSourceString = JSON.stringify(assetSourceData);
                const replacedString = assetSourceString.replace(
                  /\{\{base_url\}\}/g,
                  `${baseURL}/dist`
                );
                const modifiedAssetSource = JSON.parse(replacedString);

                // Extract assets and create source without them
                const { assets, id } = modifiedAssetSource;

                // Add local source without assets
                engine.asset.addLocalSource(id, [], async (asset) => {
                  await engine.scene.loadFromArchiveURL(asset.meta.uri);
                  persistSelectedTemplateToURL(asset.id);
                });

                // Add each asset individually to the source
                if (assets && Array.isArray(assets)) {
                  for (const asset of assets) {
                    engine.asset.addAssetToSource(id, asset);
                  }
                }
              })()
            : Promise.resolve();

          await Promise.all([
            cesdk.addDefaultAssetSources(),
            cesdk.addDemoAssetSources({ sceneMode: 'Design' }),
            assetSourcePromise
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

          cesdk.i18n.setTranslations({
            en: {
              'libraries.ly.img.template.ly.img.template.premium1.label':
                'Templates',
              'libraries.ly.img.template.ly.img.template.premium1.e-commerce.label':
                'E-Commerce',
              'libraries.ly.img.template.ly.img.template.premium1.event.label':
                'Event',
              'libraries.ly.img.template.ly.img.template.premium1.personal.label':
                'Personal',
              'libraries.ly.img.template.ly.img.template.premium1.professional.label':
                'Professional',
              'libraries.ly.img.template.ly.img.template.premium1.socials.label':
                'Socials'
            }
          });
          cesdk.ui.updateAssetLibraryEntry('ly.img.template', {
            sourceIds: ['ly.img.template.premium1'],
            previewBackgroundType: 'contain',
            cardLabel: (asset) => asset.label,
            cardLabelPosition: () => 'below',
            promptBeforeApply: false
          });
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
