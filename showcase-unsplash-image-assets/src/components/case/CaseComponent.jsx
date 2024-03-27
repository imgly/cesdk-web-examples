'use client';

import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import { unsplashAssetLibrary } from './unsplashAssetLibrary';

const CaseComponent = () => {
  const cesdkContainer = useRef(null);

  useEffect(() => {
    let cesdk;
    let config = {
      role: 'Adopter',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          panels: {
            settings: true
          },
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          },
          libraries: {
            insert: {
              floating: false,
              entries: (defaultEntries) => {
                const entriesWithoutDefaultImages = defaultEntries.filter(
                  (entry) => {
                    return entry.id !== 'ly.img.image';
                  }
                );
                return [
                  {
                    id: 'unsplash',
                    sourceIds: ['unsplash'],
                    previewLength: 3,
                    gridItemHeight: 'auto',
                    gridBackgroundType: 'cover',
                    gridColumns: 2
                  },
                  ...entriesWithoutDefaultImages
                ];
              }
            },
            replace: {
              floating: false,
              entries: (defaultEntries, context) => {
                if (
                  context.selectedBlocks.length !== 1 ||
                  context.selectedBlocks[0].fillType !==
                    '//ly.img.ubq/fill/image'
                ) {
                  return [];
                }
                return [
                  {
                    id: 'unsplash',
                    sourceIds: ['unsplash'],
                    previewLength: 3,
                    gridItemHeight: 'auto',
                    gridBackgroundType: 'cover',
                    gridColumns: 2
                  }
                ];
              }
            }
          }
        }
      },
      i18n: {
        en: {
          'libraries.unsplash.label': 'Unsplash'
        }
      }
    };

    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({ sceneMode: 'Design' });
          instance.engine.asset.addSource(unsplashAssetLibrary);
          instance.engine.editor.setSettingBool('page/title/show', false);
          cesdk = instance;
          await cesdk.loadFromURL(
            `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/unsplash-image-assets/unsplash.scene`
          );
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
    <div style={wrapperStyle}>
      <div style={cesdkWrapperStyle}>
        <div ref={cesdkContainer} style={cesdkStyle}></div>
      </div>
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

const wrapperStyle = {
  flex: '1',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem'
};

export default CaseComponent;
