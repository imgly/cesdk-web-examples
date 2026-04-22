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

import BackgroundRemovalPlugin from '@imgly/plugin-background-removal-web';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { DesignEditorConfig } from './lib/design-editor/plugin';
import { addPremiumTemplatesAssetSource } from './lib/PremiumTemplateUtilities';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
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
    await instance.addPlugin(
      BackgroundRemovalPlugin({
        ui: {
          locations: ['canvasMenu']
        }
      })
    );
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/background-removal/scene.scene`
    );
    const engine = instance.engine;
    // hide the title of the page:
    engine.editor.setSetting('page/title/show', false);

    // Select the first image on canvas to highlight background removal option:
    const image = engine.block.findByName('FirstImage')[0];
    const selected = engine.block.findAllSelected();
    selected.forEach((block) => {
      engine.block.setSelected(block, false);
    });
    engine.block.setSelected(image, true);
  });

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
