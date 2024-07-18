'use client';

import FORMAT_ASSETS from './CustomFormats.json';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';

const caseAssetPath = (path, caseId = 'page-sizes') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      locale: 'en',
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
                id: 'ly.img.formats',
                entryIds: ['ly.img.formats']
              },
              {
                id: 'ly.img.template',
                entryIds: ['ly.img.template']
              },
              {
                id: 'ly.img.defaultGroup',
                showOverview: true
              }
            ]
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
                    id: 'ly.img.formats',
                    sourceIds: ['ly.img.formats'],
                    previewLength: 3,
                    gridColumns: 3,
                    gridItemHeight: 'auto',

                    previewBackgroundType: 'contain',
                    gridBackgroundType: 'cover',
                    cardLabel: (assetResult) => assetResult.label,
                    cardLabelPosition: () => 'bottom',
                    icon: () => caseAssetPath('/page-sizes-large.svg'),
                    title: ({ group }) => {
                      if (group) {
                        return `libraries.ly.img.formats.${group}.label`;
                      }
                      return undefined;
                    }
                  },
                  ...defaultEntries
                ];
              }
            }
          }
        }
      },
      i18n: {
        en: {
          'libraries.ly.img.formats.label': 'Page Sizes',
          'libraries.ly.img.formats.social.label': 'Social',
          'libraries.ly.img.formats.print.label': 'Print'
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
      FORMAT_ASSETS,
      caseAssetPath(''),
      async (asset) => {
        const engine = instance.engine;
        // disable checkScopesInAPIs setting
        const checkScopesInAPIsSetting =
          engine.editor.getSettingBool('checkScopesInAPIs');
        engine.editor.setSettingBool('checkScopesInAPIs', false);
        const pages = engine.scene.getPages();
        engine.scene.setDesignUnit(asset.meta.designUnit);
        engine.block.resizeContentAware(
          pages,
          parseInt(asset.meta.formatWidth, 10),
          parseInt(asset.meta.formatHeight, 10)
        );
        // restore checkScopesInAPIs setting
        engine.editor.setSettingBool(
          'checkScopesInAPIs',
          checkScopesInAPIsSetting
        );
      }
    );
    await instance.loadFromURL(caseAssetPath('/page-sizes.scene'));
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
