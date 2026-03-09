'use client';

import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { unsplashAssetLibrary } from './unsplashAssetLibrary';
import { addPremiumTemplatesAssetSource } from './lib/PremiumTemplateUtilities';

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
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {

    instance.i18n.setTranslations({
      en: {
        'libraries.unsplash.label': 'Unsplash'
      }
    });

    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    await addPremiumTemplatesAssetSource(instance);
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    instance.ui.addAssetLibraryEntry({
      id: 'unsplash',
      sourceIds: ['unsplash'],
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
              key: 'unsplash',
              label: 'libraries.unsplash.label',
              entries: ['unsplash']
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
      return ['unsplash'];
    });
    instance.engine.asset.addSource(unsplashAssetLibrary);
    instance.engine.editor.setSetting('page/title/show', false);

    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/unsplash-image-assets/unsplash.scene`
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
