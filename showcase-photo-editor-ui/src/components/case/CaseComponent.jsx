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

import { initPhotoEditorUIConfig } from './PhotoEditorUIConfig';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { DesignEditorConfig } from './lib/design-editor/plugin';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Adopter',
      theme: 'dark',
      license: process.env.NEXT_PUBLIC_LICENSE,

      ui: {
        elements: {
          blocks: {
            '//ly.img.ubq/page': {
              stroke: { show: false },
              manage: false
            }
          },
          panels: {
            inspector: {
              show: true,
              position: 'left'
            }
          },
          libraries: {
            replace: {
              floating: true,
              autoClose: true
            },
            insert: {
              autoClose: false,
              floating: false
            }
          },
          navigation: {
            title: 'Photo Editor',
            action: {
              export: {
                show: true,
                format: ['image/png']
              }
            }
          }
        },
        cropPresetsLibraries: (engine) => {
          const [selectedBlock] = engine.block.findAllSelected();
          const isPage =
            selectedBlock != null &&
            engine.block.getType(selectedBlock) === '//ly.img.ubq/page';

          if (isPage) return ['ly.img.crop.presets', 'ly.img.page.presets'];

          return ['ly.img.crop.presets'];
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

    instance.i18n.setTranslations({
      en: {
        'component.fileOperation.exportImage': 'Export Image'
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

    const cleanup = await initPhotoEditorUIConfig(
      instance,
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dom-hill-nimElTcTNyY-unsplash.jpg&w=1920'
    );
    return cleanup;
  }, []);

  return (
    <div className="cesdkWrapperStyle">
      <CreativeEditor
        className="cesdkStyle"
        style={{
          // Hide the inspector bar
          '--ubq-InspectorBar-background': 'var(--ubq-canvas)'
        }}
        config={config}
        configure={configure}
      />
    </div>
  );
};
export default CaseComponent;
