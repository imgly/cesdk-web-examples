import CreativeEditorSDK from '@cesdk/cesdk-js';
import { createApplyLayoutAsset } from 'lib/createApplyLayoutAsset';
import loadAssetSourceFromContentJSON from 'lib/loadAssetSourceFromContentJSON';
import LAYOUT_ASSETS from './CustomLayouts.json';
import { useEffect, useRef } from 'react';

const caseAssetPath = (path, caseId = 'layouts') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;

const CaseComponent = () => {
  const cesdkContainer = useRef(null);
  const engine = useRef(null);
  useEffect(() => {
    let config = {
      role: 'Adopter',
      theme: 'light',
      initialSceneURL: caseAssetPath('/custom-layouts.scene'),
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onUpload: 'local'
      },
      ui: {
        elements: {
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
                    icon: ({ theme, iconSize }) => {
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
    };
    let cesdk;
    if (cesdkContainer.current) {
      CreativeEditorSDK.init(cesdkContainer.current, config).then(
        (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources();

          loadAssetSourceFromContentJSON(
            instance.engine,
            LAYOUT_ASSETS,
            caseAssetPath(''),
            createApplyLayoutAsset(instance.engine)
          );
          cesdk = instance;
          engine.current = instance.engine;
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
    <div style={cesdkWrapperStyle}>
      <div ref={cesdkContainer} style={cesdkStyle}></div>
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
