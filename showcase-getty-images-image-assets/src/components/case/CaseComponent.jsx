'use client';

import { gettyImagesImageAssets } from './gettyImagesAssetLibrary';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onUpload: 'local'
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    
    instance.i18n.setTranslations({
      en: {
        [`libraries.${gettyImagesImageAssets.id}.label`]: 'Getty Images'
      }
    });

    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    instance.ui.addAssetLibraryEntry({
      id: gettyImagesImageAssets.id,
      sourceIds: [gettyImagesImageAssets.id],
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
              key: gettyImagesImageAssets.id,
              label: `libraries.${gettyImagesImageAssets.id}.label`,
              entries: [gettyImagesImageAssets.id]
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
      return [gettyImagesImageAssets.id];
    });
    instance.engine.asset.addSource(gettyImagesImageAssets);
    instance.engine.editor.setSetting('page/title/show', false);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/getty-images-image-assets/getty-images.scene`
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
