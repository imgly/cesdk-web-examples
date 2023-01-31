import CreativeEditorSDK from '@cesdk/cesdk-js';
import { resizeCanvas } from './lib/CreativeEngineUtils';
import { useEffect, useRef } from 'react';
import ALL_PAGE_SIZES from './PageSizes.json';

const caseAssetPath = (path, caseId = 'page-sizes') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;

const qualifyAssetUris = ({ meta, label, ...rest }) => ({
  ...rest,
  meta: {
    ...meta,
    thumbUri: caseAssetPath(`/${meta.thumbUri}`)
  },
  label,
  cardLabel: label
});

const CaseComponent = () => {
  const cesdk_container = useRef(null);
  const engine = useRef(null);
  const cesdk = useRef(null);
  useEffect(() => {
    /** @type {import(“@cesdk/engine”).Configuration} */
    let config = {
      locale: 'en',
      role: 'Adopter',
      theme: 'light',
      initialSceneURL: caseAssetPath('/page-sizes.scene'),
      license: process.env.REACT_APP_LICENSE,
      callbacks: {
        onExport: 'download'
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
                id: 'pageSizes',
                entryIds: ['pageSizes']
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
                    id: 'pageSizes',
                    sourceIds: ['pageSizes'],
                    previewLength: 3,
                    gridColumns: 3,
                    gridItemHeight: 'auto',

                    previewBackgroundType: 'contain',
                    gridBackgroundType: 'cover',
                    cardLabel: (assetResult) => assetResult.label,
                    cardLabelStyle: () => ({
                      height: '24px',
                      width: '72px',
                      left: '4px',
                      right: '4px',
                      bottom: '-32px',
                      padding: '0',
                      background: 'transparent',
                      overflow: 'hidden',
                      'text-overflow': 'unset',
                      'white-space': 'unset',
                      'font-size': '10px',
                      'line-height': '12px',
                      'letter-spacing': '0.02em',
                      'text-align': 'center',
                      'pointer-events': 'none',
                      pointer: 'default'
                    }),
                    cardStyle: () => ({
                      height: '80px',
                      width: '80px',
                      'margin-bottom': '40px',
                      overflow: 'visible'
                    }),
                    icon: () => caseAssetPath('/page-sizes-large.svg'),
                    title: ({ group }) => {
                      if (group) {
                        return `libraries.pageSizes.${group}.label`;
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
      assetSources: {
        pageSizes: {
          getGroups: async () => ['print', 'social'],
          findAssets: async (queryParameters) => {
            const assets = ALL_PAGE_SIZES.map(qualifyAssetUris).filter(
              ({ meta }) => queryParameters.groups.includes(meta.group)
            );

            return {
              assets,
              total: assets.length,
              nextPage: undefined,
              currentPage: 0
            };
          },
          applyAsset: async (asset) => {
            const pages = engine.current.block.getChildren(
              engine.current.block.findByType('stack')[0]
            );

            if (pages && pages.length) {
              if (asset.meta.designUnit === 'Pixel') {
                engine.current.scene.unstable_setDesignUnit('px');
              } else if (asset.meta.designUnit === 'Millimeter') {
                engine.current.scene.unstable_setDesignUnit('mm');
              } else if (asset.meta.designUnit === 'Inch') {
                engine.current.scene.unstable_setDesignUnit('in');
              }

              pages.forEach((pageId) => {
                resizeCanvas(
                  engine.current,
                  pageId,
                  parseInt(asset.meta.width, 10),
                  parseInt(asset.meta.height, 10)
                );
              });

              await cesdk.current.unstable_focusPage(pages[0]);
            }
          }
        }
      },
      i18n: {
        en: {
          'libraries.pageSizes.label': 'Page Sizes',
          'libraries.pageSizes.social.label': 'Social',
          'libraries.pageSizes.print.label': 'Print'
        }
      }
    };
    if (cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        (instance) => {
          cesdk.current = instance;
          engine.current = instance.engine;
        }
      );
    }
    return () => {
      if (cesdk.current) {
        cesdk.current.dispose();
      }
    };
  }, [cesdk_container, engine, cesdk]);

  return (
    <div style={caseContainerStyle}>
      <div className="caseHeader">
        <h3>Page Sizes</h3>
        <p>
          Design once use anywhere. You can automatically adapt the same design
          or template to different page sizes. This allows your users to roll
          out the same design to different social media platforms or create
          multi-product designs for print.
        </p>
      </div>
      <div style={wrapperStyle}>
        <div ref={cesdk_container} style={cesdkStyle}></div>
      </div>
    </div>
  );
};

const caseContainerStyle = {
  gap: '2.5rem',
  maxHeight: '100%',
  display: 'flex',
  flexGrow: '1',
  flexDirection: 'column',
  minWidth: 0
};

const cesdkStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '0.75rem'
};

const wrapperStyle = {
  borderRadius: '0.75rem',
  flexGrow: '1',
  minHeight: '450px',
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)'
};

export default CaseComponent;
