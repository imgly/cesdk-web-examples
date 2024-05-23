'use client';

import FORMAT_ASSETS from './CustomFormats.json';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';

const caseAssetPath = (path, caseId = 'page-sizes') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

const LABEL_BELOW_CARD_STYLE = {
  cardLabelStyle: () => ({
    height: '24px',
    width: '72px',
    left: '4px',
    right: '4px',
    bottom: '-32px',
    padding: '0',
    background: 'transparent',
    overflow: 'hidden',
    textOverflow: 'unset',
    whiteSpace: 'unset',
    fontSize: '10px',
    lineHeight: '12px',
    letterSpacing: '0.02em',
    textAlign: 'center',
    pointerEvents: 'none',
    pointer: 'default'
  }),
  cardStyle: () => ({
    height: '80px',
    width: '80px',
    marginBottom: '40px',
    overflow: 'visible'
  })
};

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
                    cardStyle: LABEL_BELOW_CARD_STYLE.cardStyle,
                    cardLabelStyle: LABEL_BELOW_CARD_STYLE.cardLabelStyle,
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
    <div style={cesdkWrapperStyle}>
      <CreativeEditor
        style={cesdkStyle}
        config={config}
        configure={configure}
      />
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

export default CaseComponent;
