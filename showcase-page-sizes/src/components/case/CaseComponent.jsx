import CreativeEditorSDK from '@cesdk/cesdk-js';
import loadAssetSourceFromContentJSON from 'lib/loadAssetSourceFromContentJSON';
import { useEffect, useRef } from 'react';
import { createApplyFormatAssetAdvanced } from './createApplyFormatAdvanced';
import FORMAT_ASSETS from './CustomFormats.json';

const caseAssetPath = (path, caseId = 'page-sizes') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;

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
      },
      // Begin standard template presets
      presets: {
        templates: {
          postcard_1: {
            label: 'Postcard Design',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.png`
          },
          postcard_2: {
            label: 'Postcard Tropical',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.png`
          },
          business_card_1: {
            label: 'Business card',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_business_card_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_business_card_1.png`
          },
          instagram_photo_1: {
            label: 'Instagram photo',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_photo_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_photo_1.png`
          },
          poster_1: {
            label: 'Poster',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_poster_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_poster_1.png`
          },
          presentation_4: {
            label: 'Presentation',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_presentation_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_presentation_1.png`
          },
          collage_1: {
            label: 'Collage',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_collage_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_collage_1.png`
          }
        }
      }
      // End standard template presets
    };
    if (cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources();
          loadAssetSourceFromContentJSON(
            instance.engine,
            FORMAT_ASSETS,
            caseAssetPath(''),
            createApplyFormatAssetAdvanced(instance.engine)
          );
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
    <div style={cesdkWrapperStyle}>
      <div ref={cesdk_container} style={cesdkStyle}></div>
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

export default CaseComponent;
