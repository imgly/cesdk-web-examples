'use client';

import LAYOUT_ASSETS from './CustomLayouts.json';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { createApplyLayoutAsset } from './lib/createApplyLayoutAsset';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';

const caseAssetPath = (path, caseId = 'layouts') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Adopter',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          },
          dock: {
            groups: [
              {
                id: 'ly.img.layouts',
                entryIds: ['ly.img.layouts']
              },
              {
                id: 'ly.img.defaultGroup',
                showOverview: true
              }
            ],
            defaultGroupId: 'ly.img.defaultGroup'
          },
          panels: {
            settings: true
          },
          libraries: {
            replace: {
              floating: false,
              autoClose: false
            },
            insert: {
              autoClose: false,
              floating: false,
              entries: (defaultEntries) => {
                return [
                  {
                    id: 'ly.img.layouts',
                    sourceIds: ['ly.img.layouts'],
                    previewLength: 2,
                    gridColumns: 2,
                    gridItemHeight: 'square',

                    previewBackgroundType: 'contain',
                    gridBackgroundType: 'contain',
                    icon: ({ iconSize }) => {
                      return iconSize === 'normal'
                        ? caseAssetPath('/collage-small.svg')
                        : caseAssetPath('/collage-large.svg');
                    }
                  },
                  ...defaultEntries.filter(({ id }) => id !== 'ly.img.template')
                ];
              }
            }
          }
        }
      },
      i18n: {
        en: {
          'libraries.ly.img.layouts.label': 'Layouts'
        }
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    loadAssetSourceFromContentJSON(
      instance.engine,
      LAYOUT_ASSETS,
      caseAssetPath(''),
      createApplyLayoutAsset(instance.engine)
    );
    await instance.loadFromURL(caseAssetPath('/custom-layouts.scene'));
  }, []);

  return (
    <div className="cesdkWrapperStyle">
      <CreativeEditor
        className="cesdkStyle"
        config={config}
        configure={configure}
      />
    </div>
  );
};

export default CaseComponent;
