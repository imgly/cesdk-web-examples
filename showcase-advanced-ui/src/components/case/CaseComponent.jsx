'use client';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  PremiumTemplatesAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { DesignEditorConfig } from './lib/design-editor/plugin';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      theme: 'dark',
      license: process.env.NEXT_PUBLIC_LICENSE,
      ui: {
        elements: {
          view: 'advanced',
          panels: {
            inspector: {
              show: true,
              position: 'right'
            },
            settings: true
          },
          dock: {
            iconSize: 'normal',
            hideLabels: true
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
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      }
    }),
    []
  );

  const configure = useConfigure(async (instance) => {
    // Add the design editor configuration plugin first
    await instance.addPlugin(new DesignEditorConfig());

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

    await instance.addPlugin(new PremiumTemplatesAssetSource());
    // Demo assets (replaces addDemoAssetSources)
    await instance.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    );

    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder');
    instance.feature.disable('ly.img.preview');
    // Enable vector path editing
    instance.feature.enable('ly.img.shape.edit');
    instance.feature.enable('ly.img.vectorEdit');
    instance.feature.enable('ly.img.vectorEdit.moveMode');
    instance.feature.enable('ly.img.vectorEdit.addMode');
    instance.feature.enable('ly.img.vectorEdit.deleteMode');
    instance.feature.enable('ly.img.vectorEdit.bendMode');
    instance.feature.enable('ly.img.vectorEdit.mirrorMode');
    instance.feature.enable('ly.img.vectorEdit.done');
    // Add archive actions as dropdown items on the primary export button
    instance.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.title.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      'ly.img.preview.navigationBar',
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          'ly.img.exportImage.navigationBar',
          'ly.img.exportPDF.navigationBar',
          'ly.img.separator',
          'ly.img.exportArchive.navigationBar',
          'ly.img.importArchive.navigationBar'
        ]
      }
    ]);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/example-1.scene`
    );
    // find first image element
    const engine = instance.engine;
    const [imageElement] = engine.block.findByName('HeroImage');
    if (imageElement) {
      // set image element to be selected
      engine.block.select(imageElement);
    }
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
