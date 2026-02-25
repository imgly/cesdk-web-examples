'use client';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { DesignEditorConfig } from './lib/design-editor/plugin';
import { pexelsAssetLibrary } from './pexelsAssetLibrary';
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
    // Add the design editor configuration plugin first
    await instance.addPlugin(new DesignEditorConfig());

    instance.i18n.setTranslations({
      en: {
        'libraries.pexels.label': 'Pexels'
      }
    });

    // Asset Source Plugins (replaces addDefaultAssetSources)
    await instance.addPlugin(new ColorPaletteAssetSource());
    await instance.addPlugin(new TypefaceAssetSource());
    await instance.addPlugin(new TextAssetSource());
    await instance.addPlugin(new TextComponentAssetSource());
    await instance.addPlugin(new VectorShapeAssetSource());
    await instance.addPlugin(new StickerAssetSource());
    await instance.addPlugin(new EffectsAssetSource());
    await instance.addPlugin(new FiltersAssetSource());
    await instance.addPlugin(new BlurAssetSource());
    await instance.addPlugin(new PagePresetsAssetSource());
    await instance.addPlugin(new CropPresetsAssetSource());
    await instance.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    );

    // Demo assets (replaces addDemoAssetSources)
    await instance.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    );

    await addPremiumTemplatesAssetSource(instance);

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
    instance.ui.setReplaceAssetLibraryEntries(
      ({ selectedBlocks, defaultEntryIds, replaceIntent }) => {
        if (
          replaceIntent === 'fill' &&
          selectedBlocks.length === 1 &&
          selectedBlocks[0].fillType === '//ly.img.ubq/fill/image'
        ) {
          return ['pexels'];
        }
        return defaultEntryIds;
      }
    );
    instance.engine.asset.addSource(pexelsAssetLibrary);
    instance.engine.editor.setSetting('page/title/show', false);
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
