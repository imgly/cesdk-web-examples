'use client';

import CutoutLibraryPlugin from '@imgly/plugin-cutout-library-web';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      ui: {
        elements: {
          panels: {
            settings: true
          },
          navigation: {
            action: {
              export: {
                show: true,
                // Cutouts make sense for PDF exports
                format: ['application/pdf']
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
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);

    instance.addPlugin(
      CutoutLibraryPlugin({ ui: { locations: ['canvasMenu'] } })
    );
    const cutoutAssetEntry = instance.ui.getAssetLibraryEntry(
      'ly.img.cutout.entry'
    );
    instance.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        label: 'Cutout',
        key: 'ly.img.assetLibrary.dock',
        icon: cutoutAssetEntry?.icon,
        entries: ['ly.img.cutout.entry']
      },
      ...instance.ui
        .getDockOrder()
        .filter(({ key }) => key !== 'ly.img.template')
    ]);
    await instance.engine.scene.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/cutout-lines/example.scene`
    );
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
