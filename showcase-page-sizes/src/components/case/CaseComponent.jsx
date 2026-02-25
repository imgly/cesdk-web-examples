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

const caseAssetPath = (path, caseId = 'page-sizes') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

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

    // Register custom dock button component
    instance.ui.registerComponent(
      'ly.img.page.resize.dock',
      ({ builder: { Button } }) => {
        const isResizePanelOpen = instance.ui.isPanelOpen(
          '//ly.img.panel/inspector/pageResize'
        );

        Button('open-page-resize', {
          label: 'Page Sizes',
          icon: () => caseAssetPath('/page-sizes-large.svg'),
          isSelected: isResizePanelOpen,
          onClick: () => {
            if (isResizePanelOpen) {
              instance.ui.closePanel('//ly.img.panel/inspector/pageResize');
            } else {
              instance.ui.openPanel('//ly.img.panel/inspector/pageResize');
            }
          }
        });
      }
    );

    // Add custom dock button to dock order
    instance.ui.setDockOrder([
      'ly.img.page.resize.dock',
      'ly.img.separator',
      ...instance.ui.getDockOrder()
    ]);

    await instance.loadFromURL(caseAssetPath('/page-sizes.scene'));
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
