'use client';

import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { pexelsAssetLibrary } from './pexelsAssetLibrary';

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
          'libraries.pexels.label': 'Pexels'
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
      id: 'pexels',
      sourceIds: ['pexels'],
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
              key: 'pexels',
              label: 'libraries.pexels.label',
              entries: ['pexels']
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
      return ['pexels'];
    });
    instance.engine.asset.addSource(pexelsAssetLibrary);
    instance.engine.editor.setSettingBool('page/title/show', false);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/pexels-image-assets/pexels.scene`
    );
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
