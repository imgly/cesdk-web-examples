'use client';

import { airtableAssetLibrary } from './airtableAssetLibrary';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
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
          }
        }
      },
      i18n: {
        en: {
          'libraries.airtable.label': 'Airtable'
        }
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);

    instance.ui.addAssetLibraryEntry({
      id: 'airtable',
      sourceIds: ['airtable'],
      previewLength: 3,
      gridItemHeight: 'auto',
      gridBackgroundType: 'cover',
      gridColumns: 2
    });

    instance.ui.setDockOrder(
      instance.ui.getDockOrder().map((component) =>
        ['ly.img.image'].includes(component.key)
          ? {
              id: 'ly.img.assetLibrary.dock',
              key: 'airtable',
              label: 'libraries.airtable.label',
              entries: ['airtable']
            }
          : component
      )
    );

    instance.ui.setReplaceAssetLibraryEntries(({ selectedBlocks, _ }) => {
      if (
        selectedBlocks.length !== 1 ||
        selectedBlocks[0].fillType !== '//ly.img.ubq/fill/image'
      ) {
        return [];
      }
      return ['airtable'];
    });

    instance.engine.asset.addSource(airtableAssetLibrary);
    instance.engine.editor.setSettingBool('page/title/show', false);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/airtable-image-assets/airtable.scene`
    );
  }, []);

  return (
    <div style={wrapperStyle}>
      <div className="cesdkWrapperStyle">
        <CreativeEditor
          className="cesdkStyle"
          config={config}
          configure={configure}
        />
      </div>
      <div style={sidebarStyle}>
        <iframe
          className="airtable-embed"
          src="https://airtable.com/embed/shr4x8s9jqaxiJxm5?backgroundColor=orange"
          frameBorder="0"
          width="280"
          title="airtable"
          style={airtableStyle}
        ></iframe>
      </div>
    </div>
  );
};

const wrapperStyle = {
  flex: '1',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem'
};

const sidebarStyle = {
  flexBasis: '280px',
  flexShrink: 0,
  boxShadow:
    '0px 0px 2px rgba(18, 26, 33, 0.25), 0px 6px 6px -2px rgba(18, 26, 33, 0.12), 0px 2.5px 2.5px -2px rgba(18, 26, 33, 0.12), 0px 1.25px 1.25px -2px rgba(18, 26, 33, 0.12)',
  borderRadius: '12px'
};
const airtableStyle = {
  background: 'transparent',
  border: '1px solid #ccc',
  borderRadius: '12px',
  flexGrow: 1,
  height: '100%'
};

export default CaseComponent;
