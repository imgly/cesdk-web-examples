import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef } from 'react';
import ALL_CUSTOM_LAYOUTS from './CustomLayouts.json';
import { copyAssets, getPageInView } from './EngineUtilities';

const caseAssetPath = (path, caseId = 'layouts') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;

const qualifyAssetUris = ({ meta, ...rest }) => ({
  ...rest,
  meta: {
    ...meta,
    sceneUri: caseAssetPath(`/${meta.sceneUri}`),
    thumbUri: caseAssetPath(`/${meta.thumbUri}`)
  }
});

const CaseComponent = () => {
  const cesdk_container = useRef(null);
  const engine = useRef(null);
  useEffect(() => {
    let config = {
      role: 'Adopter',
      theme: 'light',
      initialSceneURL: caseAssetPath('/custom-layouts.scene'),
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
                id: 'customLayouts',
                entryIds: ['customLayouts']
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
                    id: 'customLayouts',
                    sourceIds: ['customLayouts'],
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
      assetSources: {
        customLayouts: {
          applyAsset: async (asset) => {
            let pageToApplyLayoutTo = getPageInView(engine.current);
            const selectedBlocks = engine.current.block.findAllSelected();
            if (
              selectedBlocks.length === 1 &&
              engine.current.block.getType(selectedBlocks[0]).includes('page')
            ) {
              pageToApplyLayoutTo = selectedBlocks[0];
            }
            selectedBlocks.forEach((block) =>
              engine.current.block.setSelected(block, false)
            );
            const sceneString = await fetch(asset.meta.sceneUri).then(
              (response) => response.text()
            );
            const blocks = await engine.current.block.loadFromString(
              sceneString
            );
            const newPage = blocks[0];
            const stack = engine.current.block.findByType('stack')[0];
            engine.current.block.insertChild(stack, newPage, 0);
            // Workaround: We need to force layouting to be able to get the global coordinates from the new template.
            engine.current.block.setRotation(newPage, 0);
            copyAssets(engine.current, pageToApplyLayoutTo, newPage);
            engine.current.block.destroy(pageToApplyLayoutTo);
            return newPage;
          },
          findAssets: () => ({
            assets: ALL_CUSTOM_LAYOUTS.map(qualifyAssetUris),
            total: ALL_CUSTOM_LAYOUTS.length,
            nextPage: undefined,
            currentPage: 0
          })
        }
      },
      i18n: {
        en: {
          'libraries.customLayouts.label': 'Layouts'
        }
      }
    };
    let cesdk;
    if (cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources();
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
  }, [cesdk_container]);

  return (
    <div style={caseContainerStyle}>
      <div className="caseHeader">
        <h3>Layouts</h3>
        <p>
          Add “Layouts” as custom asset type to allow users to choose from a
          library of ready made layouts while keeping their current edits
          unchanged.
        </p>
        <p>Ideal for photo book, collage, or postcard editing use cases.</p>
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
