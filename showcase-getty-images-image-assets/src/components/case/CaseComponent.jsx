'use client';

import { gettyImagesImageAssets } from './gettyImagesAssetLibrary';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Adopter',
      license: process.env.NEXT_PUBLIC_LICENSE,
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
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    instance.engine.asset.addSource(gettyImagesImageAssets);
    instance.engine.editor.setSettingBool('page/title/show', false);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/getty-images-image-assets/getty-images.scene`
    );
  }, []);

  return (
    <div style={wrapperStyle}>
      <div style={cesdkWrapperStyle}>
        <CreativeEditor
          style={cesdkStyle}
          config={config}
          configure={configure}
        />
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
