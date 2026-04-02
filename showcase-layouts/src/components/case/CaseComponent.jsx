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

import LAYOUT_ASSETS from './CustomLayouts.json';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { DesignEditorConfig } from './lib/design-editor/plugin';
import { createApplyLayoutAsset } from './lib/createApplyLayoutAsset';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';

const caseAssetPath = (path, caseId = 'layouts') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
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
          libraries: {
            replace: {
              floating: false,
              autoClose: false
            },
            insert: {
              autoClose: false,
              floating: false
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
        'libraries.ly.img.layouts.label': 'Layouts'
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
        include: ['ly.img.image.*', 'ly.img.templates.*']
      })
    );

    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    instance.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'ly.img.layouts',
        label: 'libraries.ly.img.layouts.label',
        icon: ({ iconSize }) => {
          return iconSize === 'normal'
            ? caseAssetPath('/collage-small.svg')
            : caseAssetPath('/collage-large.svg');
        },
        entries: ['ly.img.layouts']
      },
      'ly.img.separator',
      ...instance.ui
        .getDockOrder()
        .filter(({ key }) => !['ly.img.template'].includes(key))
    ]);
    instance.ui.addAssetLibraryEntry({
      id: 'ly.img.layouts',
      sourceIds: ['ly.img.layouts'],
      previewLength: 2,
      gridColumns: 2,
      gridItemHeight: 'square',
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain'
    });
    loadAssetSourceFromContentJSON(
      instance.engine,
      LAYOUT_ASSETS,
      caseAssetPath(''),
      createApplyLayoutAsset(instance.engine)
    );
    await instance.loadFromURL(caseAssetPath('/custom-layouts.scene'));
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
