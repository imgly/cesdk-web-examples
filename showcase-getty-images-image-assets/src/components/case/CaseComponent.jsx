import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import { gettyImagesImageAssets } from './gettyImagesAssetLibrary';

const CaseComponent = () => {
  const cesdkContainer = useRef(null);

  useEffect(() => {
    let cesdk;
    /** @type {import('@cesdk/cesdk-js').Configuration} */
    let config = {
      role: 'Adopter',
      license: process.env.REACT_APP_LICENSE,
      ui: {
        elements: {
          panels: {
            settings: true
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
                    id: gettyImagesImageAssets.id,
                    sourceIds: [gettyImagesImageAssets.id],
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
                    id: gettyImagesImageAssets.id,
                    sourceIds: [gettyImagesImageAssets.id],
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
          [`libraries.${gettyImagesImageAssets.id}.label`]: 'Getty Images'
        }
      },
      callbacks: {
        onUpload: 'local'
      }
    };

    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          cesdk = instance;
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({
            sceneMode: 'Design',
            excludeAssetSourceIds: ['ly.img.image']
          });
          instance.engine.asset.addSource(gettyImagesImageAssets);
          instance.engine.editor.setSettingBool('page/title/show', false);
          await instance.loadFromURL(
            `${window.location.protocol + "//" + window.location.host}/cases/getty-images-image-assets/getty-images.scene`
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
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)'
};

const wrapperStyle = {
  flex: '1',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem'
};

export default CaseComponent;
