import CreativeEditorSDK from '@cesdk/cesdk-js';
import { memo, useEffect, useRef } from 'react';
import classes from './CESDKModal.module.css';
import {
  caseAssetPath,
  persistSelectedTemplateToURL
} from '../lib/TemplateUtilities';
import ASSETS from '../Templates.json';

export const CESDKModal = memo(({ asset, onClose }) => {
  const { assets, id: assetSourceId } = ASSETS;
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
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({ sceneMode: 'Design' });
          instanceRef.current = instance;
          // Change the position of the close button to the left
          const closeComponentId = 'ly.img.close.navigationBar';
          const navBarOrder = instance.ui.getNavigationBarOrder();
          let trimmedNavBarOrder = navBarOrder.filter(
            (item) => item.id !== closeComponentId
          );
          instance.ui.setNavigationBarOrder(
            [{ id: closeComponentId }].concat(trimmedNavBarOrder)
          );
          // Populate the premium templates asset source
          instance.engine.asset.addLocalSource(
            assetSourceId,
            undefined,
            async (asset) => {
              if (!asset.meta || !asset.meta.uri)
                throw new Error('Asset does not have a uri');
              if (asset.groups.includes('free')) {
                await instance.engine.scene.loadFromURL(asset.meta.uri);
              } else {
                await instance.engine.scene.loadFromArchiveURL(
                  asset.meta.uri.replace('design.zip', `${asset.id}.zip`)
                );
                persistSelectedTemplateToURL(asset.id);
              }
            }
          );
          // Add demo templates as free templates
          instance.engine.asset.onAssetSourceUpdated(async (sourceID) => {
            if (sourceID === 'ly.img.template') {
              instance.engine.asset
                .findAssets('ly.img.template', {
                  page: 0,
                  perPage: 100
                })
                .then(async (data) => {
                  data.assets.forEach((asset) => {
                    asset.groups = ['free'];
                    instance.engine.asset.addAssetToSource(
                      assetSourceId,
                      asset
                    );
                  });
                  // Add premium templates after the free templates
                  assets.forEach((asset) => {
                    if (asset.meta) {
                      Object.entries(asset.meta).forEach(([key, value]) => {
                        const stringValue = value.toString();
                        if (stringValue.includes('{{base_url}}')) {
                          const updated = stringValue.replace(
                            '{{base_url}}',
                            caseAssetPath('/templates')
                          );
                          if (asset.meta) {
                            asset.meta[key] = updated;
                          }
                        }
                      });
                    }
                    instance.engine.asset.addAssetToSource(
                      assetSourceId,
                      asset
                    );
                  });
                });
            }
          });

          // Clean up the dock
          instance.ui.setDockOrder([
            {
              id: 'ly.img.assetLibrary.dock',
              key: 'premium-templates',
              label: 'libraries.ly.img.templates.premium.label',
              icon: '@imgly/Template',
              entries: ['ly.img.templates.premium']
            },
            ...instance.ui
              .getDockOrder()
              .filter((item) =>
                [
                  'ly.img.upload',
                  'ly.img.image',
                  'ly.img.text',
                  'ly.img.vectorpath',
                  'ly.img.sticker'
                ].includes(item.key)
              )
          ]);
          instance.i18n.setTranslations({
            en: {
              'libraries.ly.img.templates.premium.label': 'Templates',
              'libraries.ly.img.templates.premium.free.label': 'Free',
              'libraries.ly.img.templates.premium.e-commerce.label':
                'E-Commerce',
              'libraries.ly.img.templates.premium.event.label': 'Event',
              'libraries.ly.img.templates.premium.personal.label': 'Personal',
              'libraries.ly.img.templates.premium.professional.label':
                'Professional',
              'libraries.ly.img.templates.premium.socials.label': 'Socials'
            }
          });
          instance.ui.addAssetLibraryEntry({
            id: 'ly.img.templates.premium',
            sourceIds: [assetSourceId],
            previewBackgroundType: 'contain',
            cardLabel: (asset) => asset.label,
            cardLabelPosition: () => 'below'
          });
          instance.engine.editor.setSettingBool('page/title/show', false);
          await instance.engine.scene.loadFromArchiveURL(asset.meta.uri);
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
